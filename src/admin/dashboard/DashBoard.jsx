import React, { useEffect, useState } from "react";
import { Card, Row, Col, Avatar, Space, Typography, Alert } from "antd";
import { MoreOutlined, ArrowUpOutlined, PrinterOutlined, ExportOutlined, DownloadOutlined } from "@ant-design/icons";
import TableDashBoard from "./components/TableDashBoard";
import {getCandidate} from "./../../common/api/apiDashBoard";
import "./dashboard.scss";

const DashboardContent = () => {
  const { Text, Title } = Typography;
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
        const result =  await getCandidate()
      setData(result.data);
    };
    fetchData();
  }, []);


  return (
    <div className="container-dashbord">
      <Row justify="space-between" align="middle"
        style={{ marginBottom: 16, border: "1px solid  #f0f0f0", padding: "25px", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <Col>
          <Text style={{ fontSize: "28px" }} strong>Candidate</Text>
        </Col>
        <Col>
          <Row gutter={16}>
            <Col style={{ border: "1px solid #f0f0f0", display: "flex", textAlign: "center", alignItems: "center", margin: "0 5px", borderRadius: "3px", cursor: "pointer" }}>
              <PrinterOutlined style={{ fontSize: "20px" }} />
            </Col>
            <Col style={{ border: "1px solid #f0f0f0", display: "flex", textAlign: "center", alignItems: "center", borderRadius: "3px", cursor: "pointer" }}>
              <ExportOutlined style={{ fontSize: "20px" }} />
            </Col>
            <Col style={{ border: "1px solid #f0f0f0", display: "flex", textAlign: "center", alignItems: "center", margin: "0 5px", borderRadius: "3px", cursor: "pointer" }}>
              <DownloadOutlined style={{ fontSize: "20px" }} />
            </Col>
            <Col>
              <button style={{ background: "#000", color: "#fff", padding: "13px", borderRadius: "3px", cursor: "pointer" }}>+ Add candidate</button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: "15px" }}>
        <Col xs={24} sm={6}>
          <Card className="cardStyle" bodyStyle={{ padding: 0 }}>
            <Space style={{ display: "flex", justifyContent: "space-between" }}>
              <Text style={{ fontSize: "16px" }} strong>Total candidates</Text>
              <MoreOutlined style={{ fontSize: "23px" }} />
            </Space>
            <Space style={{ display: "flex", justifyContent: "space-between" }}>
              <Title level={2} style={{ margin: "16px 0" }}>
                {data.length}
              </Title>
              <Text style={{ color: "green" }}>
                <ArrowUpOutlined /> 20%
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={6}>
          <Card className="cardStyle2" bodyStyle={{ padding: 0 }}>
            <Space style={{ display: "flex", justifyContent: "space-between" }}>
              <Text style={{ fontSize: "16px" }} strong>Rejected candidates</Text>
              <MoreOutlined style={{ fontSize: "23px" }} />
            </Space>
            <Space style={{ display: "flex", justifyContent: "space-between" }}>
              <Title level={2} style={{ margin: "16px 0" }}>
                1,945
              </Title>
              <Text style={{ color: "red" }}>
                <ArrowUpOutlined /> 40%
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={6} style={{ borderLeft: "1px solid  #f0f0f0" }}>
          <Card className="cardStyle2" bodyStyle={{ padding: 0 }}>
            <Space style={{ display: "flex", justifyContent: "space-between" }}>
              <Text style={{ fontSize: "16px" }} strong>Pending candidates</Text>
              <MoreOutlined style={{ fontSize: "23px" }} />
            </Space>
            <Space style={{ display: "flex", justifyContent: "space-between" }}>
              <Title level={2} style={{ margin: "16px 0" }}>
                500
              </Title>
              <Text style={{ color: "orange" }}>
                <ArrowUpOutlined /> 10%
              </Text>
            </Space>
          </Card>
        </Col>

        <Col xs={24} sm={6}>
          <Card className="cardStyle3" bodyStyle={{ padding: 0 }}>
            <Space style={{ display: "flex", justifyContent: "space-between" }}>
              <Text style={{ fontSize: "16px" }} strong>Active candidates</Text>
              <MoreOutlined style={{ fontSize: "23px" }} />
            </Space>
            <Space style={{ display: "flex", justifyContent: "space-between" }}>
              <Title level={2} style={{ margin: "16px 0", border: "none" }}>
                400
              </Title>
              <Avatar.Group maxCount={4}>
                <Avatar src="https://randomuser.me/api/portraits/women/1.jpg" />
                <Avatar src="https://randomuser.me/api/portraits/men/2.jpg" />
                <Avatar src="https://randomuser.me/api/portraits/women/3.jpg" />
                <Avatar src="https://randomuser.me/api/portraits/men/4.jpg" />
              </Avatar.Group>
            </Space>
          </Card>
        </Col>
      </Row>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
        <TableDashBoard />
      </div>


    </div>
  );
};

export default DashboardContent;
