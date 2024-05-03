declare namespace Dict {


  interface Query extends Common.PageInfo {
    name?: string;
  }

  interface Item extends Common.Item {
    id: string;
    enabled: number;
    name: string;
    classify: string;
    description: string;
  }

  interface Update{
    id?: string;
    name: string;
    classify: string;
    description: string;

  }

  interface Res   extends Common.Results{
    data: Common.Results2


  }

  interface PageParams extends API.PageParams{
    name?: string;
  }
}
