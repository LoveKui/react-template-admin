import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const NoAuthPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="对不起,页面不存在"
      extra={
        <Button type="primary" onClick={() => navigate("/", { replace: true })}>
          回到主页
        </Button>
      }
    />
  );
};

export default NoAuthPage;
