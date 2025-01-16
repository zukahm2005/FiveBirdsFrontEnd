import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import Cookies from "js-cookie";
import "./ImportFile.scss"

const ImportFile = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadKey, setUploadKey] = useState(Date.now());

    const handleFileSelect = ({ file }) => {
        if (file) {
            setSelectedFile(file);
            message.success(`File "${file.name}" selected. Ready to upload.`);
        } else {
            message.error("No file selected.");
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            message.error("No file selected for upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile.originFileObj || selectedFile);

        setLoading(true);
        try {
            const token = Cookies.get("token");
            const response = await axios.post(
                "http://localhost:5005/api/Import/excel",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            message.success("File uploaded successfully!");
            setSelectedFile(null);
            setUploadKey(Date.now());
            console.log("Upload Response:", response.data);
        } catch (error) {
            console.error("Upload failed:", error);
            message.error("Failed to upload file.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="import-file-container">
            <Upload
                key={uploadKey}
                beforeUpload={() => false}
                onChange={handleFileSelect}
                onRemove={() => {
                    setSelectedFile(null);
                    message.info("File removed.");
                }}
                maxCount={1}
                showUploadList={{ showRemoveIcon: true }}
            >
                <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
            <Button
                type="primary"
                onClick={handleFileUpload}
                disabled={!selectedFile}
                loading={loading}
            >
                Upload
            </Button>
        </div>
    );
};

export default ImportFile;
