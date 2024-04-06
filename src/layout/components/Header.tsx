import React from "react";
import { Row, Col, Typography, Space } from "antd";
import RightContent from "./RightContent";

const { Text } = Typography;

const HeaderComp: React.FC = () => {
  return (
    <Row justify="space-between" align="middle">
      <Col>
        <Space>
          <img src={"/logo512.png"} alt="Logo" style={{ width: "50px" }} />
          <Text strong style={{ fontSize: 18 }}>
            react-template-admin
          </Text>
        </Space>
      </Col>
      <Col style={{ display: "flex" }}>
        <RightContent />
      </Col>
    </Row>
  );
};

export default HeaderComp;
