import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Sử dụng nếu dùng React Router

const AboutUsEditor = ({ selectedId }) => {
  const { id: paramId } = useParams(); // Lấy ID từ URL nếu có
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    description: "",
    image: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const idToUse = selectedId || paramId;

  useEffect(() => {
    if (!idToUse) {
      setError("Invalid selected ID.");
      setIsLoading(false);
      return;
    }

    const fetchAboutUs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5005/api/v1/aboutus/${idToUse}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setFormData({
          name: data.name || "",
          position: data.position || "",
          description: data.description || "",
          image: null,
        });
      } catch (error) {
        console.error("Error fetching AboutUs data:", error);
        setError("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutUs();
  }, [idToUse]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.name);
    form.append("position", formData.position);
    form.append("description", formData.description);
    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      const response = await fetch(`http://localhost:5005/api/v1/aboutus/update/${idToUse}`, {
        method: "PUT",
        body: form,
      });

      if (response.ok) {
        alert("About Us updated successfully!");
      } else {
        alert("Failed to update About Us.");
      }
    } catch (error) {
      console.error("Error updating About Us:", error);
      alert("An error occurred.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit About Us</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Position:
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="5"
            required
          />
        </label>
        <label>
          Image:
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#1890ff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AboutUsEditor;
