
/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-03-29 10:42:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-20 21:43:08
 */
import http from "@/utils/request";


/**
 * 登录日志
 * @param params
 * @returns
 */
export async function findPage(params: Log.Query) {
  return http.request<Log.LogRes>('/services/loginlog/getLogsByPage', {
    method: 'GET',

    params
  });
}



/**
 * 操作日志
 * @param params
 * @returns
 */
export async function findLogPage(params: Log.Query) {
  return http.request<Log.LoginLogRes>('/services/log/getLogsByPage', {
    method: 'GET',

    params
  });
}




export async function getList(params: User.Query, options?: { [key: string]: any }) {
  return http.request<People.Res>('/services/picture/findList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function getOneById(id: number, options?: { [key: string]: any }) {
  return http.request<User.Res>(`/services/picture/${id}`, {
    method: 'GET',

    ...(options || {}),
  });
}

export async function add(params: People.Item, options?: { [key: string]: any }) {
  return http.request<People.Res>('/services/picture/create', {
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

export async function updateById(params: People.Item, options?: { [key: string]: any }) {
  return http.request<People.Res>('/services/picture/update', {
    method: 'PUT',
    data: ({
      ...params,
    }),
    ...(options || {}),
  });
}

export async function remove(id: string[], options?: { [key: string]: any }) {
  return http.request<People.Res>(`/services/picture/delete`, {
    method: 'DELETE',
    data: id,
    ...(options || {}),
  });
}
