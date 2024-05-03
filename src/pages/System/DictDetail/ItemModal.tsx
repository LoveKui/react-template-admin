/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-03-29 11:37:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-14 09:18:31
 */
import * as DictDetailAPI from '@/services/dictDetail/api';
import { Form, Input, InputNumber, message, Modal, Select } from 'antd';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
interface Props {
  open: boolean;
  dictSelect: Dict.Item;
  item?: DictDetail.Item;
  onOk: (flag: boolean) => void;
}
const Index: React.FC<Props> = ({ open, item, onOk,dictSelect }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({ ...item,dictName:dictSelect.name });
  }, [item]);

  const isAdd = useMemo(() => (_.isEmpty(item) ? true : false), [item]);
  const onOkHandler = () => {
    form.validateFields().then((res) => {
      setLoading(true);

      if (isAdd) {
        DictDetailAPI.create({...res,dictId:dictSelect.id}).then((k) => {
          if (k.code === 200) {
            message.success('添加成功');
            onOk(true);
          } else {
            message.error('添加失败');
          }
          setLoading(false);
        });
      } else {
        const { updateTime, createTime, ...newItem } = item as Dict.Item;
        DictDetailAPI.update({ ...newItem, ...res }).then((k) => {
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
      title={isAdd ? '添加数据字典信息' : '修改数据字典信息'}
      onCancel={() => {
        onOk(false);
      }}
      open={open}
      onOk={onOkHandler}
      okButtonProps={{ loading }}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        form={form}
        initialValues={{
          dictSort: 1,
        }}
      >
           <Form.Item name="dictName" label="字典名称"  rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="label" label="名称(键)" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="value" label="值" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="dictSort" label="顺序" rules={[{ required: false }]}>
          <InputNumber min={0} max={999} step={1} />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default Index;
