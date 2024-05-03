import * as permissionAPI from "@/services/permission/api";
import * as roleAPI from "@/services/role/api";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Access, useAccess } from "@/components/Access";
import { Button, message, Modal, Tag, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import ItemModal from "./ItemModal";
import { useRequest } from "ahooks";

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<Role.Item>();
  const [selectedRowsState, setSelectedRows] = useState<Role.Item[]>([]);

  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<Permission.Item[]>([]);

  const access = useAccess();

  const {
    run,
    data,
    error,
    loading: permissionLoading,
  } = useRequest(
    (pageNum: number, pageSize: number) =>
      permissionAPI.getList({ pageNum, pageSize }),
    {
      manual: true,
    }
  );

  useEffect(() => {
    run(1, 50);
    getPrimissionData();
  }, []);

  const getPrimissionData = async () => {
    const res = await permissionAPI.getLazyTree();

    function convertData(data: any[]) {
      return data?.map((el) => {
        return {
          ...el,
          children: el?.children ? convertData(el?.children) : null,
          // disabled: el?.type === 0 ? false : true,
          value: el.name,
          title: el.name,
        };
      });
    }

    const newData = convertData(res?.data);

    setTreeData(newData);
  };

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
          return roleAPI
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
          loading: false,
        },
      });
    }
  };

  const columns: ProColumns<Role.Item>[] = [
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
        placeholder: "请输入名称",
      },
    },
    {
      title: "名称",
      dataIndex: "description",
      valueType: "textarea",
      hideInSearch: true,
    },
    {
      title: "描述",
      hideInSearch: true,
      dataIndex: "name",
    },

    {
      title: "权限数量",
      dataIndex: "permission",
      hideInSearch: true,
      render: (_, record) => {
        return <span>{record?.permissions?.length || "暂无"}</span>;
      },
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
              access.allPermissionConfig.system.role.delete
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
              access.allPermissionConfig.system.role.update
            )}
            fallback={null}
          >
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

    const res = await roleAPI.getList({
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
      <ProTable<Role.Item, API.PageParams>
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
                  access.allPermissionConfig.system.role.delete
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
              access.allPermissionConfig.system.role.add
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
        expandable={{
          expandedRowRender: (record) => (
            <div>
              <div>
                <h4>权限值:</h4>
                <div>
                  {record?.permissions?.map((el) => (
                    <Tooltip key={el.id} title={el.description}>
                      <Tag color="#108ee9" style={{ margin: 2 }}>
                        {el.name}
                      </Tag>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>
          ),
        }}
      />

      {createModalOpen && (
        <ItemModal
          permissionData={data?.list || []}
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
