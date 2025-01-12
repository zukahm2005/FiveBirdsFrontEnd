// ListManagerCandidate.jsx
import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, Spin, Table, DatePicker, TimePicker } from 'antd';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import './ListManagerCandidate.scss';
import GlobalAlert from '../../common/globalAlert/GlobalAlert';

export default function ListManagerCandidate() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(false);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [loadingg, setLoadingg] = useState(false);
  const [alertType, setAlertType] = useState(null);
  const [alertDescription, setAlertDescription] = useState(null);
  const [visible, setVisible] = useState(false);
  dayjs.extend(customParseFormat);


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
        console.log(response.data.data)
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
  const renderExamResult = (isPast) => {
    if (isPast === false) {
      return <span style={{ color: 'red' }}>Failed</span>;
    } else if (isPast === true) {
      return <span style={{ color: 'green' }}>Pass</span>;
    } else {
      return <span style={{ color: 'orange' }}>In progress</span>;
    }
  };

  const onChanges = (date, dateString) => {
    setDate(dateString);
  };

  const onChange = (time, timeString) => {
    setTime(timeString);
  };

  const handleInterviewClick = () => {
    setShowInterviewForm(!showInterviewForm);
  };

  const handleSendEmail = async (id, date, time) => {   
    try {
      const response = await axios.post(`http://46.202.178.139:5050/api/v1/candidates/send/email/interview/${id}`,{date, time});
      
      if(response) {
        setAlertDescription("Emails sent successfully.");
        setAlertType("success");
        setVisible(true);
        setLoadingg(false);  
        setDate(null)
        setTime(null)
      } else {
        setAlertDescription("Error sending email.");
        setAlertType("error");
        setVisible(true);
      }
    } catch (error) {
      setAlertDescription("Error sending email.");
      setAlertType("error");
      setVisible(true);
    } finally {
      setLoadingg(false);  
    }
};


  return (
    <div className="list-manager-candidate">
      <GlobalAlert setVisible={setVisible} visible={visible} type={alertType} description={alertDescription} />
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
                  <div className='info'>
                    <h2>{selectedCandidate.fullName}</h2>
                    <p><strong>Status:</strong> {renderExamResult(selectedCandidate.isPast)}</p>
                    <Button type="primary" onClick={handleInterviewClick}>Interview</Button>
                  </div>
                  <div className="action-buttons">
                    {showInterviewForm && (
                      <div className="interview-form">
                        <div>
                          <strong style={{ fontSize: "20px" }}>Interview schedule</strong>
                          <p>Please select a schedule that is still available.</p>
                        </div>
                        <div className='btn-select'>
                          <DatePicker
                            format="YYYY-MM-DD"
                            onChange={onChanges}
                          />
                          <TimePicker onChange={onChange} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
                          <Button
                            type="primary"
                            loading={loadingg}
                            onClick={() => {handleSendEmail(selectedCandidate.id, date, time); setLoadingg(true);}}
                          >
                            Send Email
                          </Button>
                        </div>

                        <div className='btn-send'>

                        </div>
                      </div>
                    )}
                    {/* <Button type="default">Reject</Button>
                    <Button type="default">Mail</Button> */}
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
