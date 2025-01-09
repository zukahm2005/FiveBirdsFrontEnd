import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import axios from 'axios';
import Cookies from "js-cookie";
import dayjs from "dayjs";

const columns = [
    {
        title: 'Name',
        dataIndex: ['user', 'userName'], 
        key: 'userName',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Email',
        dataIndex: ['user', 'email'],  
        key: 'email',
    },
    {
        title: 'Exam Title',
        dataIndex: ['exam', 'title'],  
        key: 'examTitle',
    },
    {
        title: 'Test Status',
        dataIndex: 'testStatus',
        key: 'testStatus',
        render: (status) => {
            let color = status === 'PENDING' ? 'volcano' : 'green'; 
            return <Tag color={color}>{status}</Tag>;
        },
    },
    {
        title: 'Exam Time',
        dataIndex: 'examTime',
        key: 'examTime',
    },
    {
        title: 'Exam Date',
        dataIndex: 'examDate',
        key: 'examDate',
        render: (date) => dayjs(date).format('YYYY-MM-DD'), 
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Delete</a>
            </Space>
        ),
    },
];

const UserExam = () => {
    const [data, SetData] = useState([]);
    const token = Cookies.get("token");

    if (!token) {
        console.error("No token found");
        return null;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://46.202.178.139:5050/api/v1/user-exam/get/all?pageNumber=1&pageSize=10`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                console.log(response.data);
                SetData(response.data.data);  
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [token]);  

    return (
        <Table columns={columns} dataSource={data} rowKey="id" />  
    );
};

export default UserExam;
