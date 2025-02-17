import React, { useEffect, useState } from "react";
import {Card, Row, Col, Avatar, Space, Typography, Alert, DatePicker} from "antd";
import { MoreOutlined, ArrowUpOutlined, PrinterOutlined, ExportOutlined, DownloadOutlined } from "@ant-design/icons";
import TableDashBoard from "./components/TableDashBoard";
import {getCandidate, getCandidateTest} from "./../../common/api/apiDashBoard";
import "./dashboard.scss";
import {Link, useNavigate} from "react-router-dom";

const { RangePicker } = DatePicker;

const DashboardContent = () => {
  const { Text, Title } = Typography;
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([]);


    useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getCandidate();
        setData(result.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const initializeData = () => {
      const isFirstVisit = !localStorage.getItem("visited");
      console.log(isFirstVisit);

      if (isFirstVisit) {
        localStorage.setItem("visited", "true");
        window.location.reload();
      } else {
        fetchData();
      }
    };

    initializeData();
  }, []);

    const filteredData = data.filter(item => {
        if (!dateRange[0] || !dateRange[1]) return true;
        const createdAt = new Date(item.createdAt);
        const startDate = new Date(dateRange[0]);
        const endDate = new Date(dateRange[1]);
        return createdAt >= startDate && createdAt <= endDate;
    });


    const handleNavigate = () => {
        navigate('/admin/manager-candidate', { state: { filter: 'Pass' } });
    };
    const handleNavigate2 = () => {
        navigate('/admin/manager-candidate', { state: { filter: 'Failed' } });
    };
    const handleNavigate3 = () => {
        navigate('/admin/manager-candidate', { state: { filter: 'True' } });
    };

  return (
    <div className="container-dashbord">
      {/* <Row justify="space-between" align="middle"
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
      </Row> */}
        <RangePicker
            format="YYYY-MM-DD"
            allowClear
            onChange={(dates, dateStrings) => {
                setDateRange(dateStrings);
            }}
        />

        <Row style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: "15px", marginTop: "25px" }}>
        <Col xs={24} sm={6}>
          <Link to="/admin/manager-candidate">
              <Card className="cardStyle" bodyStyle={{ padding: 0 }}>
                  <Space style={{ display: "flex", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: "20px" }} strong>Total Candidates</Text>
                      <MoreOutlined style={{ fontSize: "23px" }} />
                  </Space>
                  <Space style={{ display: "flex", justifyContent: "space-between" }}>
                      <Title level={2} style={{ margin: "16px 0" }}>
                          {filteredData.length}
                      </Title>
                      <Text style={{ color: "green" }}>
                          <ArrowUpOutlined /> 20%
                      </Text>
                  </Space>
              </Card>
          </Link>
        </Col>

        <Col xs={24} sm={6}>
                <a onClick={handleNavigate3}>
                    <Card className="cardStyle2" bodyStyle={{ padding: 0 }}>
                        <Space style={{ display: "flex", justifyContent: "space-between" }}>
                            <Text style={{ fontSize: "20px" }} strong>Sent Interview Email</Text>
                            <MoreOutlined style={{ fontSize: "23px" }} />
                        </Space>
                        <Space style={{ display: "flex", justifyContent: "space-between" }}>
                            <Title level={2} style={{ margin: "16px 0" }}>
                                {filteredData.filter(item => item.isInterview === true).length}
                            </Title>
                            <Text style={{ color: "red" }}>
                                <ArrowUpOutlined /> 40%
                            </Text>
                        </Space>
                    </Card>
                </a>
        </Col>

        <Col xs={24} sm={6}>
            <a onClick={handleNavigate}>
            <Card className="cardStyle2" bodyStyle={{ padding: 0 }}>
            <Space style={{ display: "flex", justifyContent: "space-between" }}>
              <Text style={{ fontSize: "20px" }} strong>Candidate Passed</Text>
              <MoreOutlined style={{ fontSize: "23px" }} />
            </Space>
            <Space style={{ display: "flex", justifyContent: "space-between" }}>
              <Title level={2} style={{ margin: "16px 0", border: "none" }}>
                {filteredData.filter(item => item.isPast === true).length}
              </Title>
                <Text style={{ color: "green" }}>
                    <ArrowUpOutlined /> 20%
                </Text>
            </Space>
          </Card>
            </a>
        </Col>

          <Col xs={24} sm={6} style={{ borderLeft: "1px solid  #f0f0f0" }}>
              <a onClick={handleNavigate2}>
                  <Card className="cardStyle3" bodyStyle={{ padding: 0 }}>
                      <Space style={{ display: "flex", justifyContent: "space-between" }}>
                          <Text style={{ fontSize: "20px" }} strong>Candidate Failed.</Text>
                          <MoreOutlined style={{ fontSize: "23px" }} />
                      </Space>
                      <Space style={{ display: "flex", justifyContent: "space-between" }}>
                          <Title level={2} style={{ margin: "16px 0" }}>
                              {filteredData.filter(item => item.isPast === false).length}
                          </Title>
                          <Text style={{ color: "orange" }}>
                              <ArrowUpOutlined /> 10%
                          </Text>
                      </Space>
                  </Card>
              </a>
          </Col>
      </Row>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
        <TableDashBoard />
      </div>


    </div>
  );
};

export default DashboardContent;
