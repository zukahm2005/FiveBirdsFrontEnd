import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Upload } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiLogoFacebook } from "react-icons/bi";
import { BsFillClockFill } from "react-icons/bs";
import { FaInstagram, FaPhone } from "react-icons/fa";
import { IoLogoTwitter } from "react-icons/io";
import { LiaLinkedinIn } from "react-icons/lia";
import { MdEmail } from "react-icons/md";
import { RiMapPinFill } from "react-icons/ri";
import GlobalAlert from "../../common/globalAlert/GlobalAlert";
import Logo from "../components/logo/Logo";
import "./footer.scss";

const { Option } = Select;

export default function Footer() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState(null);
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState([]);

  const handleFileChange = ({ fileList: newFileList }) => {
    const isSupportedFile =
      newFileList[0]?.type === "application/pdf" ||
      newFileList[0]?.type === "image/jpeg" ||
      newFileList[0]?.type === "image/png";

    if (!isSupportedFile) {
      setType("error");
      setDescription("Only PDF, JPG, or PNG files are allowed!");
      setVisible(true);
      return;
    }
    setFileList(newFileList);
  };

  const handleFinish = async (values) => {
    setLoading(true);

    const { day, month, year } = values.dateOfBirth || {};

    if (!day || !month || !year) {
      setType("error");
      setDescription("Please select a valid date of birth!");
      setLoading(false);
      setVisible(true);
      return;
    }

    const formattedDate = `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;

    const formData = new FormData();
    formData.append("FullName", values.fullName);
    formData.append("Email", values.email);
    formData.append("Phone", values.phoneNumber);
    formData.append("Birthday", formattedDate);
    formData.append("Education", values.education);
    formData.append("Experience", values.experience);
    formData.append("CandidatePositionId", values.applyPositions);
    if (fileList.length > 0) {
      formData.append("CvFile", fileList[0].originFileObj);
    }
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    try {
      const response = await axios.post(
        "http://46.202.178.139:5050/api/v1/candidates",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      setType("success");
      setDescription("Submit CV success");
      setVisible(true);
      form.resetFields();
      setFileList([]);
      setLoading(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Submit CV error";
      setType("error");
      setDescription(errorMessage);
      setLoading(false);
      setVisible(true);
    }
  };


  const generateRange = (start, end) => {
    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i.toString().padStart(2, "0"));
    }
    return range;
  };

  const days = generateRange(1, 31);
  const months = generateRange(1, 12);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 101 }, (_, i) => (currentYear - i).toString());

  const iconsF1 = [
    { id: 1, icon: <BiLogoFacebook /> },
    { id: 2, icon: <IoLogoTwitter /> },
    { id: 3, icon: <LiaLinkedinIn /> },
    { id: 4, icon: <FaInstagram /> },
  ];

  const iconsF2 = [
    { id: 1, icon: <FaPhone />, content: "800 123 4567" },
    { id: 2, icon: <MdEmail />, content: "nafta@example.com" },
    {
      id: 3,
      icon: <RiMapPinFill />,
      content: "2469 Hoffman AvenueNew York, NY 10016",
    },
    {
      id: 4,
      icon: <BsFillClockFill />,
      content: "Mo-Fri: 8am - 6pm | Sat: 10am - 4pm | Sun: off",
    },
  ];
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          "http://46.202.178.139:5050/api/v1/candidate-positions"
        );
        setPositions(response.data.data || []);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="footer-container">
      <GlobalAlert
        setVisible={setVisible}
        visible={visible}
        type={type}
        description={description}
      />

      <div className="content-footer flex-row">
        <div className="left-content flex-col">
          <div className="logo-f">
            <Logo />
          </div>
          <div className="content-f">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua enim
              minim.
            </p>
          </div>
          <div className="icon1-f">
            {iconsF1.map((iconF1) => (
              <div key={iconF1.id} className="icon">
                <p>{iconF1.icon} </p>
              </div>
            ))}
          </div>
        </div>
        <div className="form-container">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            className="info-form"
          >
            <div className="title-form">
              <p>Write Us</p>
            </div>
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true, message: "Please input your full name!" }]}
            >
              <Input placeholder="Enter your full name..." />
            </Form.Item>

            <Form.Item
              label="Date of Birth"
              required={true}            >
              <div className="flex-row" style={{ gap: "5px" }}>
                <Form.Item
                  name={["dateOfBirth", "day"]}
                  rules={[{ required: true, message: "Please select a day!" }]}
                  noStyle
                >
                  <Select placeholder="Day" style={{ width: 80 }}>
                    {days.map((day) => (
                      <Option key={day} value={day}>
                        {day}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name={["dateOfBirth", "month"]}
                  rules={[{ required: true, message: "Please select a month!" }]}
                  noStyle
                >
                  <Select placeholder="Month" style={{ width: 85 }}>
                    {months.map((month) => (
                      <Option key={month} value={month}>
                        {month}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name={["dateOfBirth", "year"]}
                  rules={[{ required: true, message: "Please select a year!" }]}
                  noStyle
                >
                  <Select placeholder="Year" style={{ width: 100 }}>
                    {years.map((year) => (
                      <Option key={year} value={year}>
                        {year}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true, message: "Please input your phone number!" }]}
            >
              <Input placeholder="Enter your phone number..." />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "The input is not valid E-mail!" },
              ]}
            >
              <Input placeholder="Enter your email..." />
            </Form.Item>

            <Form.Item
              name="education"
              label="Education"
              rules={[{ required: true, message: "Please input your education!" }]}
            >
              <Input placeholder="Enter your education..." />
            </Form.Item>

            <Form.Item
              name="experience"
              label="Experience"
              rules={[{ required: true, message: "Please input your experience!" }]}
            >
              <Input placeholder="Enter your experience..." />
            </Form.Item>

            <Form.Item
              name="applyPositions"
              label="Applying for a job"
              rules={[{ required: true, message: "Please select your Apply Location!" }]}
              style={{ textAlign: "left" }}
            >
              <Select
                placeholder="Select your Apply Location..."
                style={{ height: "2.5rem", width: "15rem" }}
              >
                {positions.map((position) => (
                  <Option key={position.id} value={position.id}>
                    {position.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="cv"
              label="CV File"
              className="upload-file-input"
              rules={[{ required: true, message: "Please upload your CV!" }]}
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleFileChange}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>
                  <p>Upload CV</p>
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="btn-send"
                loading={loading}
              >
                <p>Send</p>
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div className="right-content">
          {iconsF2.map((iconF2) => (
            <div key={iconF2.id}>
              <div className="icon-right">
                <div className="icon-footer">
                  <p>{iconF2.icon}</p>
                </div>
                <div className="content-footer1">
                  <p>{iconF2.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
