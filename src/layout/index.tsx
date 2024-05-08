import React, { useState, Suspense, useRef, useEffect } from "react";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  NonIndexRouteObject,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Col, MenuProps, Row, Space } from "antd";
import { Layout, Menu, theme, Spin } from "antd";
import HeaderComp from "./components/Header";
import { useLoginStore } from "@/stores/index";
import { routes } from "../config/router";
import NoAuthPage from "../pages/403";
import "antd/dist/reset.css";
import { useAccess } from "@/components/Access";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

type RouteType = NonIndexRouteObject & {
  title: string;
  icon: React.ReactElement;
  access?: string | undefined;
};

const { Header, Content, Footer, Sider } = Layout;

const BasicLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const access = useAccess();

  const menusRef = useRef([] as any[]);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { userInfo, token } = useLoginStore();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { isAdmin } = useLoaderData() as any;

  useEffect(() => {
    const k = menusRef.current.find((l) => l.path === pathname);
    if (k?.access === false) {
      navigate("/403", { replace: true });
    }
  }, [pathname]);

  const getItems: any = (children: RouteType[]) => {
    return children.map((item) => {
      menusRef.current.push(item);
      if (
        (item?.access && access[item?.access]) ||
        item?.access === undefined
      ) {
        return {
          key: item.index
            ? "/"
            : item.path?.startsWith("/")
            ? item.path
            : `/${item.path}`,
          icon: item.icon,
          label: item.title,
          children: item.children ? getItems(item.children) : null,
        };
      }

      if (item?.access && access[item?.access] === false) {
        return null;
      }
    });
  };

  const getAllItems: any = (children: RouteType[]) => {
    return children.map((item) => {
      menusRef.current.push({
        ...item,
        key: item.index
          ? "/"
          : item.path?.startsWith("/")
          ? item.path
          : `/${item.path}`,
        icon: item.icon,
        label: item.title,
        children: item.children ? getAllItems(item.children) : null,
        access: item?.access ? access[item?.access] : undefined,
      });
    });
  };

  getAllItems(
    routes[0].children![0].children.filter((item) => item.path !== "*")
  );

  const menuItems: MenuProps["items"] = getItems(
    routes[0].children![0].children.filter((item) => item.path !== "*")
  );

  const onMenuClick: MenuProps["onClick"] = (info) => {
    const { key } = info;

    const k = menusRef.current.find((l) => l.path === key);
    if (k?.access && access[k?.access] === false) {
      navigate("/403");
    } else {
      navigate(key);
    }

    console.log(info);
  };

  if (!userInfo || !token) {
    return <Navigate to="/login" replace={true} />;
  }

  const renderOpenKeys = () => {
    const arr = pathname.split("/").slice(0, -1);
    const result = arr.map(
      (_, index) => "/" + arr.slice(1, index + 1).join("/")
    );
    return result;
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
        }}
        collapsible={false}
        collapsed={collapsed}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.2)",
          }}
        />
        <Menu
          theme="dark"
          defaultSelectedKeys={[pathname]}
          defaultOpenKeys={renderOpenKeys()}
          mode="inline"
          items={menuItems}
          onClick={onMenuClick}
        />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: "0 10px", background: colorBgContainer }}>
          <Row gutter={24}>
            <Col span={1}>
              {" "}
              {collapsed ? (
                <MenuUnfoldOutlined
                  style={{ fontSize: 20 }}
                  onClick={() => setCollapsed(false)}
                />
              ) : (
                <MenuFoldOutlined
                  style={{ fontSize: 20 }}
                  onClick={() => setCollapsed(true)}
                />
              )}
            </Col>
            <Col span={23}>
              {" "}
              <HeaderComp />
            </Col>
          </Row>
        </Header>
        {/* height：Header和Footer的默认高度是64 */}
        <Content
          style={{
            padding: 16,
            overflow: "auto",
            height: `calc(100vh - 128px)`,
          }}
        >
          {isAdmin ? (
            <Suspense fallback={<Spin size="large" className="content_spin" />}>
              <Outlet />
            </Suspense>
          ) : (
            <NoAuthPage />
          )}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          react template admin ©2023 Created by Jade
        </Footer>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
