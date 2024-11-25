import React, { useState, useEffect } from "react";
import AboutUsEditor from "./AboutUsEditor";

const AboutUsList = () => {
  const [aboutUsList, setAboutUsList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchAboutUsList = async () => {
      try {
        const response = await fetch("http://localhost:5005/api/v1/aboutus");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setAboutUsList(data);
      } catch (error) {
        console.error("Error fetching AboutUs list:", error);
      }
    };

    fetchAboutUsList();
  }, []);

  return (
    <div>
      <h2>About Us List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {aboutUsList.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.position}</td>
              <td>{item.description}</td>
              <td>
                <button onClick={() => setSelectedId(item.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedId && <AboutUsEditor selectedId={selectedId} />}
    </div>
  );
};

export default AboutUsList;
