declare namespace DictDetail {


  interface Query extends Common.PageInfo {
    name?: string;
  }


  interface Item extends Common.Item {
    id?: string
    dictId?: string
    label?: string
    value?: string
    dictName?: string;
    dirtSort?: number;
  }

  interface Update {
    id?: string;
    dictId?: string
    label?: string
    Value?: string
    dirtSort?: number;
  }

  interface Res extends Common.Results {
    data: Common.Results2

  }
  interface PageParams extends API.PageParams {
    label?: string;
  }

  interface ResDetailList extends Common.Results {
    data: {
      [key: string]: Item[];
    }
  }
}
