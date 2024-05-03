import * as DictAPI from "@/services/dict/api";

import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Access, useAccess } from "@/components/Access";
import { Button, Col, message, Modal, Row } from "antd";
import React, { useRef, useState } from "react";
import DictDetail from "../DictDetail";
import ItemModal from "./ItemModal";

const TableList: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<Dict.Item>();
  const [selectedRowsState, setSelectedRows] = useState<Dict.Item[]>([]);

  const [ClickRows, setClickRows] = useState<Dict.Item>();

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
          DictAPI.remove(newId)
            .then((res) => {
              if (res?.code === 200) {
                message.success("删除成功");
                handleModalOpen(false);
                setSelectedRows([]);
                setClickRows({});
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

  const columns: ProColumns<Dict.Item>[] = [
    {
      title: "序号",
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "名称",
      dataIndex: "name",
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
      title: "描述",
      dataIndex: "description",
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
              access.allPermissionConfig.system.dict.delete
            )}
          >
            <Button
              type="link"
              danger
              key="config"
              onClick={(e) => {
                setCurrentRow(record);
                deleteHandler(record.id);
                e.stopPropagation();
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
              onClick={(e) => {
                handleModalOpen(true);
                setCurrentRow(record);
                e.stopPropagation();
              }}
            >
              编辑
            </Button>
          </Access>
        </>
      ),
    },
  ];

  const getAllList = async (param: API.PageParams) => {
    let { current, pageSize, ...newParams } = param;
    if (param?.blurry) {
      newParams = { ...newParams };
    }

    const res = await DictAPI.getList({
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
    <PageContainer>
      <Row gutter={24}>
        <Col span={12}>
          <ProTable<Dict.Item, API.PageParams>
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
              <Access
                key="primary"
                accessible={access.canShow(
                  access.allPermissionConfig.system.dict.add
                )}
              >
                <Button
                  icon={<PlusOutlined />}
                  type="primary"
                  onClick={() => {
                    setCurrentRow({} as Dict.Item);
                    handleModalOpen(true);
                  }}
                >
                  新建
                </Button>
              </Access>,
            ]}
            request={getAllList}
            columns={columns}
            onRow={(record) => {
              return {
                onClick: (event) => {
                  setClickRows(record);
                }, // 点击行
              };
            }}
            rowSelection={{
              onChange: (_, selectedRows) => {
                setSelectedRows(selectedRows);
              },
            }}
          />
        </Col>
        <Col span={12}>
          <DictDetail dictSelect={ClickRows} />
        </Col>
      </Row>

      {createModalOpen && (
        <ItemModal
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
