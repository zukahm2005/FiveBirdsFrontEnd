import React, { useState, useEffect } from "react";
import { Tabs, message } from "antd";
import ListPositions from "./components/ListPositions";
import CreatePosition from "./components/CreatePosition";
import { apiService } from "./service/api";

const { TabPane } = Tabs;

const PositionManagement = () => {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPositions = async () => {
        setLoading(true);
        try {
            const response = await apiService.getAllPosition();
            setPositions(response.data);
            setLoading(false);
        } catch (error) {
            message.error("Failed to fetch positions.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    return (
        <div>
            <h1>Position Management</h1>
            <Tabs defaultActiveKey="1">
                <TabPane tab="All Positions" key="1">
                    <ListPositions
                        positions={positions}
                        fetchPositions={fetchPositions}
                        loading={loading}
                    />
                </TabPane>
                <TabPane tab="Create Position" key="2">
                    <CreatePosition fetchPositions={fetchPositions} />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default PositionManagement;
