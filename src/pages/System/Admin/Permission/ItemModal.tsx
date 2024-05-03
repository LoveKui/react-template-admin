/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-03-29 11:37:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-11-18 21:14:21
 */
import * as permissionAPI from '@/services/permission/api';
import { Form, Input, message, Modal, Select, TreeSelect } from 'antd';
import React, { useEffect, useState } from 'react';
interface Props {
  open: boolean;
  item?: Permission.Item;
  onOk: (flag: boolean) => void;
  type?: 'add' | 'update';
}
const Index: React.FC<Props> = ({ open, item, onOk, type }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<Permission.Item[]>([]);
  const [treeDataLoading, setTreeDataLoading] = useState(false);

  useEffect(() => {
    if (type === 'update') {
      form.setFieldsValue({ ...item, pid: item?.pid });
    }
  }, [item]);

  const isAdd = type === 'add' ? true : false;
  useEffect(() => {
    getPrimissionData();
  }, []);

  const getPrimissionData = async () => {
    setTreeDataLoading(true);
    const res = await permissionAPI.getLazyTree({ type: 0 });

    function convertData(data: any[]) {
      return data?.map((el) => {
        return {
          ...el,
          children: el?.children ? convertData(el?.children) : null,
          value: el.id,
          title: el.name,
        };
      });
    }

    const newData = convertData(res?.data);

    setTreeData(newData);
    setTreeDataLoading(false);
  };

  const onOkHandler = () => {
    form.validateFields().then((res) => {
      setLoading(true);

      if (isAdd) {
        permissionAPI.add({ ...res, pid: item?.id || null }).then((k) => {
          if (k.code === 200) {
            message.success('添加成功');
            onOk(true);
          } else {
            message.error('添加失败');
          }
          setLoading(false);
        });
      } else {
        const {children, ...newItem } = item;
        permissionAPI.updateById({ ...newItem, ...res }).then((k) => {
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
  return (
    <Modal
      title={isAdd ? '添加权限信息' : '修改权限信息'}
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
        initialValues={{
          locked: false,
        }}
      >
        {!isAdd && (
          <Form.Item name="pid" label="目录">
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择目录"
              allowClear
              treeDefaultExpandAll
              treeData={treeData}
              loading={treeDataLoading}
            />
          </Form.Item>
        )}

        <Form.Item name="name" label="名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="type" label="节点类型" rules={[{ required: true }]}>
          <Select>
            <Select.Option key={0} value={0}>
              目录
            </Select.Option>
            <Select.Option key={1} value={1}>
              权限
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="description" label="描述" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="url" label="权限值" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Index;
