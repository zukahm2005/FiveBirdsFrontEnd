import React, { useEffect, useState } from "react";
import { Button, Table, Typography, Spin } from "antd";
import ExamRequest from "./ExamRequest";
import moment from "moment/moment";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://46.202.178.139:5050/api/v1/candidates");
        const result = await response.json();
        if (result.data) {
          setData(result.data);
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
  }, []);

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setSelectedRows([]);
      setLoading(false);
      setClose(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    const newSelectedRows = data.filter((item) =>
      newSelectedRowKeys.includes(item.id)
    );
    setSelectedRows(newSelectedRows);
    setClose(newSelectedRowKeys.length > 0);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  console.log(selectedRowKeys)

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
            dataSource={data}
            rowKey="id"
          />
        )}
      </div>
      {onClose && (
        <ExamRequest
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
