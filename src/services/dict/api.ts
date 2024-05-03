/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-03-29 10:42:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-13 15:50:38
 */
import http from "@/utils/request";

export async function getList(params: Dict.Query, options?: { [key: string]: any }) {
  return http.request<Dict.Res>('/services/dict', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {}),
  });
}

export async function create(params: Dict.Update, options?: { [key: string]: any }) {
  return http.request<Dict.Res>('/services/dict', {
    method: 'POST',
    data: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function remove(ids: string[], options?: { [key: string]: any }) {
  return http.request<Dict.Res>(`/services/dict`, {
    method: 'DELETE',
    data: ids,

    ...(options || {}),
  });
}

export async function update(data: Dict.Update, options?: { [key: string]: any }) {
  return http.request<Dict.Res>(`/services/dict`, {
    method: 'PUT',
    data,

    ...(options || {}),
  });
}
