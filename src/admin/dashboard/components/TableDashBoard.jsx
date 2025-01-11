import React, { useEffect, useState } from "react";
import { Button, Table, Typography, Spin, Select, DatePicker, Empty, Input } from "antd";
import ExamRequest from "./ExamRequest";
import moment from "moment";
import {
  getAllCandidate,
  getCandidate,
  getCandidatePositions,
  getExamByName,
} from "../../../common/api/apiDashBoard";
import GlobalAlert from "../../../common/globalAlert/GlobalAlert.jsx";

const { RangePicker } = DatePicker;
const { Search } = Input;
const { Text } = Typography;


const columns = [
  {
    title: "ID",
    dataIndex: "index",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Full Name",
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (text) => (
        <div
            style={{
              maxWidth: "150px",
              whiteSpace: "normal",
              overflow: "visible",
              wordWrap: "break-word",
            }}
        >
          {text}
        </div>
    ),
  },
  {
    title: "Education",
    dataIndex: "education",
    key: "education",
  },
  {
    title: "Experience",
    dataIndex: "experience",
    key: "experience",
  },
  {
    title: "Position",
    dataIndex: "candidatePosition",
    key: "candidatePosition",
    render: (candidatePosition) => candidatePosition?.name || "N/A",
  },
  {
    title: "Status",
    dataIndex: "statusEmail",
    key: "statusEmail",
    render: (status) => {
      const colors = {
        PENDING: "orange",
        SUCCESS: "green",
        DEFAULT: "gray",
      };
      const color = colors[status] || colors.DEFAULT;
      return (
          <span
              style={{
                color,
                border: `2px solid ${color}`,
                padding: "2px 5px",
                borderRadius: "4px",
              }}
          >
          {status}
        </span>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
  },
];

const TableDashBoard = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [onClose, setClose] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [exam, setExam] = useState([]);
  const [statusEmail, setStatusEmail] = useState("");
  const [candidatePositionId, setCandidatePositionId] = useState("");
  const [candidatePositions, setCandidatePositions] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertDescription, setAlertDescription] = useState("");


  const fetchData = async () => {
    try {
      let startDate = "";
      let endDate = "";
      if (dateRange.length === 2) {
        startDate = dateRange[0].format("YYYY-MM-DD");
        endDate = dateRange[1].format("YYYY-MM-DD");
      }

      setLoading(true);

      const [result, resultCandidatePositions, dataCandidate] = await Promise.all([
        getAllCandidate(
            pagination.current,
            pagination.pageSize,
            statusEmail,
            candidatePositionId,
            startDate,
            endDate
        ),
        getCandidatePositions(),
        getCandidate(),
      ]);

      if (result.data) {
        setCandidatePositions(resultCandidatePositions.data.data);
        setData(result.data);
        setFilteredData(result.data);
        setPagination((prev) => ({
          ...prev,
          total: dataCandidate.data.data.length,
        }));
      } else {
        setError("No data available");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, statusEmail, candidatePositionId, dateRange]);

  useEffect(() => {
    if (selectedRows.length > 0) {
      const name = selectedRows.map((item) => item.candidatePosition.name);
      const fetchExamData = async () => {
        try {
          const getExamData = await getExamByName(name);
          if (getExamData.data) {
            setExam(getExamData.data);
          } else {
            setExam([])
            setAlertType("warning");
            setAlertDescription(<>No exams available <strong>{name}</strong></>);
            setAlertVisible(true);
          }
        } catch (err) {
          console.error(err);
        }
      };

      fetchExamData();
    }
  }, [selectedRows]);

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setSelectedRows([]);
      setLoading(false);
      setClose(false);
    }, 1000);
  };

  const onSearch = (value) => {
    const lowerValue = value.toLowerCase();
    const filtered = data.filter(
        (item) =>
            item.fullName.toLowerCase().includes(lowerValue) ||
            item.email.toLowerCase().includes(lowerValue) ||
            item.education.toLowerCase().includes(lowerValue) ||
            item.experience.toLowerCase().includes(lowerValue)
    );
    setFilteredData(filtered);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRows(data.filter((item) => newSelectedRowKeys.includes(item.id)));
    setClose(newSelectedRowKeys.length > 0);
  };

  const handleTableChange = (pagination) => {
    setPagination((prev) => ({
      ...prev,
      current: pagination.current,
      pageSize: pagination.pageSize,
    }));
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
      <div style={{ width: "100%", display: "flex", gap: "25px" }}>
        <GlobalAlert
            setVisible={setAlertVisible}
            visible={alertVisible}
            type={alertType}
            description={alertDescription}
        />
        <div
            style={{
              width: onClose ? "70%" : "100%",
              padding: "30px",
              border: "1px solid #f0f0f0",
              margin: "45px 0",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
        >
          <div style={{ marginBottom: 16, display: "flex", gap: "16px" }}>
            <Button type="primary" onClick={start} disabled={!selectedRowKeys.length} loading={loading}>
              Reload
            </Button>

            <Search
                placeholder="Search"
                allowClear
                onSearch={onSearch}
                style={{ width: "25%" }}
            />

            <Select
                style={{ width: 170 }}
                options={[
                  { value: "", label: "All Status" },
                  { value: "PENDING", label: "Pending" },
                  { value: "SUCCESS", label: "Success" },
                ]}
                placeholder="Select a status"
                onChange={setStatusEmail}
            />

            <Select
                placeholder="Select Position"
                style={{ width: 170 }}
                value={candidatePositionId || undefined}
                onChange={setCandidatePositionId}
            >
              <Select.Option value="" key="all-position">All Positions</Select.Option>
              {candidatePositions.map((status) => (
                  <Select.Option key={status.id} value={status.id}>
                    {status.name}
                  </Select.Option>
              ))}
            </Select>

            <RangePicker
                onChange={setDateRange}
                value={dateRange}
                format="YYYY-MM-DD"
                allowClear
            />
          </div>

          {loading ? (
              <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
          ) : (
              <Table
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={filteredData}
                  rowKey="id"
                  pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => {
                      setPagination((prev) => ({
                        ...prev,
                        current: page,
                        pageSize,
                      }));
                    },
                  }}
                  onChange={handleTableChange}
              />
          )}
        </div>

        {onClose && (
            <ExamRequest
                exam={exam}
                data={selectedRows}
                onClose={onClose}
                setClose={setClose}
                setSelectedRows={setSelectedRows}
                setSelectedRowKeys={setSelectedRowKeys}
            />
        )}
      </div>
  );
};

export default TableDashBoard;
