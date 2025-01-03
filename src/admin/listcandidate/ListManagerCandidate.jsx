// ListManagerCandidate.jsx
import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Table } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import './ListManagerCandidate.scss';

export default function ListManagerCandidate() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const token = Cookies.get("token");

  useEffect(() => {
    axios
      .get('http://46.202.178.139:5050/api/v1/candidates', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        setCandidates(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching candidates:', error);
      });
  }, []);

  const showModal = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setSelectedCandidate(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedCandidate(null);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
    },
    {
      title: 'Detail',
      key: 'detail',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => showModal(record)}
        >
        </Button>
      ),
    },
  ];

  return (
    <div className="list-manager-candidate">
      <h1>Candidate List</h1>
      <Table
        dataSource={candidates}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Candidate Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedCandidate && (
          <div>
            <p><strong>ID:</strong> {selectedCandidate.id}</p>
            <p><strong>Full Name:</strong> {selectedCandidate.fullName}</p>
            <p><strong>Email:</strong> {selectedCandidate.email}</p>
            <p><strong>Phone:</strong> {selectedCandidate.phone}</p>
            <p><strong>Experience:</strong> {selectedCandidate.experience}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
