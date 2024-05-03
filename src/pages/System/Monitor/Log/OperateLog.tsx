/*
 * @Descripttion:操作日志
 * @Author: duk
 * @Date: 2023-07-20 21:31:45
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2024-05-03 15:20:41
 */
import * as logAPI from "@/services/log/api";
import { DeleteOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Access, useAccess } from "@/components/Access";
import { Button, message, Modal, Tag } from "antd";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<Permission.Item>();
  const [selectedRowsState, setSelectedRows] = useState<Permission.Item[]>([]);

  const [loading, setLoading] = useState(false);

  const access = useAccess();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const deleteHandler = (id?: number) => {
    if (selectedRowsState.length > 0 || id) {
      const newId =
        selectedRowsState.length > 0
          ? selectedRowsState.map((el) => el.id)
          : [id];
      if (newId.length === 0) {
        return;
      }

      Modal.confirm({
        title: "删除",
        content: "是否确定删除记录?",
        onOk: () => {
          setLoading(true);
          logAPI
            .remove(newId)
            .then((res) => {
              if (res?.code === 200) {
                message.success("删除成功");
                handleModalOpen(false);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              } else {
                message.error("删除失败");
              }
              setLoading(false);
            })
            .finally(() => {
              setLoading(false);
            });
        },
        okButtonProps: {
          loading,
        },
      });
    }
  };

  const columns: ProColumns<Log.ItemLog>[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "模糊查询",
      dataIndex: "name",
      hideInTable: true,
      hideInForm: true,

      fieldProps: {
        placeholder: "请输入内容、日志级别或者操作人",
      },
    },
    {
      title: "日志级别",
      hideInSearch: true,
      dataIndex: "logLevel",
      render: (_, record) => {
        return (
          <Tag color={record.logLevel === "INFO" ? "green" : "red"}>
            {record.logLevel}
          </Tag>
        );
      },
    },
    {
      title: "名称",
      dataIndex: "content",
      hideInSearch: true,
    },
    {
      title: "地址",
      dataIndex: "address",
      hideInSearch: true,
    },
    {
      title: "浏览器",
      dataIndex: "browser",
      hideInSearch: true,
    },
    {
      title: "ip",
      dataIndex: "requestIp",
      hideInSearch: true,
    },
    {
      title: "方法",
      dataIndex: "method",
      hideInSearch: true,
      hideInTable: true,
    },

    {
      title: "操作人",
      dataIndex: "operator",
      hideInSearch: true,
    },

    {
      title: "操作时间",
      dataIndex: "operDate",
      hideInSearch: true,
      render: (_, record, index) => {
        return (
          <span>{dayjs(record.operDate).format("YYYY-MM-DD HH:mm:ss")}</span>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      align: "center",
      hideInTable: true,

      render: (_, record) => (
        <>
          <Button
            type="link"
            danger
            key="config"
            onClick={() => {
              setCurrentRow(record);
              deleteHandler(record.id);
            }}
          >
            删除
          </Button>
          <Button
            type="link"
            key={"edit"}
            onClick={() => {
              handleModalOpen(true);
              setCurrentRow(record);
            }}
          >
            编辑
          </Button>
        </>
      ),
    },
  ];

  const getOsAllList = async (param: API.PageParams) => {
    let { current, pageSize, ...newParams } = param;

    if (param?.name) {
      newParams = { ...newParams };
    }

    const res = await logAPI.findLogPage({
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
      <ProTable<Log.ItemLog, API.PageParams>
        headerTitle={"查询表格"}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <div>
                <h4>请求方法：{record?.operType}</h4>
              </div>
              <div style={{ width: 700 }}>
                <h4>请求参数：{record?.params}</h4>
              </div>
            </div>
          ),
        }}
        toolBarRender={() => [
          <>
            <Access
              accessible={access.canShow(
                access.allPermissionConfig.monitor.log.delete
              )}
            >
              <Button
                icon={<DeleteOutlined />}
                onClick={deleteHandler}
                key={"del"}
                danger
                type="dashed"
              >
                删除
              </Button>
            </Access>
          </>,
        ]}
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
