/*
 * @Descripttion:
 * @Author: duk
 * @Date: 2023-03-29 11:37:34
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-11-26 08:26:00
 */
import * as roleAPI from '@/services/role/api';
import { Form, Input, message, Modal, TreeSelect } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

interface Props {
  permissionData: Permission.Item[];
  open: boolean;
  item?: Role.Item;
  onOk: (flag: boolean) => void;
  treeData: Permission.Item[];
}
const Index: React.FC<Props> = ({ open, item, onOk, permissionData, treeData }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [aa, setAA] = useState([]);
  const { SHOW_PARENT } = TreeSelect;

  useEffect(() => {
    form.setFieldsValue({ ...item, permission: item?.permissions?.map((el) => el.name) });
    if (item?.permissions?.length > 0) {
      setIndeterminate(true);
    }
    if (permissionData?.length > 0 && item?.permissions?.length === permissionData?.length) {
      setCheckAll(true);
      setIndeterminate(false);
    }
  }, [item]);

  useEffect(() => {
    form.setFieldsValue({
      permission: Array.from(new Set([...(form.getFieldValue('permission') || []), ...aa])),
    });
  }, [aa]);

  const onChange = (list: CheckboxValueType[]) => {
    setIndeterminate(!!list.length && list.length < permissionData.length);
    setCheckAll(list.length === permissionData.length);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    form.setFieldsValue({
      permission: e.target.checked ? permissionData?.map((el) => el.name) : [],
    });
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const isAdd = useMemo(() => (_.isEmpty(item) ? true : false), [item]);
  const onOkHandler = () => {
    form.validateFields().then((res) => {
      setLoading(true);
      const { name, description, permission } = res || {};
      const params = {
        name,
        description,
        permissions: permission?.map((el) => ({ name: el })),
      };
      if (isAdd) {
        roleAPI.add(params).then((k) => {
          if (k.code === 200) {
            message.success('添加成功');
            onOk(true);
          } else {
            message.error('添加失败');
          }
          setLoading(false);
        });
      } else {
        const { ...newItem } = item;
        roleAPI.updateById({ ...newItem, ...params }).then((k) => {
          if (k.code === 200) {
            message.success('更新成功');
            onOk(true);
          } else {
            message.error('更新失败');
          }
          setLoading(false);
        });
      }
      console.log(res);
    });
  };
  const onValuesChange = (changedValues, allValues) => {
    console.log(changedValues, allValues);
  };

  const onChange1 = (e) => {
    const { checked, value } = e.target;
    const arr = ['update', 'add', 'delete'];
    const newPermission = [];
    const permissionFormValue = form.getFieldValue('permission') || [];

    // 获取对应的权限值
    const permissionValue = permissionData?.find((el) => el.name === value)?.url;
    const permissionValueAtrr = permissionValue?.split(':');
    if (checked) {
      if (
        permissionValue?.includes('update') ||
        permissionValue?.includes('add') ||
        permissionValue?.includes('delete')
      ) {
        if (!permissionFormValue?.includes(value)) {
          let k = '';
          if (permissionValueAtrr?.length === 3) {
            k = permissionValueAtrr[0] + ':' + permissionValueAtrr[1] + ':list';
          } else {
            k = permissionValueAtrr[0] + ':' + 'list';
          }
          let kName = permissionData?.find((el) => el.url === k)?.name;

          setAA(aa.concat(kName));
        }
      }
    }

    console.log(e);
  };
  return (
    <Modal
      title={isAdd ? '添加角色信息' : '修改角色信息'}
      onCancel={() => {
        onOk(false);
      }}
      maskClosable={false}
      open={open}
      onOk={onOkHandler}
      okButtonProps={{ loading }}
      width={'45%'}
      bodyStyle={{ height: 450, overflowY: 'auto', overflowX: 'hidden' }}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        form={form}
        onValuesChange={onValuesChange}
      >
        <Form.Item name="description" label="名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="描述" rules={[{ required: true }]}>
          <Input.TextArea />
        </Form.Item>

        {/* <Checkbox
          style={{ marginLeft: '17%' }}
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          全选
        </Checkbox> */}
        <Form.Item name="permission" label="目录">
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择目录"
            allowClear
            treeDefaultExpandAll
            treeData={treeData}
            treeCheckable
            multiple
            //showCheckedStrategy={SHOW_PARENT}
          />
        </Form.Item>
        {/* <Form.Item name="permission" label="选择权限" rules={[{ required: true }]}>
          <Checkbox.Group
            // options={permissionData?.map((el) => el.name)}
            onChange={onChange}
          >
            {permissionData?.map((el) => (
              <Checkbox
                style={{ width: 150, padding: 5 }}
                onChange={onChange1}
                value={el.name}
                key={el.id}
              >
                <Tooltip title={el.description}>{el.name}</Tooltip>
              </Checkbox>
            ))}
          </Checkbox.Group>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

export default Index;
