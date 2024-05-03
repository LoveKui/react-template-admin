/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-03-29 11:37:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-14 09:18:23
 */
import * as DictAPI from '@/services/dict/api';
import { Form, Input, message, Modal, Select } from 'antd';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
interface Props {
  open: boolean;
  item?: Dict.Item;
  onOk: (flag: boolean) => void;
}
const Index: React.FC<Props> = ({ open, item, onOk }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.setFieldsValue({ ...item });
  }, [item]);

  const isAdd = useMemo(() => (_.isEmpty(item) ? true : false), [item]);
  const onOkHandler = () => {
    form.validateFields().then((res) => {
      setLoading(true);

      if (isAdd) {
        DictAPI.create(res).then((k) => {
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
        DictAPI.update({ ...newItem, ...res }).then((k) => {
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
      title={isAdd ? '添加字典' : '修改字典'}
      onCancel={() => {
        onOk(false);
      }}
      open={open}
      onOk={onOkHandler}
      okButtonProps={{ loading }}
    >
      <Form
        form={form}
        initialValues={{
          classify: "前端",
        }}
      >
        <Form.Item name="name" label="名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="描述" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default Index;
