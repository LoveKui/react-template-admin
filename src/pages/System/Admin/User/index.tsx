import * as roleAPI from "@/services/role/api";
import * as userAPI from "@/services/user/api";

import * as departmentAPI from "@/services/department/api";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Access, useAccess } from "@/components/Access";
import { Button, message, Modal, Switch, Tag, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import ItemModal from "./ItemModal";
import UpdatePassIndex from "./UpdatePassIndex";
import { useRequest } from "ahooks";

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<User.Add>();
  const [selectedRowsState, setSelectedRows] = useState<User.Add[]>([]);
  const access = useAccess();
  const [treeData, setTreeData] = useState([] as any[]);
  const [showUpdatePass, setShowUpdatePass] = useState(false);

  const [loading, setLoading] = useState(false);

  const [updatePwdRowsState, setUpdatePwdRowsState] = useState<User.Add[]>([]);

  const {
    run,
    data,
    error,
    loading: permissionLoading,
  } = useRequest(
    (pageNum: number, pageSize: number) =>
      roleAPI.getList({ pageNum, pageSize }),
    {
      manual: true,
    }
  );

  useEffect(() => {
    run(1, 50);
  }, []);

  const getDepartmentList = async () => {
    function convertData(data: Department.INode[]) {
      if (data?.length > 0) {
        return data?.map((el) => {
          if (el?.children?.length > 0) {
            return {
              ...el.node,
              key: el.node.id,
              title: el.node.name,
              value: el.node.name,
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
    }

    const res = await departmentAPI.getCatalog();
    const data = convertData(res?.nodes);
    setTreeData(data);
  };

  useEffect(() => {
    getDepartmentList();
  }, []);

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
          userAPI
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

  const handleCheckStatus = (record: User.Add, value: boolean) => {
    userAPI
      .updateById({ ...record, locked: value === true ? 1 : 0 })
      .then((res) => {
        message.success("更新成功");
      });
  };

  const columns: ProColumns<User.Add>[] = [
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
        placeholder: "请输入用户名称或者部门名称",
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "姓名",
      dataIndex: "nickname",
    },
    {
      title: "身份证",
      dataIndex: "idNumber",
    },
    {
      title: "部门",
      dataIndex: "department",
      valueType: "treeSelect",
      render: (_, record) => {
        return <>{record?.departmentName}</>;
      },

      fieldProps: {
        suffixIcon: false,
        filterTreeNode: true,
        showSearch: true,
        autoClearSearchValue: true,

        treeData: treeData,
      },

      // renderFormItem: () => {
      //   return (
      //     <>
      //       <TreeSelect
      //         showSearch
      //         dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      //         placeholder="请选择部门"
      //         allowClear
      //         treeDefaultExpandAll
      //         treeData={treeData}
      //       />
      //     </>
      //   );
      // },
    },

    {
      title: "性别",
      dataIndex: "sex",
      valueType: "select",
      fieldProps: {
        options: [
          {
            label: "男",
            value: 1,
          },
          {
            label: "女",
            value: 0,
          },
        ],
      },
      render: (_, record) => {
        return <>{record.sex === 1 ? "男" : "女"}</>;
      },
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },

    {
      title: "是否锁定",
      dataIndex: "locked",
      fieldProps: {
        options: [
          {
            label: "是",
            value: 1,
          },
          {
            label: "否",
            value: 0,
          },
        ],
      },

      tooltip: "已锁定账户不能登录",
      render: (_, record, index) => {
        return (
          <Tooltip title="锁定账户不能登录">
            <Switch
              disabled={access.canAdmin ? false : true}
              key={`${record.id}_${record.locked}`}
              checkedChildren="已锁定"
              unCheckedChildren="未锁定"
              defaultChecked={!!record.locked} //使用checked 来判断 switch 的选中状态
              onChange={(value) => {
                handleCheckStatus(record, value);
              }}
            />
          </Tooltip>
        );
      },
    },
    {
      title: "角色",
      dataIndex: "roles",
      hideInSearch: true,
      render: (_, record) => {
        return (
          <div>
            {record?.roles?.map((el) => (
              <Tooltip
                key={el}
                title={
                  data?.data?.list?.find((k) => k.name === el)?.description
                }
              >
                <Tag color="#108ee9">
                  {data?.data?.list?.find((k) => k.name === el)?.description}
                </Tag>
              </Tooltip>
            ))}
          </div>
        );
      },
    },
    {
      title: "备注",
      hideInSearch: true,
      dataIndex: "remark",
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
              access.allPermissionConfig.system.user.delete
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
              access.allPermissionConfig.system.user.update
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
          <Access accessible={access.canAdmin} fallback={null}>
            <Button
              size="small"
              key={"updatepwd"}
              onClick={() => {
                setUpdatePwdRowsState([record]);

                setShowUpdatePass(true);
              }}
            >
              修改密码
            </Button>
          </Access>
        </>
      ),
    },
  ];

  const getOsAllList = async (param: API.PageParams) => {
    const { current, pageSize, ...newParams } = param;
    console.log("newParams", newParams);

    const res = await userAPI.getUserList({
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
    <PageContainer style={{ padding: 0, paddingInline: 0 }}>
      <ProTable<User.Item, API.PageParams>
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
                  access.allPermissionConfig.system.user.delete
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
            key="add"
            accessible={access.canShow(
              access.allPermissionConfig.system.user.add
            )}
            fallback={null}
          >
            <Button
              icon={<PlusOutlined />}
              type="primary"
              key="add"
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
          department={treeData}
          roles={data?.data?.list || []}
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
      {showUpdatePass && (
        <UpdatePassIndex
          item={updatePwdRowsState[0]}
          visible={showUpdatePass}
          cancel={() => {
            setShowUpdatePass(false);
            actionRef?.current?.reload();
          }}
        />
      )}
    </PageContainer>
  );
};
export default TableList;
