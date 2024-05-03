/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-04-17 20:57:59
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-07-21 20:38:51
 */
// @ts-ignore
/* eslint-disable */


declare namespace Log {
  interface Query extends Common.PageInfo {
    name?: string;
  }

  interface LogRes extends Common.Results {
    data: {
      list: ItemLog[],
      count: number;
    }
  }



  interface LoginLogRes extends Common.Results {
    data: {
      list: Item[],
      count: number;
    }
  }

  interface ItemLog {
    address: string
    browser: string
    content: string
    id: number
    logLevel: string
    method: string
    operDate: number
    operType: string
    operator: string
    params: string
    requestIp: string
  }


  interface Item {
    "id": number;
    "username": string;
    "date": string;
    "ip": string;
  }

  interface Res extends Common.Results {
    data: Item[];
  }
  interface ResPage extends Common.Results {
    data: Common.Results2
  }

}
