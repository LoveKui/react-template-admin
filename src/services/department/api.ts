/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-03-29 10:42:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-02 19:19:56
 */
import http from "@/utils/request";

export async function getCatalog() {
  return http.request<Department.Res>('/services/department/getCatalog', {
    method: 'GET',
  });
}

export async function getDepartmentById(id: number) {
  return http.request<User.LoginRes>('/services/department/getDepartment', {
    method: 'GET',
    params: { id },
  });
}

export async function getDepartments(filter: Record<string, string | number>) {
  return http.request<User.LoginRes>('/services/department/getDepartments', {
    method: 'GET',
    params: {
      ...filter,
    },
  });
}

export async function getChildrenById(id: number) {
  return http.request<User.LoginUserInfo>('/services/department/getChildren', {
    method: 'GET',
    params: {
      id,
    },
  });
}

export async function getDepartmentsByPage(params: User.Query, options?: { [key: string]: any }) {
  return http.request<User.ResPage>('/services/department/getDepartmentsByPage', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function add(params: Department.Item, options?: { [key: string]: any }) {
  return http.request<User.ResPage>('/services/department/addDepartment', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

export async function updateById(params: Department.Item, options?: { [key: string]: any }) {
  return http.request<User.ResPage>('/services/department/updateDepartment', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

export async function remove(id: number, options?: { [key: string]: any }) {
  return http.request<User.ResPage>('/services/department/deleteDepartment', {
    method: 'POST',
    params: { id },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    ...(options || {}),
  });
}

export async function getUserById(id: number, options?: { [key: string]: any }) {
  return http.request<User.Res>('/services/user/getUser', {
    method: 'GET',
    params: {
      id,
    },
    ...(options || {}),
  });
}
