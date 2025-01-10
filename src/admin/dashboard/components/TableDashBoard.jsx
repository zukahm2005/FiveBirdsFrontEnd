import React, { useEffect, useState } from "react";
import {Button, Table, Typography, Spin, Select, DatePicker, Empty} from "antd";
import ExamRequest from "./ExamRequest";
import moment from "moment/moment";
import { Input } from 'antd';
const { Search } = Input;
import { getAllCandidate, getCandidate, getCandidatePositions, getExam } from "../../../common/api/apiDashBoard";

const { RangePicker } = DatePicker;

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
    )
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
      let color;
      let borderColor;

      if (status === "PENDING") {
        color = "orange";
        borderColor = "orange";
      } else if (status === "SUCCESS") {
        color = "green";
        borderColor = "green";
      } else {
        color = "gray";
        borderColor = "gray";
      }

      return (
        <span
          style={{
            color,
            border: `2px solid ${borderColor}`,
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
  const [statusEmail, SetStatusEmail] = useState('')
  const [candidatePositionId, SetcandidatePositionId] = useState('')
  const [candidatePositions, setCandidatePositions] = useState([])
  const [dateRange, setDateRange] = useState([]);


  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });


  useEffect(() => {
      const fetchData = async () => {
        try {
          let startDate = '', endDate = '';
          if (dateRange && dateRange.length === 2) {
            startDate = dateRange[0].format("YYYY-MM-DD");
            endDate = dateRange[1].format("YYYY-MM-DD");
          }

          const result = await getAllCandidate(pagination.current, pagination.pageSize, statusEmail, candidatePositionId, startDate, endDate);
          const resultCandidatePositions = await getCandidatePositions();
          const dataCandidate = await getCandidate();
          const getExamData = await getExam();
          if (result.data) {
            setCandidatePositions(resultCandidatePositions.data.data);
            setExam(getExamData.data);
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

      setLoading(true);
      fetchData();
  }, [pagination.current, pagination.pageSize, statusEmail, candidatePositionId, dateRange]);

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

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <div style={{ width: "100%", display: "flex", gap: "25px" }}>
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
        <div style={{marginBottom: 16, display: "flex", gap: "16px"}}>
          <Button
              type="primary"
              onClick={start}
              disabled={!hasSelected}
              loading={loading}
          >
            Reload
          </Button>

          <div style={{width: "25%"}}>
            <Search
                placeholder="input search text"
                allowClear
                onSearch={onSearch}
            />
          </div>

          <div>
            <Select
                style={{
                  width: 170,
                  color: statusEmail === "PENDING" ? "orange" : "green",
                }}
                options={[
                  {value: "", label: <span>All Status</span>},
                  {value: "PENDING", label: <span style={{color: "orange"}}>Pending</span>},
                  {value: "SUCCESS", label: <span style={{color: "green"}}>Success</span>},
                ]}
                placeholder="Select a status"
                onChange={(value) => SetStatusEmail(value)}
            />
          </div>

          <div>
            <Select
                placeholder="Select Position"
                style={{width: 170}}
                value={candidatePositionId || undefined}
                onChange={(id) => {
                  SetcandidatePositionId(id);
                }}
            >
              <Select.Option value="" disabled key="placeholder">Select Position</Select.Option>
              <Select.Option value="" key="all-position">All Position</Select.Option>
              {candidatePositions.map((status) => (
                  <Select.Option key={status.id || `fallback-${status.name}`} value={status.id}>
                    {status.name}
                  </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <RangePicker
                onChange={(dates) => {
                  setDateRange(dates);
                }}
                value={dateRange}
                format="YYYY-MM-DD"
                allowClear
            />
          </div>

        </div>

        {loading ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
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
                  pageSize: pageSize,
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
          selectedRowKeys={selectedRowKeys}
        />
      )}
    </div>
  );
};

export default TableDashBoard;
