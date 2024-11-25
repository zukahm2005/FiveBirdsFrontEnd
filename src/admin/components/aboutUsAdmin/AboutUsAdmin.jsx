import React, { useState } from "react";
import AboutUsList from "./AboutUsList";
import AboutUsEditor from "./AboutUsEditor";
import axios from "axios";

const AboutUsAdmin = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleEdit = (item) => {
    setSelectedItem(item);
  };

  const handleSave = async (description) => {
    if (selectedItem) {
      try {
        const response = await axios.put(
          `http://localhost:5005/api/v1/aboutus/update/${selectedItem.id}`,
          { ...selectedItem, description }
        );
        alert("Successfully updated!");
        setSelectedItem(null); // Reset selected item
      } catch (error) {
        console.error("Error updating About Us entry:", error);
        alert("Failed to update!");
      }
    }
  };

  return (
    <div>
      {selectedItem ? (
        <AboutUsEditor selectedItem={selectedItem} onSave={handleSave} />
      ) : (
        <AboutUsList onEdit={handleEdit} />
      )}
    </div>
  );
};

export default AboutUsAdmin;
