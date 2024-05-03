import { Button, Result } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useRouteError } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();
  const error = useRouteError() as any;

  return (
    <Result
      status="500"
      title="500"
      subTitle={error?.statusText || error?.message}
      extra={
        <Button type="primary" onClick={() => navigate("/", { replace: true })}>
          回到主页
        </Button>
      }
    />
  );
};

export default ErrorPage;
