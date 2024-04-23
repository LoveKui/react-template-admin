/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-03-29 10:42:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-23 17:03:35
 */
import http from "@utils/request";
import { AxiosRequestConfig } from "axios";

/**
 * 用户登录接口
 * @param username 用户名
 * @param password 密码
 * @returns 返回登录响应数据，包含访问令牌等信息
 */
export async function login(username: string, password: string) {
  // 发起POST请求，向服务器申请令牌
  return http.request<User.LoginRes>("/oauth/token", {
    method: "POST",
    data: {
      username, // 用户名
      password, // 密码
      grant_type: "password", // 授权类型，这里使用密码模式
    },
    headers: {
      "Content-Type": "multipart/form-data", // 设置请求头，指定数据格式
    },
  });
}

export async function getLoginUser(options?: AxiosRequestConfig) {
  return http.request<User.LoginUserInfo>("/services/user/me", {
    method: "GET",
    ...options,
  });
}

export async function getUserList(
  params: User.Query,
  options?: { [key: string]: any }
) {
  return http.request<User.ResPage>("/services/user/getUsersByPage", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getUserById(
  id: number,
  options?: { [key: string]: any }
) {
  return http.request<User.Res>("/services/user/getUser", {
    method: "GET",
    params: {
      id,
    },
    ...(options || {}),
  });
}

export async function add(params: User.Add, options?: { [key: string]: any }) {
  return http.request<User.Res>("/services/user/addUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      ...params,
    }),
    ...(options || {}),
  });
}

export async function updateById(
  params: User.Add,
  options?: { [key: string]: any }
) {
  return http.request<User.Res>("/services/user/updateUser", {
    method: "POST",
    data: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function remove(id: number[], options?: { [key: string]: any }) {
  return http.request<User.Res>(`/services/user/deleteUser`, {
    method: "POST",
    data: id,

    ...(options || {}),
  });
}

export async function updatePwd(pwd: any, options?: { [key: string]: any }) {
  return http.request<User.Res>(`/services/user/updatePwd`, {
    method: "POST",
    params: {
      ...pwd,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },

    ...(options || {}),
  });
}
