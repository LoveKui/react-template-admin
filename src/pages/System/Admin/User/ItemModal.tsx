/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-03-29 11:37:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-02 20:48:53
 */

import * as userAPI from "@/services/user/api";
import { verify } from "@/utils/common";
import { IsEmail, ruleRegExp, _IDRe18 } from "@/utils/regular";
import { useAccess } from "@/components/Access";
import {
  Form,
  Input,
  message,
  Modal,
  notification,
  Select,
  Switch,
  Tooltip,
  TreeSelect,
} from "antd";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
interface Props {
  roles: Role.Item[];
  open: boolean;
  item?: User.Item;
  onOk: (flag: boolean) => void;
  department: Department.INode[];
}
let indexTime: any;
const Index: React.FC<Props> = ({ open, item, onOk, roles, department }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState([] as any[]);
  const access = useAccess();
  const [api, contextHolder] = notification.useNotification();
  const [validateStatus, setValidateStatus] = useState({
    validateStatus: null,
    help: "",
  });
  const [validateStatusSecond, setValidateStatusSecond] = useState({
    validateStatus: null,
    help: "",
  });

  useEffect(() => {
    const aa = { ...item, roles: item?.roles?.map((el) => el) };
    form.setFieldsValue(aa);
  }, [item]);

  const isAdd = useMemo(() => (_.isEmpty(item) ? true : false), [item]);
  const onOkHandler = () => {
    form.validateFields().then((res) => {
      setLoading(true);

      const { username, password, locked, secondPassword } = res || {};
      if (
        item?.id &&
        password &&
        secondPassword &&
        password !== secondPassword
      ) {
        message.warning("两次密码输入不一致");
        setLoading(false);

        return;
      }
      const params = {
        ...res,
        username,
        password,
        locked: locked === true ? 1 : 0,
        roles: res?.roles?.map((el) => el),
        tel: username,
      };
      if (isAdd) {
        userAPI.add(params).then((k) => {
          if (k.code === 200) {
            api.success({
              message: "用户添加成功",
              description: "",
            });
            onOk(true);
          } else {
            message.error("添加失败");
          }
          setLoading(false);
        });
      } else {
        const { ...newItem } = item;
        userAPI.updateById({ ...newItem, ...params }).then((k) => {
          if (k.code === 200) {
            message.success("更新成功");
            onOk(true);
          } else {
            message.error("更新失败");
          }
          setLoading(false);
        });
      }
      console.log(res);
    });
  };
  const onValuesChange = (changedValues, allValues) => {
    if (changedValues?.secondPassword && allValues?.password) {
      if (allValues?.password !== changedValues?.secondPassword) {
        // message.warning('两次密码输入不一致');
        setValidateStatusSecond({
          validateStatus: "warning",
          help: "两次密码输入不一致",
        });
        return;
      } else {
        setValidateStatusSecond({
          validateStatus: "success",
          help: "",
        });
      }
    }

    if (changedValues?.password) {
      const flag = verify(changedValues?.password);
      setValidateStatus({
        validateStatus: flag ? "success" : "error",
        help: flag
          ? ""
          : "密码中必须包含大小字母、数字、特殊字符，至少8个字符，最多30个字符",
      });
    }
  };
  return (
    <Modal
      title={isAdd ? "添加用户信息" : "修改用户信息"}
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
        layout="horizontal"
        onValuesChange={onValuesChange}
      >
        <Form.Item
          tooltip="字母或者数字组成"
          name="username"
          label="用户名"
          rules={[{ required: true, ...ruleRegExp }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="nickname"
          tooltip="真实姓名"
          label="姓名"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="sex" label="性别" rules={[{ required: true }]}>
          <Select>
            <Select.Option value={1}>男</Select.Option>
            <Select.Option value={0}>女</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[{ required: true, pattern: IsEmail }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          tooltip="锁定用户不能登录"
          valuePropName="checked"
          name="locked"
          label="锁定"
        >
          <Switch disabled={access.canAdmin ? false : true} />
        </Form.Item>
        <Form.Item
          name="idNumber"
          label="身份证号"
          rules={[{ required: true, pattern: _IDRe18 }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="department" label="部门" rules={[{ required: true }]}>
          <TreeSelect
            showSearch
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            placeholder="请选择部门"
            allowClear
            treeDefaultExpandAll
            treeData={department}
          />
        </Form.Item>
        <Form.Item name="roles" label="角色" rules={[{ required: true }]}>
          <Select mode="multiple" placeholder="请选择角色">
            {roles?.map((el) => (
              <Select.Option value={el.name} key={el.id}>
                <Tooltip title={el.name}>
                  <span>{el.description}</span>
                </Tooltip>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {!item && (
          <>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: _.isEmpty(item) ? true : false }]}
              validateStatus={validateStatus.validateStatus}
              hasFeedback
              help={validateStatus.help}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="secondPassword"
              label="确认密码"
              rules={[{ required: _.isEmpty(item) ? true : false }]}
              validateStatus={validateStatusSecond.validateStatus}
              hasFeedback
              help={validateStatusSecond.help}
            >
              <Input.Password />
            </Form.Item>
          </>
        )}

        {/* <Form.Item name="file" label="头像">
          <PictureCardUpload uploadCount={1} />
        </Form.Item> */}

        <Form.Item name="remark" label="备注" rules={[{ required: false }]}>
          <Input.TextArea maxLength={255} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Index;
