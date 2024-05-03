/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-03-29 10:42:39
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-02 19:31:48
 */
import http from "@/utils/request";

export async function getList(params: DictDetail.Query, options?: { [key: string]: any }) {
  return http.request<DictDetail.Res>('/services/dictDetail', {
    method: 'GET',
    params: ({
      ...params
    }),
    ...(options || {}),
  });
}

export async function create(params: DictDetail.Update, options?: { [key: string]: any }) {
  return http.request<DictDetail.Res>('/services/dictDetail', {
    method: 'POST',
    data: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function remove(ids: string[], options?: { [key: string]: any }) {
  return http.request<DictDetail.Res>(`/services/dictDetail`, {
    method: 'DELETE',
    data: ids,

    ...(options || {}),
  });
}

export async function update(data: DictDetail.Update, options?: { [key: string]: any }) {
  return http.request<DictDetail.Res>(`/services/dictDetail`, {
    method: 'PUT',
    data,

    ...(options || {}),
  });
}

export async function getDictDetailByName(dictName: string[], options?: { [key: string]: any }) {
  return http.request<DictDetail.ResDetailList>(`/services/dictDetail/map`, {
    method: 'GET',
    params: {
      dictName: dictName.join(",")
    },

    ...(options || {}),
  });
}

