import React, { useState, useEffect } from "react";
import { Table, Button, Space, Popconfirm, message } from "antd";
import axios from "axios";
import { Link } from 'react-router-dom';
import {GoPlus} from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { GrView } from "react-icons/gr";
import Cookies from "js-cookie";
import "./listexam.scss";

const LishExam = () => {
  const [allData, setAllData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
          "http://46.202.178.139:5050/api/v1/exams/get/all?pageNumber=0&pageSize=1000",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      const { data } = response.data;

      setAllData(data || []);
      setPagination((prev) => ({
        ...prev,
        total: data.length,
      }));

      setData(data.slice(0, pagination.pageSize));
    } catch (error) {
      message.error("Failed to fetch data!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;

    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    setData(allData.slice(startIndex, endIndex));
    setPagination({
      ...pagination,
      current,
      pageSize,
    });
  };

  const navigate = useNavigate();

  const handleViewDetail = (record) => {
    navigate(`/admin/detail-exam/${record.id}`);
  };

  const handleDelete = async (id) => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`http://46.202.178.139:5050/api/v1/exams/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success("Exam deleted successfully!");
      fetchData();
    } catch (error) {
      message.error("Failed to delete exam!");
      console.error(error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Position",
      key: "candidatePosition",
      render: (record) => record.candidatePosition?.name || "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
          <Space size="middle">
            <Button
                type="link"
                onClick={() => handleViewDetail(record)}
                icon={<GrView />}
                title="View Details"
            />
            <Popconfirm
                title="Are you sure you want to delete this exam?"
                onConfirm={() => handleDelete(record.id)}
                okText="Yes"
                cancelText="No"
            >
              <Button
                  type="link"
                  danger
                  icon={<MdDelete />}
                  title="Delete"
              />
            </Popconfirm>
          </Space>
      ),
    },
  ];

  return (
      <div className="list-exam">
                 <div className="header">
                <h1 className="header-title">Exam List</h1>
                <Link to="/admin/exam/create" className="create-exam-link">
                    <button className="btn btn-primary create-exam-btn">
                        <span className="icon">
                            <GoPlus />
                        </span>
                        <span>Create Exam</span>
                    </button>
                </Link>
            </div>
        <div className="exam-container">
          <Table
              columns={columns}
              dataSource={data}
              rowKey="id"
              loading={loading}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
              }}
              scroll={{
                y: 530,
              }}
              onChange={handleTableChange}
          />
        </div>
      </div>
  );
};

export default LishExam;
