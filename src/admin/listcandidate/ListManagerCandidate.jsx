// ListManagerCandidate.jsx
import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Spin, Table } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import './ListManagerCandidate.scss';

export default function ListManagerCandidate() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
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
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const showModal = (candidateId) => {
    setLoading(true);
    axios
      .get(`http://46.202.178.139:5050/api/v1/candidates/${candidateId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        setSelectedCandidate(response.data.data);
        setIsModalVisible(true);
      })
      .catch((error) => {
        console.error('Error fetching candidate details:', error);
      })
      .finally(() => {
        setLoading(false);
      });
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
          onClick={() => showModal(record.id)}
        >
        </Button>
      ),
    },

  ];

  return (

    <div className="list-manager-candidate">
      <h1>Candidate List</h1>
      <Spin spinning={loading} tip="Loading...">
        <Table
          dataSource={candidates}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Spin>

      <Modal
        title="Candidate Details"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {loading ? (
          <Spin spinning={loading} tip="Loading details..." />
        ) : (
          selectedCandidate && (
            <div className="candidate-details">
              <div className="candidate-header">
                <div className="candidate-photo">
                  <img
                    src={selectedCandidate.profilePhoto || 'https://t4.ftcdn.net/jpg/03/49/49/79/360_F_349497933_Ly4im8BDmHLaLzgyKg2f2yZOvJjBtlw5.jpg'}
                    alt="Candidate"
                  />
                </div>
                <div className="candidate-info">
                  <h2>{selectedCandidate.fullName}</h2>
                  <p><strong>Status:</strong> {selectedCandidate.status || 'Active'}</p>
                  <div className="action-buttons">
                    <Button type="primary">Interview</Button>
                    <Button type="default">Reject</Button>
                    <Button type="default">Mail</Button>
                  </div>
                </div>
              </div>


              <Table
                bordered
                pagination={false}
                dataSource={[
                  {
                    key: '1',
                    field: 'Full Name',
                    value: selectedCandidate.fullName || 'N/A',
                  },
                  {
                    key: '2',
                    field: 'Email Address',
                    value: selectedCandidate.email || 'N/A',
                  },
                  {
                    key: '3',
                    field: 'Phone Number',
                    value: selectedCandidate.phone || 'N/A',
                  },
                  {
                    key: '4',
                    field: 'Birthday',
                    value: selectedCandidate.birthday || 'N/A',
                  },
                  {
                    key: '5',
                    field: 'Education',
                    value: selectedCandidate.education || 'N/A',
                  },
                  {
                    key: '6',
                    field: 'Total Experience',
                    value: selectedCandidate.experience || 'N/A',
                  },
                  {
                    key: '7',
                    field: 'Apply Position',
                    value: selectedCandidate.candidatePosition.name || 'N/A',
                  },
                  {
                    key: '8',
                    field: 'CV',
                    value: (
                      <a
                        href={selectedCandidate.cvFilePath}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View CV
                      </a>
                    ),
                  },
                  {
                    key: '9',
                    field: 'Username',
                    value: selectedCandidate.user?.userName || 'N/A',
                  },
                  {
                    key: '10',
                    field: 'Password',
                    value: selectedCandidate.user?.password || 'N/A',
                  },
                ]}
                columns={[
                  {
                    title: 'Field',
                    dataIndex: 'field',
                    key: 'field',
                    width: '30%',
                  },
                  {
                    title: 'Value',
                    dataIndex: 'value',
                    key: 'value',
                    width: '70%',
                  },
                ]}
              />
            </div>
          )
        )}
      </Modal>



    </div>
  );
}
