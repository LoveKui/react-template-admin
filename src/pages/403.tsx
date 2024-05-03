import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const NoAuthPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="403"
      title="403"
      subTitle="对不起,您没有权限访问此页面"
      extra={
        <Button type="primary" onClick={() => navigate("/", { replace: true })}>
          回到主页
        </Button>
      }
    />
  );
};

export default NoAuthPage;
