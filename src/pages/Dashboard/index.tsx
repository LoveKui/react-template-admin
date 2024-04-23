import React, { useEffect } from "react";
import { Row, Col } from "antd";
import DemoCard from "./components/DemoCard";
import DemoColumn from "./components/DemoColumn";
import DemoPie from "./components/DemoPie";
import DemoLine from "./components/DemoLine";

import { useUseData } from "@stores/index";

const Dashboard: React.FC = () => {
  const userInfo = useUseData((state) => state);

  useEffect(() => {
    userInfo.fetch();
  }, []);
  useEffect(() => {
    console.log("users", userInfo.users);
  }, [userInfo.users]);
  return (
    <React.Fragment>
      <DemoCard />
      <Row wrap style={{ marginTop: 20 }}>
        <Col span={24} style={{ background: "white", padding: 10 }}>
          <DemoLine />
        </Col>
      </Row>
      <Row wrap style={{ marginTop: 20 }} justify="space-between">
        <Col style={{ background: "white", padding: 10, width: "49%" }}>
          <DemoColumn />
        </Col>
        <Col style={{ background: "white", padding: 10, width: "49%" }}>
          <DemoPie />
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Dashboard;
