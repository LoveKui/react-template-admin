/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-04-17 20:57:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-21 21:07:36
 */
// @ts-ignore
/* eslint-disable */

declare namespace Department {
  interface Query extends Common.PageInfo {
    name?: string;
  }


  interface Item {
    createDate: number;
    id: number;
    name: string;
    parentId: null | number;
    priority: number;
    remark: string;
    useFlag: number;
  }

  interface INode {
    children: INode[];
    node: Item;
  }

  interface Res {
    nodes: INode[];
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
  }
}
