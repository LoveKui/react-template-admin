import { loginOut } from '@/components/RightContent/AvatarDropdown';
import * as userAPI from '@/services/user/api';
import { verify } from '@/utils/common';
import { Form, Input, message, Modal } from 'antd';
import { useState } from 'react';

interface UpdatePassProps {
  visible: boolean;
  cancel: () => void;
}

let index = null;
export default (props: UpdatePassProps) => {
  const { visible, cancel } = props;

  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [validateStatus, setValidateStatus] = useState({
    validateStatus: null,
    help: '',
  });
  const [validateStatusSecond, setValidateStatusSecond] = useState({
    validateStatus: null,
    help: '',
  });
  const handleOk = () => {
    passwordForm
      .validateFields()
      .then((value: { oldPass: string; newPass: string; sureNewPass: string }) => {
        setLoading(true);
        if (value.newPass !== value.sureNewPass) {
          message.warning('两次输入新密码不一致,请重新输入!');
          setLoading(false);
          return;
        }
        userAPI
          .updatePwd(value)
          .then((res) => {
            if (res?.code === 200) {
              message.success('密码修改完成,请重新登录');
              cancel();

              setTimeout(() => {
                loginOut();
              }, 3000);
            }
          })
          .catch(() => setLoading(false));
      });
  };

  const handleCancel = () => {
    cancel();
    setLoading(false);
  };
  const onValuesChange = (
    changedValues,
    allValues: { oldPass: string; newPass: string; sureNewPass: string },
  ) => {
    if (allValues.newPass && allValues.sureNewPass) {
      if (allValues.newPass !== allValues.sureNewPass) {
        setValidateStatusSecond({
          validateStatus: 'warning',
          help: '两次密码输入不一致,请重新输入',
        });
        return false;
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
      return false;
    }
  };
  return (
    <Modal
      title="修改密码"
      maskClosable={false}
      open={visible}
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
          label="旧密码"
          name="oldPass"
          rules={[{ required: true, message: '请输入旧密码' }]}
        >
          <Input.Password />
        </Form.Item>

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
