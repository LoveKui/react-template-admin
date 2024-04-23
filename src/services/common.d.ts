/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2024-04-23 17:24:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-04-23 17:24:39
 */
/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-04-17 21:36:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-26 20:47:45
 */
declare namespace Common {
  type PageInfo = {
    pageNum?: number;
    pageSize?: number;
  };

  interface Item {
    createBy?: string;
    updateBy?: string;
    createTime?: string;
    updateTime?: string;
    id?: string;
  }

  type ResultsData = {
    list: T[];
    count: number;
  };

  type Results = {
    code: number;
    msg: string;
    data: Results | T;
  };

  type Results2 = {
    records: T;
    total: number;
    size: number;
    current: number;
    orders: [];
    hitCount: boolean;
    searchCount: boolean;
    pages: number;
  };
}
