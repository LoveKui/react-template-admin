/*
 * @Descripttion: 用户管理页面的修改密码
 * @Author: duk
 * @Date: 2023-10-27 15:55:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-11-15 22:19:40
 */
import { Form, Input, message, Modal } from 'antd';

import { updateById } from '@/services/user/api';
import { verify } from '@/utils/common';
import { useState } from 'react';

interface UpdatePassProps {
  visible: boolean;
  cancel: () => void;
  item: User.Add;
}

const index = 0;

export default (props: UpdatePassProps) => {
  const { visible, cancel, item } = props;
  console.log('item', item);
  const [loading, setLoading] = useState(false);
  const [validateStatus, setValidateStatus] = useState({
    validateStatus: null,
    help: '',
  });
  const [validateStatusSecond, setValidateStatusSecond] = useState({
    validateStatus: null,
    help: '',
  });

  const [passwordForm] = Form.useForm();
  const handleOk = () => {
    passwordForm
      .validateFields()
      .then((value: { oldPass: string; newPass: string; sureNewPass: string }) => {
        if (value?.newPass !== value?.sureNewPass) {
          message.warning('两次密码不一致，请重新输入');
          return;
        }
        setLoading(true);
        const params = { ...item, password: value.sureNewPass };

        updateById(params).then((res) => {
          setLoading(false);

          if (res?.status) {
            message.error('修改失败');
            return false;
          }
          message.success('修改成功');
          cancel();
        });
      });
  };

  const handleCancel = () => {
    cancel();
  };
  const onValuesChange = (changedValues, allValues) => {
    if (changedValues?.sureNewPass && allValues?.newPass) {
      if (allValues?.newPass !== changedValues?.sureNewPass) {
        // message.warning('两次密码输入不一致');
        setValidateStatusSecond({
          validateStatus: 'warning',
          help: '两次密码输入不一致',
        });
        return;
      } else {
        setValidateStatusSecond({
          validateStatus: 'success',
          help: '',
        });
      }
    }

    if (changedValues?.newPass) {
      const flag = verify(changedValues?.newPass);
      setValidateStatus({
        validateStatus: flag ? 'success' : 'error',
        help: flag ? '' : '密码中必须包含大小字母、数字、特殊字符，至少8个字符，最多30个字符',
      });
    }
  };

  return (
    <Modal
      title="修改密码"
      maskClosable={false}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{
        loading,
      }}
    >
      <Form
        name="basic"
        form={passwordForm}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        autoComplete="off"
        onValuesChange={onValuesChange}
      >
        <Form.Item
          label="新密码"
          name="newPass"
          rules={[{ required: true, message: '请输入新密码' }]}
          validateStatus={validateStatus.validateStatus}
          hasFeedback
          help={validateStatus.help}
        >
          <Input.Password min={6} />
        </Form.Item>

        <Form.Item
          label="确认密码"
          name="sureNewPass"
          rules={[{ required: true, message: '再次输入新密码' }]}
          validateStatus={validateStatusSecond.validateStatus}
          hasFeedback
          help={validateStatusSecond.help}
        >
          <Input.Password min={6} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
