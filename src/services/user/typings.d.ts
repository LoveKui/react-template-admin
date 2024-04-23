/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-04-17 20:57:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-23 16:52:57
 */
// @ts-ignore
/* eslint-disable */

declare namespace User {
  interface Query extends Common.PageInfo {
    name?: string;
  }

  interface LoginRes {
    access_token: string;
    token_type: string;
    refresh_token: string;
    scope: string;
  }

  interface LoginUserInfo {
    principal: {
      user: {
        id: number;
        username: string;
        locked: boolean;
        roles: any[];
        initAuthorities: any[];
      };
      initAuthorities: [];
    };
  }

  interface Item {
    id: number;
    username: string;
    locked: number | boolean;
    roles: string[];
  }

  interface Res extends Common.Results {
    data: Item[];
  }
  interface ResPage extends Common.Results {
    data: {
      list: Item[];
      count: number;
    };
  }

  interface Add {
    id?: number;
    username: string;
    password: string;
    locked: boolean | number;
    department?: string;
    roles?: any[];
    tel: string;
    nickname: string;
    sex: number;
    email: string;
    idNumber: string;
    remark: string;
    departmentName?: number;
    initAuthorities?: string[];
  }
}
