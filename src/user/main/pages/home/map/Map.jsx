import { Tooltip } from "antd";
import React from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import "./map.scss";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const MapWithPoints = () => {
    const markers = [
        { coordinates: [-122.4194, 37.7749], name: "San Francisco" },
        { coordinates: [-74.006, 40.7128], name: "New York" },
        { coordinates: [-80.1918, 25.7617], name: "Miami" },
        { coordinates: [-118.2437, 34.0522], name: "Los Angeles" },
        { coordinates: [-97.7431, 30.2672], name: "Austin" },
        { coordinates: [-90.0489, 35.1495], name: "Memphis" },
        { coordinates: [-104.9903, 39.7392], name: "Denver" },
        { coordinates: [-87.6298, 41.8781], name: "Chicago" },
        { coordinates: [-76.6122, 39.2904], name: "Baltimore" },
    ];

    const infos = [
        { id: 1, number: "22", content1: "Years ", content2: "Experience" },
        { id: 2, number: "65", content1: "Offices ", content2: "Worldwide" },
        { id: 3, number: "15k", content1: "Workers ", content2: "Employed" },
    ];

    return (
        <div className="map-container">
            <div className="info-map-container flex-row">
                <div className="content-map-container flex-col">
                    <div className="title-map">
                        <p>We Spread</p>
                        <span>Around the World</span>
                    </div>
                    <div className="content-map">
                        <p>
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </div>
                    <div className="info-map flex-row">
                        {infos.map((info) => (
                            <div className="info flex-col" key={info.id}>
                                <div className="number-map">
                                    <p>{info.number}</p>
                                </div>
                                <div className="content-map">
                                    <p>{info.content1}</p>
                                    <span>{info.content2}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="main-map">
                    <ComposableMap projection="geoAlbersUsa">
                        <Geographies geography={geoUrl}>
                            {({ geographies }) =>
                                geographies.map((geo) => (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill="#DDD"
                                        stroke="#FFF"
                                    />
                                ))
                            }
                        </Geographies>
                        {markers.map(({ coordinates, name }, index) => (
                            <Tooltip key={index} title={name}>
                                <Marker coordinates={coordinates}>
                                    <circle r={8} fill="rgb(222, 69, 84)" cursor="pointer" />
                                </Marker>
                            </Tooltip>
                        ))}
                    </ComposableMap>
                </div>
            </div>
        </div>
    );
};

export default MapWithPoints;
