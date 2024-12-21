import React, { useState } from "react";
import "./ourProject.scss"
import { Link } from "react-router-dom";
const OurProject = () => {
    const [mousePositions, setMousePositions] = useState({});
    const [activeTab, setActiveTab] = useState("all");

    const handleMouseMove = (e, index) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePositions((prev) => ({ ...prev, [index]: { x, y } }));
    };

    const handleMouseLeave = (index) => {
        setMousePositions((prev) => ({ ...prev, [index]: { x: 50, y: 50 } }));
    };
    const navRoutes = [
        {
            id: 1,
            key: "all",
            label: "All Projects",
            images: [
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/01.jpg",
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/02.jpg",
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/03.jpg",
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/04.jpg",
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/05.jpg",
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/06.jpg",
            ],
        },
        {
            id: 2,
            key: "gas",
            label: "Gas",
            images: [
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/02.jpg",
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/05.jpg",
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/06.jpg",
            ],
        },
        {
            id: 3,
            key: "oil",
            label: "Oil",
            images: [
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/01.jpg",
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/04.jpg",
            ],
        },
        {
            id: 4,
            key: "industry",
            label: "Industry",
            images: [
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/03.jpg",
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/04.jpg",
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/06.jpg",
            ],
        },
        {
            id: 5,
            key: "eco",
            label: "Eco",
            images: [
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/02.jpg",
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/03.jpg",
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/06.jpg",
            ],
        },
        {
            id: 6,
            key: "factory",
            label: "Factory",
            images: [
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/02.jpg",
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/03.jpg",
                "https://html.modernwebtemplates.com/nafta/images/gallery/full/06.jpg",
            ],
        },
    ];
    const activeImages = navRoutes.find((route) => route.key === activeTab)?.images || [];

    return (
        <div
            className="card-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: "1000px",
            }}
        >

            <div className="content-card-container">
                <div className="content-card flex-col">
                    <div className="title-card">
                        <p>Our Projects</p>
                    </div>
                    <div className="nav-bar-card flex-row">
                        {navRoutes.map((route) => (
                            <button
                                key={route.id}
                                className={`nav-button ${activeTab === route.key ? "active" : ""}`}
                                onClick={() => setActiveTab(route.key)}
                            >
                                <p>{route.label}</p>
                            </button>
                        ))}
                    </div>
                    <div className="content-display">
                        {activeImages.map((image, index) => {
                            const { x = 50, y = 50 } = mousePositions[index] || {};
                            return (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Project ${index + 1}`}
                                    className="gallery-image"
                                    onMouseMove={(e) => handleMouseMove(e, index)}
                                    onMouseLeave={() => handleMouseLeave(index)}
                                    style={{
                                        transform: `rotateX(${(50 - y) / 5}deg) rotateY(${(x - 50) / 5}deg)`,
                                        transition: "transform 0.1s ease-out",
                                    }}

                                />
                            );
                        })}
                    </div>
                </div>

            </div>
            {/* <div
        className="card"
        style={{
          transform: `rotateX(${(mousePosition.y - 50) / 5}deg) rotateY(${(mousePosition.x - 50) / 5}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <div className="card-content">Tempor invidunt ut</div>
      </div> */}
        </div>
    );
};

export default OurProject;
