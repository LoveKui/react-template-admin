/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-03-29 10:42:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-11-18 21:16:54
 */
import http from "@/utils/request";

export async function getList(params: Permission.Query, options?: { [key: string]: any }) {
  return http.request<Permission.ResPage>('/services/permission/getPermissionsByPage', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getById(id: number, options?: { [key: string]: any }) {
  return http.request<Permission.Res>('/services/permission/getPermission', {
    method: 'GET',
    params: {
      id,
    },
    ...(options || {}),
  });
}

export async function add(params: Permission.Add, options?: { [key: string]: any }) {
  return http.request<Permission.Res>('/services/permission/addPermission', {
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

export async function updateById(params: Permission.Add, options?: { [key: string]: any }) {
  return http.request<Permission.Res>('/services/permission/updatePermission', {
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
  return http.request<Permission.Res>(`/services/permission/deletePermission`, {
    method: 'POST',
    data: id,
    ...(options || {}),
  });
}

export async function getLazyByPid(pid?: number | null, options?: { [key: string]: any }) {
  return http.request<Permission.Res>(`/services/permission/lazy`, {
    method: 'GET',
    params: pid,
    ...(options || {}),
  });
}
export async function getLazyTree(params?: Permission.LazyTreeProps, options?: { [key: string]: any }) {
  return http.request<Permission.Res>(`/services/permission/lazyTree`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}

