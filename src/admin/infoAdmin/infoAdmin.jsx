import React, { useEffect, useState } from 'react';
import { Space, Table, Tag } from 'antd';
import axios from 'axios';
import Cookies from "js-cookie";
import dayjs from "dayjs";

const columns = [
    {
        title: 'Name',
        dataIndex: 'userName',
        key: 'userName',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        render: (role) => {
            let color = role === 'ROLE_CANDIDATE' ? 'volcano' : 'green';
            return <Tag color={color}>{role}</Tag>;
        },
    }, 
    {
        title: 'Create At',
        dataIndex: 'create_at',
        key: 'create_at',
        render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'), 
    },
    {
        title: 'Update At',
        dataIndex: 'update_at',
        key: 'update_at',
        render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'), 
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

const InfoAdmin = () => {
    const [data, SetData] = useState([]);
    const token = Cookies.get("token");
    if (!token) {
        console.error("No token found");
        return;
    }


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://46.202.178.139:5050/api/v1/users/get/all?pageNumber=1&pageSize=10`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                console.log(response.data);
                SetData(response.data)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    console.log(data.data)


    return (
        <Table columns={columns} dataSource={data.data} />
    )
}

    ;
export default InfoAdmin;