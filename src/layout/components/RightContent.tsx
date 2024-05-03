import React, { ChangeEvent } from "react";
import { Avatar, Dropdown, MenuProps, Button, Input, Badge, Space } from "antd";
import {
  SkinOutlined,
  BellOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLoginStore, useGlobalStore } from "@/stores/index";
import { debounce } from "@/utils/func";
import styles from "../index.module.scss";
import { useNavigate } from "react-router-dom";

const RightContent: React.FC = () => {
  const { setUserInfo, setToken, userInfo } = useLoginStore();
  const { setColor, primaryColor } = useGlobalStore();
  const navigate = useNavigate();
  const logoutHandle = () => {
    const { search, pathname } = window.location;
    setUserInfo(null);
    setToken(null);
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get("redirect");
    // Note: There may be security issues, please note
    if (window.location.pathname !== "/login" && !redirect) {
      navigate(`/login?redirect=${pathname}${search}`, {
        replace: true,
      });
    }
  };
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Space>
          <LogoutOutlined />
          <span onClick={logoutHandle}>退出登录</span>
        </Space>
      ),
    },
    {
      key: "2",
      label: (
        <Space>
          <UserOutlined />
          <span>个人中心</span>
        </Space>
      ),
    },
  ];

  const changeMainColor = (e: ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  return (
    <Space size={20}>
      <span style={{ display: "flex" }}>
        <Badge count={12}>
          <BellOutlined style={{ fontSize: 24 }} />
        </Badge>
      </span>
      <div className={styles.skin}>
        <Button type="primary" shape="circle" icon={<SkinOutlined />} />
        <Input
          type="color"
          className={styles.skin_input}
          defaultValue={primaryColor}
          onChange={debounce(changeMainColor, 500)}
        ></Input>
      </div>

      <Dropdown menu={{ items }} placement="bottomRight">
        <Space>
          <Avatar
            src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
            style={{ cursor: "pointer" }}
          />
          <div>{userInfo?.nickname}</div>
        </Space>
      </Dropdown>
    </Space>
  );
};

export default RightContent;
