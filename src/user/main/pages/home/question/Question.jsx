import React, { useState } from "react";
import { motion } from "framer-motion";
import "./faq.scss";
import { IoIosArrowForward } from "react-icons/io";

const FAQ = () => {
    const questions = [
        {
            id: 1,
            title: "Get to know us",
            content:
                "Our team has been helping clients throughout the country for 10 years lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
        },
        { id: 2, title: "Get Informed", content: "Information about services and policies." },
        { id: 3, title: "Get Help", content: "Find help for any of your concerns." },
        { id: 4, title: "Contact Us", content: "Reach out to us anytime for assistance." },
        { id: 5, title: "Other Questions", content: "Answers to frequently asked questions." },
    ];

    const icons = [
        { id: 1, icon: "https://html.modernwebtemplates.com/nafta/images/partners/01.png" },
        { id: 2, icon: "https://html.modernwebtemplates.com/nafta/images/partners/02.png" },
        { id: 3, icon: "https://html.modernwebtemplates.com/nafta/images/partners/03.png" },
        { id: 4, icon: "https://html.modernwebtemplates.com/nafta/images/partners/04.png" },
        { id: 5, icon: "https://html.modernwebtemplates.com/nafta/images/partners/05.png" },
        { id: 6, icon: "https://html.modernwebtemplates.com/nafta/images/partners/06.png" },
        { id: 7, icon: "https://html.modernwebtemplates.com/nafta/images/partners/07.png" },
        { id: 8, icon: "https://html.modernwebtemplates.com/nafta/images/partners/08.png" },
        { id: 9, icon: "https://html.modernwebtemplates.com/nafta/images/partners/09.png" },
    ]
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="faq-container ">
            <div className="faq-content flex-row">
                <div className="left-faq flex-col">
                    <div className="title-faq">
                        <p>FAQ & Information</p>
                    </div>
                    <div className="faq-list flex-col">
                        {questions.map((q) => (
                            <div
                                key={q.id}
                                className="faq-item"
                                onClick={() => toggleExpand(q.id)}
                            >
                                <div className="faq-title flex-row">
                                    <p className="title">{q.title}</p>
                                    <motion.span
                                        initial={{ rotate: 0 }}
                                        animate={{
                                            rotate: expandedId === q.id ? 90 : 0,
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <IoIosArrowForward className="icon" />
                                    </motion.span>
                                </div>
                                {expandedId === q.id && (

                                    <p className="content">{q.content}</p>


                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="right-faq">
                    <div className="icon-container">
                        {icons.map((icon) => (
                            <img key={icon.id} src={icon.icon} alt={`Icon ${icon.id}`} />
                        ))}
                    </div>
                </div>
            </div>


        </div>
    );
};

export default FAQ;
