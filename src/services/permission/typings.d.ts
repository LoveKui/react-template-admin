/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-04-17 20:57:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-11-19 07:46:58
 */
// @ts-ignore
/* eslint-disable */

declare namespace Permission {
  interface Query extends Common.PageInfo {
    name?: string;
  }

  interface Item {
    id: number;
    name: string;
    description: boolean;
    url: string;
    pid?: null | number;
    children?: Item[];
    type: number;
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
    name: string;
    description?: boolean;
    url: string;
  }

  interface LazyTreeProps {
    type: number
  }
}
