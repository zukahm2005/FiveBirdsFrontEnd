import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import axios from 'axios';
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { GrView } from "react-icons/gr";
import Cookies from 'js-cookie';
import GlobalAlert from "../../../common/globalAlert/GlobalAlert";
import './listexam.scss';

const LishExam = () => {
  const [allData, setAllData] = useState([]); // Lưu toàn bộ dữ liệu
  const [data, setData] = useState([]); // Dữ liệu hiển thị theo trang
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1, // Trang hiện tại
    pageSize: 10, // Số phần tử mỗi trang
    total: 0, // Tổng số phần tử
  });

  // State cho GlobalAlert
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertDescription, setAlertDescription] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');

      // Gọi API (toàn bộ dữ liệu, không phân trang)
      const response = await axios.get(
        'http://46.202.178.139:5050/api/v1/exams/get/all?pageNumber=0&pageSize=1000',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { data } = response.data;

      // Cập nhật toàn bộ dữ liệu và phân trang
      setAllData(data || []);
      setPagination((prev) => ({
        ...prev,
        total: data.length, // Tổng số phần tử
      }));

      // Lấy dữ liệu trang đầu tiên
      setData(data.slice(0, pagination.pageSize));
    } catch (error) {
      setAlertType('error');
      setAlertDescription('Không thể tải dữ liệu!');
      setAlertVisible(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Xử lý chuyển trang
  const handleTableChange = (pagination) => {
    const { current, pageSize } = pagination;

    // Lấy dữ liệu trang hiện tại
    const startIndex = (current - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    setData(allData.slice(startIndex, endIndex)); // Lấy dữ liệu theo trang
    setPagination({
      ...pagination,
      current,
      pageSize,
    });
  };

  const navigate = useNavigate(); // Hook để điều hướng

  const handleViewDetail = (record) => {
    // Điều hướng sang trang chi tiết với ID bài kiểm tra
    navigate(`/admin/detail-exam/${record.id}`); // Đường dẫn đúng
  };

  const handleDelete = async (id) => {
    try {
      const token = Cookies.get('token');
      await axios.delete(`http://46.202.178.139:5050/api/v1/exams/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAlertType('success');
      setAlertDescription('Xóa thành công!');
      setAlertVisible(true);

      fetchData(); // Tải lại dữ liệu sau khi xóa
    } catch (error) {
      setAlertType('error');
      setAlertDescription('Xóa không thành công!');
      setAlertVisible(true);
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/* Icon View */}
          <Button
            type="link"
            onClick={() => handleViewDetail(record)}
            icon={<GrView />}
          />
          {/* Icon Delete */}
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bài kiểm tra này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="link"
              danger
              icon={<MdDelete />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="list-exam">
      <GlobalAlert
        setVisible={setAlertVisible}
        visible={alertVisible}
        type={alertType}
        description={alertDescription}
      />

      <h1>Exam List</h1>
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
            y: 530, // Chiều cao cố định của nội dung bảng
          }}
          onChange={handleTableChange}
        />
      </div>
    </div>
  );
};

export default LishExam;
