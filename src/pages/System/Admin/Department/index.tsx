import * as departmentAPI from "@/services/department/api";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Access, useAccess } from "@/components/Access";
import { Button, message, Modal } from "antd";
import React, { useRef, useState } from "react";
import ItemModal from "./ItemModal";

export const convertData = (data: Department.INode[]) => {
  if (data?.length > 0) {
    return data?.map((el) => {
      if (el?.children?.length > 0) {
        return {
          ...el.node,
          key: el.node.id,
          title: el.node.name,
          value: el.node.id,
          children:
            el?.children?.length > 0 ? convertData(el.children || []) : [],
        };
      } else {
        return {
          ...el.node,
          key: el.node.id,
          title: el.node.name,
          value: el.node.id,
        };
      }
    });
  }
};

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<Department.Item>();
  const [selectedRowsState, setSelectedRows] = useState<Department.Item[]>([]);

  const [loading, setLoading] = useState(false);
  const [operateType, setOperateType] = useState<"add" | "update">("add");
  const [treeData, setTreeData] = useState([] as any[]);

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
      if (!newId) {
        return;
      }

      Modal.confirm({
        title: "删除",
        content: "是否确定删除记录?",
        onOk: () => {
          setLoading(true);
          departmentAPI
            .remove(newId?.[0])
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
            .catch((error) => {
              setLoading(false);
            });
        },
        okButtonProps: {
          loading,
        },
      });
    }
  };

  const columns: ProColumns<Department.Item>[] = [
    {
      title: "模糊查询",
      dataIndex: "name",
      hideInTable: true,
      hideInForm: true,
      fieldProps: {
        placeholder: "请输入名称",
      },
    },
    {
      title: "部门名称",
      hideInSearch: true,
      dataIndex: "name",
    },
    {
      title: "remark",
      hideInSearch: true,
      dataIndex: "remark",
      hideInTable: true,
    },
    {
      title: "priority",
      hideInSearch: true,
      dataIndex: "priority",
      hideInTable: true,
    },

    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      align: "center",

      render: (_, record) => (
        <>
          <Access
            accessible={access.canShow(
              access.allPermissionConfig.system.department.delete
            )}
          >
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
          </Access>
          <Access
            accessible={access.canShow(
              access.allPermissionConfig.system.department.update
            )}
          >
            <Button
              type="link"
              key={"edit"}
              onClick={() => {
                handleModalOpen(true);
                setCurrentRow(record);
                setOperateType("update");
              }}
            >
              编辑
            </Button>
          </Access>
        </>
      ),
    },
  ];

  const getOsAllList = async (param: API.PageParams) => {
    let { current, pageSize, ...newParams } = param;
    if (param?.name) {
      newParams = { ...newParams, name: param?.name };
    }

    const { data: res } = await departmentAPI.getCatalog();
    const data = convertData(res?.nodes);

    setTreeData([
      {
        id: 0,
        key: 0,
        value: 0,
        title: "根目录",
        children: data,
      },
    ]);
    console.log("data", data);
    return {
      data: data,
      success: true,
    };
  };

  return (
    <PageContainer>
      <ProTable<Department.Item, API.PageParams>
        headerTitle={"查询表格"}
        actionRef={actionRef}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <>
            {selectedRowsState.length > 0 && (
              <Access
                accessible={access.canShow(
                  access.allPermissionConfig.system.department.delete
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
            )}
          </>,
          <Access
            key="primary"
            accessible={access.canShow(
              access.allPermissionConfig.system.department.add
            )}
          >
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => {
                handleModalOpen(true);
                setCurrentRow(null);
              }}
            >
              新建
            </Button>
          </Access>,
        ]}
        request={getOsAllList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      {createModalOpen && (
        <ItemModal
          treeData={treeData}
          item={currentRow}
          open={createModalOpen}
          onOk={(flag: boolean) => {
            if (flag) {
              actionRef.current?.reloadAndRest?.();
            }
            handleModalOpen(false);
          }}
        />
      )}
    </PageContainer>
  );
};
export default TableList;
