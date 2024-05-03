import * as permissionAPI from "@/services/permission/api";
import {
  DeleteOutlined,
  FolderFilled,
  PlusOutlined,
  UsbFilled,
} from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Access, useAccess } from "@/components/Access";
import { Button, message, Modal, Space } from "antd";
import React, { useRef, useState } from "react";
import ItemModal from "./ItemModal";

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<Permission.Item>();
  const [selectedRowsState, setSelectedRows] = useState<Permission.Item[]>([]);

  const [operateType, setOperateType] = useState<"add" | "update">(null);
  const [treeData, setTreeData] = useState<Permission.Item[]>([]);

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
          permissionAPI
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
            .catch(() => {
              setLoading(false);
            });
        },
        okButtonProps: {
          loading,
        },
      });
    }
  };

  const columns: ProColumns<Permission.Item>[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
      hideInTable: true,
    },

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
      title: "名称",
      hideInSearch: true,
      dataIndex: "name",
      render: (_, record) => {
        return (
          <>
            <Space>
              {record.type === 0 ? <FolderFilled /> : <UsbFilled />}
              {record?.name}
            </Space>{" "}
          </>
        );
      },
    },
    {
      title: "描述",
      dataIndex: "description",
      valueType: "textarea",
      hideInSearch: true,
    },
    {
      title: "权限值",
      dataIndex: "url",
      valueType: "textarea",
      hideInSearch: true,
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
              access.allPermissionConfig.system.permission.add
            )}
            fallback={null}
          >
            <Button
              type="link"
              danger
              key="config"
              onClick={() => {
                handleModalOpen(true);
                setCurrentRow(record);
                setOperateType("add");
              }}
            >
              添加
            </Button>
          </Access>
          <Access
            accessible={access.canShow(
              access.allPermissionConfig.system.permission.delete
            )}
            fallback={null}
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
              access.allPermissionConfig.system.permission.update
            )}
            fallback={null}
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

    const res = await permissionAPI.getLazyTree();

    function convertData(data: any[]) {
      return data?.map((el) => {
        return {
          ...el,
          children: el?.children ? convertData(el?.children) : null,
          disabled: el?.type === 0 ? false : true,
          value: el.id,
          title: el.name,
        };
      });
    }

    const newData = convertData(res?.data);

    setTreeData(newData);

    return {
      data: newData,
      success: true,
    };
  };

  return (
    <PageContainer>
      <ProTable<Permission.Item, API.PageParams>
        headerTitle={"查询表格"}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <>
            {selectedRowsState.length > 0 && (
              <Access
                accessible={access.canShow(
                  access.allPermissionConfig.system.permission.delete
                )}
                fallback={null}
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
              access.allPermissionConfig.system.permission.add
            )}
            fallback={null}
          >
            <Button
              icon={<PlusOutlined />}
              type="primary"
              onClick={() => {
                handleModalOpen(true);
                setCurrentRow(null);
                setOperateType("add");
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
          type={operateType}
          item={currentRow}
          open={createModalOpen}
          treeData={treeData}
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
