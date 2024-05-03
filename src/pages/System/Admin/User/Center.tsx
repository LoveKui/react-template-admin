import { getInitialState } from '@/app';
import { loginOut } from '@/components/RightContent/AvatarDropdown';
import UploadImg from '@/components/UploadImg';
import * as logAPI from '@/services/log/api';
import * as userAPI from '@/services/user/api';
import { userInfoUtils } from '@/utils/common';
import {
  BellOutlined,
  ClusterOutlined,
  LogoutOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  List,
  message,
  Modal,
  Radio,
  Row,
  Space,
  Tabs,
} from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useModel } from 'umi';
import UpdatePass from './UpdatePass';

const { TabPane } = Tabs;

const UserCenter = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState;
  const [editLoading, setEditLoading] = useState(false);
  const user: API.CurrentUser = currentUser || {};
  const {
    username = '',
    nickname = '',
    department = '',
    tel = '',
    email = '',
    sex = '',
    id = '',
  } = user;
  const [modifyPasswordShow, setModifyPasswordShow] = useState(false);
  const [uploadImageShow, setUploadImageShow] = useState(false);
  const [userForm] = Form.useForm();

  useEffect(() => {}, [currentUser]);

  const [file, setFile] = useState({} as any);

  const data = [
    {
      label: '登录账号',
      value: username,
      icon: <LogoutOutlined />,
    },
    {
      label: '用户昵称',
      value: nickname,
      icon: <UserOutlined />,
    },
    {
      label: '所属部门',
      value: department,
      icon: <ClusterOutlined />,
    },
    {
      label: '手机号码',
      value: tel,
      icon: <PhoneOutlined />,
    },
    {
      label: '用户邮箱',
      value: email,
      icon: <BellOutlined />,
    },
  ];

  const footer = () => {
    return (
      <Space size={90} style={{ marginLeft: 17 }}>
        <label>
          <SafetyCertificateOutlined />
          安全设置
        </label>
        <Space>
          <a
            onClick={() => {
              setModifyPasswordShow(true);
            }}
          >
            修改密码
          </a>
        </Space>
      </Space>
    );
  };

  const getTabelData = async (params: { current: number; pageSize: number }) => {
    let convertParams: Log.Query = {
      pageNum: params.current,
      pageSize: params.pageSize,
      name: username,
    };

    const res = await logAPI.findLogPage(convertParams);
    return {
      data: res?.data.list,
      // success 请返回 true，
      // 不然 table 会停止解析数据，即使有数据
      success: true,
      // 不传会使用 data 的长度，如果是分页一定要传
      total: res?.data.count,
    };
  };

  const columns: Log.ItemLog | ProColumns<Log.ItemLog, 'text'>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '行为',
      dataIndex: 'content',
    },
    {
      title: 'IP',
      dataIndex: 'requestIp',
    },
    {
      title: 'IP来源',
      dataIndex: 'address',
    },

    {
      title: '浏览器',
      dataIndex: 'browser',
    },
    // {
    //   title: '请求耗时',
    //   dataIndex: 'time',
    //   render: (_, record) => {
    //     if (record.time <= 300) {
    //       return <Tag color="blue">{record.time}ms</Tag>;
    //     } else if (record.time <= 1000) {
    //       return <Tag color="orange">{record.time}ms</Tag>;
    //     } else {
    //       return <Tag color="red">{record.time}ms</Tag>;
    //     }
    //   },
    // },
    {
      title: '创建日期',
      dataIndex: 'operDate',
    },
  ];

  const onChooseFileEnd = (file: UploadFile<any>, imageUrl: string | undefined) => {
    setFile(file);
  };

  const saveUserCenterHandler = () => {
    setEditLoading(true);
    userForm
      .validateFields()
      .then((res) => {
        const { initAuthorities, password, ...newUser } = user;
        const params = { ...newUser, ...res };
        console.log(params);
        userAPI.updateById(params).then(async (results) => {
          if (results?.code !== 200) {
            return;
          }
          setEditLoading(false);

          const userInfo = await (await getInitialState()).fetchUserInfo();
          if (userInfo) {
            userInfoUtils.setUserInfo(userInfo);
            flushSync(() => {
              setInitialState((s) => ({
                ...s,
                currentUser: userInfo as User.LoginUserInfo['principal']['user'],
              }));
            });
          }
          message.success('资料修改成功,请重新登录');

          setTimeout(() => {
            loginOut();
          }, 3000);
          console.log(userInfo);
        });
      })
      .catch((err) => setEditLoading(false));
  };

  const updateUserAvatarHandler = () => {
    const formData = new FormData();
    formData.append('avatar', file);
    updateUserAvatar(formData).then(async (res) => {
      if (res?.status) {
        return false;
      }
      message.success('上传成功!');
      await getInitialState();
      setUploadImageShow(false);
    });
  };

  return (
    <>
      <PageContainer
        header={{
          breadcrumb: {},
          title: '个人中心',
        }}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Card title="个人信息">
              <div style={{ textAlign: 'center' }}>
                <Image
                  onClick={() => {
                    // setUploadImageShow(true);
                  }}
                  title="点击上传头像"
                  preview={false}
                  width={150}
                  // src={`/avatar/${currentUser?.user?.avatarName}`}
                  src={`${require('@/assets/images/user1.png')}`}
                />
              </div>
              <div className="mt10">
                <List
                  size="small"
                  header={null}
                  footer={footer()}
                  bordered={false}
                  dataSource={data}
                  renderItem={(item) => (
                    <List.Item>
                      {
                        <>
                          <label>
                            {' '}
                            <span style={{ marginRight: 3 }}> {item.icon}</span>
                            {item.label}
                          </label>
                          <span>{item.value}</span>
                        </>
                      }
                    </List.Item>
                  )}
                />
              </div>
            </Card>
          </Col>
          <Col span={16} style={{ height: '100%' }}>
            <Tabs defaultActiveKey="1" style={{ background: 'white', padding: '0 10px' }}>
              <TabPane tab="用户资料" key="1">
                <Form
                  name="basic"
                  form={userForm}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 10 }}
                  autoComplete="off"
                  initialValues={{
                    nickname,
                    tel,
                    sex,
                  }}
                >
                  <Form.Item
                    tooltip="用户昵称不作为登录使用"
                    label="昵称"
                    name="nickname"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    tooltip="手机号码不能重复"
                    label="手机号"
                    name="tel"
                    rules={[
                      {
                        required: true,
                        pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                        message: '请输入正确的手机号',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item label="性别" name="sex" rules={[{ required: true }]}>
                    <Radio.Group>
                      <Radio value={1}>男</Radio>
                      <Radio value={0}>女</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Form.Item wrapperCol={{ offset: 4, span: 10 }}>
                    <Button type="primary" loading={editLoading} onClick={saveUserCenterHandler}>
                      保存配置
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
              <TabPane tab="操作日志" key="2">
                <ProTable<User.Item, API.PageParams>
                  headerTitle="查询表格"
                  rowKey="time"
                  pagination={{
                    pageSize: 10,
                  }}
                  search={false}
                  toolBarRender={false}
                  tableAlertRender={false}
                  tableAlertOptionRender={false}
                  request={getTabelData}
                  columns={columns}
                />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </PageContainer>

      {modifyPasswordShow && (
        <UpdatePass
          visible={modifyPasswordShow}
          cancel={() => {
            setModifyPasswordShow(false);
          }}
        />
      )}

      <Modal
        title="上传头像"
        maskClosable={false}
        visible={uploadImageShow}
        onOk={() => {
          updateUserAvatarHandler();
        }}
        onCancel={() => {
          setUploadImageShow(false);
        }}
      >
        <UploadImg onChooseFileEnd={onChooseFileEnd} />
      </Modal>
    </>
  );
};

export default UserCenter;
