import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload } from "antd";
import React, { useState } from "react";
import axios from "axios";
import Logo from "../components/logo/Logo";
import GlobalAlert from "../../common/globalAlert/GlobalAlert";
import { BsFillClockFill } from "react-icons/bs";
import { BiLogoFacebook } from "react-icons/bi";
import { FaInstagram, FaPhone } from "react-icons/fa";
import { IoLogoTwitter } from "react-icons/io";
import { LiaLinkedinIn } from "react-icons/lia";
import { MdEmail } from "react-icons/md";
import { RiMapPinFill } from "react-icons/ri";
import "./footer.scss";


export default function Footer() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState(null)
  const [description, setDescription] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleFinish = async (values) => {
    setLoading(true)
    const formData = new FormData();
    formData.append("fullname", values.fullName);
    formData.append("email", values.email);
    formData.append("phone", values.phoneNumber);
    formData.append("education", values.education);
    formData.append("experience", values.experience);

    if (fileList.length > 0) {
      formData.append("CvFile", fileList[0].originFileObj);
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
      setType("success"),
        setDescription("submit cv success")
      setVisible(true)
      form.resetFields();
      setFileList([]);
      setLoading(false)
    } catch (error) {
      setType("error")
      setDescription("submit cv error")
      setLoading(false)
      setVisible(true)
    }
  };

  const iconsF1 = [
    { id: 1, icon: <BiLogoFacebook /> },
    { id: 2, icon: <IoLogoTwitter /> },
    { id: 3, icon: <LiaLinkedinIn /> },
    { id: 4, icon: <FaInstagram /> },
  ];

  const iconsF2 = [
    {
      id: 1, icon: <FaPhone />
      , content: " 800 123 4567"
    },
    { id: 2, icon: <MdEmail />, content: "nafta@example.com" },
    {
      id: 3, icon: <RiMapPinFill />, content: "2469 Hoffman AvenueNew York, NY 10016"
    },
    { id: 4, icon: <BsFillClockFill />, content: "Mo-Fri: 8am - 6pm | Sat: 10am - 4pm | Sun: of" },
  ];

  return (
    <div className="footer-container">
      <GlobalAlert setVisible={setVisible} visible={visible} type={type} description={description} />

      <div className="content-footer flex-row">
        <div className="left-content flex-col">
          <div className="logo-f"><Logo /></div>
          <div className="content-f">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim minim.
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
          <Form form={form} layout="vertical" onFinish={handleFinish} className="info-form">
            <div className="title-form">
              <p>Write Us</p>
            </div>
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true, message: "Please input your full name!" }]}
            >
              <Input placeholder="Full Name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please input your email!" }, { type: "email", message: "The input is not valid E-mail!" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true, message: "Please input your phone number!" }]}
            >
              <Input placeholder="Phone Number" />
            </Form.Item>

            <Form.Item
              name="education"
              label="Education"
              rules={[{ required: true, message: "Please input your education!" }]}
            >
              <Input placeholder="Education" />
            </Form.Item>

            <Form.Item
              name="experience"
              label="Experience"
              rules={[{ required: true, message: "Please input your experience!" }]}
            >
              <Input placeholder="Experience" />
            </Form.Item>

            <Form.Item
              name="cv"
              label="CV File"
              rules={[{ required: true, message: "Please upload your CV!" }]}
            >
              <Upload
                beforeUpload={() => false}
                onChange={handleFileChange}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload CV</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="btn-send" loading={loading}>
                Send
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="right-content">
          {iconsF2.map((iconF2) => (
            <div key={iconF2.id} >
              <div className="icon-right">
                <div className="icon-footer"><p>{iconF2.icon}</p> </div>
                <div className="content-footer1"><p>{iconF2.content}</p></div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
