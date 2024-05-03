/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-03-29 10:42:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-12 20:19:48
 */
import { idIDIntl } from '@ant-design/pro-components';
import http from "@/utils/request";

export async function getList(params: Role.Query, options?: { [key: string]: any }) {
  return http.request<Role.ResPage>('/services/role/getRolesByPage', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getById(id: number, options?: { [key: string]: any }) {
  return http.request<Role.Res>('/services/role/getRole', {
    method: 'GET',
    params: {
      id,
    },
    ...(options || {}),
  });
}

export async function add(params: Role.Add, options?: { [key: string]: any }) {
  return http.request<Role.Res>('/services/role/addRole', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: ({
      ...params,
    }),
    ...(options || {}),
  });
}

export async function updateById(params: Role.Add, options?: { [key: string]: any }) {
  return http.request<Role.Res>('/services/role/updateRole', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      ...params,
    }),
    ...(options || {}),
  });
}

export async function remove(id: number[], options?: { [key: string]: any }) {
  return http.request<Role.Res>(`/services/role/deleteRole`, {
    method: 'POST',
    data: id,

    ...(options || {}),
  });
}
