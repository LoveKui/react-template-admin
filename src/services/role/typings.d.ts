/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-04-17 20:57:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-08 15:32:49
 */
// @ts-ignore
/* eslint-disable */

declare namespace Role {
  interface Query extends Common.PageInfo {
    name?: string;
  }

  interface Item {
    id: number;
    name: string;
    description: boolean;
    permissions: any[];
  }

  interface Res extends Common.Results {
    data: Item[];
  }
  interface ResPage extends Common.Results {
    // data: {

    // };
    list: Item[];
    count: number;
  }

  interface Add {
    id?: number;
    name: string;
    description?: boolean;
    permissions?: any[];
  }
}
