import * as DictDetailAPI from "@/services/dictDetail/api";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Access, useAccess } from "@/components/Access";
import { Button, message, Modal } from "antd";
import _ from "lodash";
import React, { useRef, useState } from "react";
import ItemModal from "./ItemModal";

interface Prop {
  dictSelect?: Dict.Item;
}

const TableList: React.FC = ({ dictSelect }: Prop) => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<DictDetail.Item>();
  const [selectedRowsState, setSelectedRows] = useState<DictDetail.Item[]>([]);

  const [loading, setLoading] = useState(false);

  const access = useAccess();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const deleteHandler = (id?: string) => {
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
          DictDetailAPI.remove(newId)
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
            .catch((err) => {
              setLoading(false);
            });
        },
        okButtonProps: {
          loading,
        },
      });
    }
  };

  const columns: ProColumns<DictDetail.Item>[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    // {
    //   title: '字典名称',
    //   dataIndex: 'dictName',
    //   hideInSearch: true,
    // },

    {
      title: "名称(键)",
      dataIndex: "label",
      hideInSearch: true,
    },

    {
      title: "值",
      dataIndex: "value",
      hideInSearch: true,
    },
    {
      title: "顺序",
      dataIndex: "dictSort",
      hideInSearch: true,
    },
    {
      title: "模糊查询",
      dataIndex: "blurry",
      hideInTable: true,
      hideInForm: true,
      fieldProps: {
        placeholder: "请输入名称",
      },
    },

    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      align: "center",

      render: (text, record) => (
        <>
          {!_.isEmpty(dictSelect) && (
            <>
              <Access
                accessible={access.canShow(
                  access.allPermissionConfig.system.dict.delete
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
                  access.allPermissionConfig.system.dict.update
                )}
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
          )}
        </>
      ),
    },
  ];

  const getAllList = async (param: API.PageParams) => {
    if (!param?.dictId) {
      return {
        data: [],
        success: true,
        total: 0,
      };
    }
    let { current, pageSize, ...newParams } = param;
    if (param?.blurry) {
      newParams = { ...newParams, blurryFields: "label" };
    }

    const res = await DictDetailAPI.getList({
      pageNum: current || 1,
      pageSize: pageSize || 20,
      ...newParams,
    });
    return {
      data: res?.data?.records,
      success: true,
      total: res?.data?.total,
    };
  };

  return (
    <>
      <ProTable<Dict.Item, API.PageParams>
        headerTitle={dictSelect?.description || "全部"}
        actionRef={actionRef}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <>
            {selectedRowsState.length > 0 && (
              <Access
                accessible={access.canShow(
                  access.allPermissionConfig.system.dict.delete
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
          <>
            {!_.isEmpty(dictSelect) && (
              <Access
                accessible={access.canShow(
                  access.allPermissionConfig.system.dict.add
                )}
              >
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  key="primary"
                  onClick={() => {
                    setCurrentRow({} as Dict.Item);
                    handleModalOpen(true);
                  }}
                >
                  新建
                </Button>
              </Access>
            )}
          </>,
        ]}
        params={{ dictId: dictSelect?.id }}
        request={getAllList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      {!_.isEmpty(dictSelect) && createModalOpen && (
        <ItemModal
          dictSelect={dictSelect}
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
    </>
  );
};
export default TableList;
