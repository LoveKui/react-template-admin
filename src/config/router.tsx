import React, { lazy } from "react";
import ErrorPage from "@/pages/500";
import LoginPage from "../layout/components/Login";
import App, { authLoader } from "../App";
import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  DashboardOutlined,
  EditOutlined,
  TableOutlined,
  BarsOutlined,
  UserOutlined,
} from "@ant-design/icons";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const FormPage = lazy(() => import("../pages/FormPage"));
const TablePage = lazy(() => import("../pages/TablePage"));
const AccountCenter = lazy(() => import("../pages/AccountPage/AccountCenter"));
const AccountSettings = lazy(
  () => import("../pages/AccountPage/AccountSettings")
);

const UserPage = lazy(() => import("../pages/System/Admin/User"));
const PermissionPage = lazy(() => import("../pages/System/Admin/Permission"));
const RolePage = lazy(() => import("../pages/System/Admin/Role"));
const DepartmentPage = lazy(() => import("../pages/System/Admin/Department"));
const LoginLogPage = lazy(() => import("../pages/System/Monitor/Log"));
const OperateLogPage = lazy(
  () => import("../pages/System/Monitor/Log/OperateLog")
);

const DetailPage = lazy(() => import("../pages/DetailPage"));

const Map = lazy(() => import("../pages/Map"));

const routes = [
  {
    path: "/",
    element: <App />,
    loader: authLoader,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            title: "Dashboard",
            icon: <DashboardOutlined />,
            element: <Dashboard />,
          },
          {
            path: "form",
            title: "表单页",
            icon: <EditOutlined />,
            element: <FormPage />,
          },
          {
            path: "table",
            title: "列表页",
            icon: <TableOutlined />,
            element: <TablePage />,
          },
          {
            path: "detail",
            title: "详情页",
            icon: <BarsOutlined />,
            element: <DetailPage />,
          },
          {
            path: "system",
            title: "系统管理",
            icon: <BarsOutlined />,
            children: [
              {
                path: "/system/user",
                title: "用户管理",
                element: <UserPage />,
                icon: <TableOutlined />,
              },
              {
                path: "/system/permission",
                title: "权限管理",
                element: <PermissionPage />,
                icon: <TableOutlined />,
              },
              {
                path: "/system/role",
                title: "角色管理",
                element: <RolePage />,
                icon: <TableOutlined />,
              },
              {
                path: "/system/department",
                title: "部门管理",
                element: <DepartmentPage />,
                icon: <TableOutlined />,
              },
            ],
          },
          {
            path: "monitor",
            title: "系统监控",
            icon: <BarsOutlined />,

            children: [
              {
                path: "/monitor/log",
                title: "操作日志",
                element: <OperateLogPage />,
                icon: <TableOutlined />,
              },
              {
                path: "/monitor/loginLog",
                title: "登录日志",
                element: <LoginLogPage />,
                icon: <TableOutlined />,
              },
            ],
          },

          {
            path: "account",
            title: "个人页",
            icon: <UserOutlined />,
            children: [
              {
                path: "/account/center",
                title: "个人中心",
                element: <AccountCenter />,
                icon: <TableOutlined />,
              },
              {
                path: "/account/settings",
                title: "个人设置",
                element: <AccountSettings />,
              },
            ],
          },
          {
            path: "*",
            element: <Navigate to="/" replace={true} />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/map",
    element: <Map />,
  },
];

export { routes };

export default createBrowserRouter(routes);
