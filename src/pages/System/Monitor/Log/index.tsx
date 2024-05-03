import * as logAPI from "@/services/log/api";

import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import dayjs from "dayjs";

import React, { useRef, useState } from "react";

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<Log.Item>();
  const [selectedRowsState, setSelectedRows] = useState<Log.Item[]>([]);

  const [loading, setLoading] = useState(false);

  const columns: ProColumns<Log.Item>[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "用户名",
      dataIndex: "username",
      hideInSearch: true,
    },
    {
      title: "ip",
      dataIndex: "ip",
      hideInSearch: true,
    },
    {
      title: "登录时间",
      hideInSearch: true,
      dataIndex: "date",
      render: (_, record, index) => {
        return <span>{dayjs(record.date).format("YYYY-MM-DD HH:mm:ss")}</span>;
      },
    },
  ];

  const getOsAllList = async (param: API.PageParams) => {
    let { current, pageSize, ...newParams } = param;
    if (param?.name) {
      newParams = { ...newParams, name: param?.name };
    }

    const res = await logAPI.findPage({
      pageNum: current || 1,
      pageSize: pageSize || 20,
      ...newParams,
    });
    return {
      data: res?.data?.list,
      success: true,
      total: res?.data?.count,
    };
  };

  return (
    <PageContainer>
      <ProTable<Log.Item, API.PageParams>
        headerTitle={"查询表格"}
        actionRef={actionRef}
        rowKey="id"
        search={false}
        request={getOsAllList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
    </PageContainer>
  );
};
export default TableList;
