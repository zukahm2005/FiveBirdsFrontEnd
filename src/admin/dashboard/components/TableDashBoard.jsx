import React, { useEffect, useState } from "react";
import { Button, Table, Typography, Spin } from "antd";
import ExamRequest from "./ExamRequest";
import moment from "moment/moment";
import { Input } from 'antd';
const { Search } = Input;
import { getAllCandidate, getExam } from "../../../common/api/apiDashBoard";

const { Text } = Typography;

const columns = [
  {
    title: "Id",
    dataIndex: "id",
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
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
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
    title: "Candidate Position",
    dataIndex: "candidatePosition",
    key: "candidatePosition",
    render: (candidatePosition) => candidatePosition?.name || "N/A",
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

  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllCandidate(pagination.current, pagination.pageSize);
        const exemResult = await getExam();
        
        if (result.data) {
          setExam(exemResult.data);
          setData(result.data);
          setFilteredData(result.data);
          setPagination(prev => ({
            ...prev,
            total: result.totalCount, 
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
    setLoading(true);
    fetchData();
  }, [pagination.current, pagination.pageSize]); 

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
        item.phone.includes(lowerValue) ||
        item.education.toLowerCase().includes(lowerValue) ||
        item.experience.toLowerCase().includes(lowerValue)
    );
    setFilteredData(filtered);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const newSelectedRows = data.filter((item) =>
      newSelectedRowKeys.includes(item.id)
    );
    setSelectedRows(newSelectedRows);
    setClose(newSelectedRowKeys.length > 0);
  };

  const handleTableChange = (pagination) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: pagination.total,
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div style={{ width: "100%", display: "flex", gap: "25px" }}>
      <div
        style={{
          width: onClose ? "67%" : "100%",
          padding: "30px",
          border: "1px solid #f0f0f0",
          margin: "45px 0",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ marginBottom: 16, display: "flex", gap: "16px" }}>
          <Button
            type="primary"
            onClick={start}
            disabled={!hasSelected}
            loading={loading}
          >
            Reload
          </Button>

          <div style={{ width: "25%" }}>
            <Search
              placeholder="input search text"
              allowClear
              onSearch={onSearch}
            />
          </div>
        </div>

        {loading ? (
          <Spin />
        ) : error ? (
          <Text type="danger">{error}</Text>
        ) : data.length === 0 ? (
          <Text type="warning">No data to display</Text>
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
              onChange: handleTableChange,
            }}
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
          selectedRowKeys={selectedRowKeys}
        />
      )}
    </div>
  );
};

export default TableDashBoard;
