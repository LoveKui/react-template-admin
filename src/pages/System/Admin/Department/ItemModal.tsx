/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-03-29 11:37:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-21 22:11:04
 */
import * as departmentAPI from '@/services/department/api';
import { Form, Input, message, Modal, Select, TreeSelect } from 'antd';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
interface Props {
  treeData: any[];
  open: boolean;
  item?: Department.Item;
  onOk: (flag: boolean) => void;
}
let indexTime: any;
const Index: React.FC<Props> = ({ open, item, onOk, treeData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const aa = { ...item };
    form.setFieldsValue(aa);
  }, [item]);

  const isAdd = useMemo(() => (_.isEmpty(item) ? true : false), [item]);
  const onOkHandler = () => {
    form.validateFields().then((res) => {
      setLoading(true);

      let params = {
        ...res,
      } as Department.Item;
      if (isAdd) {
        departmentAPI
          .add({ ...res, parentId: res?.parentId === 0 ? null : res?.parentId })
          .then((k) => {
            if (k.code === 200) {
              message.success('添加成功');
              onOk(true);
            } else {
              message.error('添加失败');
            }
            setLoading(false);
          });
      } else {
        const { ...newItem } = item;
        departmentAPI
          .updateById({ ...newItem, ...res, parentId: res?.parentId === 0 ? null : res?.parentId })
          .then((k) => {
            if (k.code === 200) {
              message.success('更新成功');
              onOk(true);
            } else {
              message.error('更新失败');
            }
            setLoading(false);
          });
      }
      console.log(res);
    });
  };
  const onValuesChange = (changedValues, allValues) => {
    clearTimeout(indexTime);
    if (changedValues?.secondPassword && allValues?.password) {
      indexTime = setTimeout(() => {
        if (allValues?.password !== changedValues?.secondPassword) {
          message.warning('两次密码输入不一致');
          return;
        }
      }, 2000);
    }
  };
  return (
    <Modal
      title={isAdd ? '添加部门信息' : '修改部门信息'}
      onCancel={() => {
        onOk(false);
      }}
      open={open}
      onOk={onOkHandler}
      okButtonProps={{ loading }}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        form={form}
        initialValues={{}}
        onValuesChange={onValuesChange}
      >
        <Form.Item name="name" label="部门名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        {/* <Form.Item name="remark" label="remark" rules={[{ required: false }]}>
          <Input />
        </Form.Item> */}
        <Form.Item name="parentId" label="上级部门" rules={[{ required: false }]}>
          <TreeSelect
            showSearch
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择上级部门"
            allowClear
            treeDefaultExpandAll
            treeData={treeData}
          />
        </Form.Item>
        {/* <Form.Item name="priority" label="priority" rules={[{ required: false }]}>
          <Select>
            <Select.Option value={1}>是</Select.Option>
            <Select.Option value={0}>否</Select.Option>
          </Select>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default Index;
