// ListManagerCandidate.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './ListManagerCandidate.scss';
import Cookies from 'js-cookie';

export default function ListManagerCandidate() {
  const [candidates, setCandidates] = useState([]);
  const token = Cookies.get("token");


  useEffect(() => {
    // Fetch the list of candidates
    axios
      .get('http://46.202.178.139:5050/api/v1/candidates',{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => {
        setCandidates(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching candidates:', error);
      });
  }, []);


  return (
    <div className="list-manager-candidate">
      <h1>Candidate List</h1>
      <table className="candidate-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Experience</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {candidates.length > 0 ? (
            candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>{candidate.id}</td>
                <td>{candidate.fullName}</td>
                <td>{candidate.email}</td>
                <td>{candidate.phone}</td>
                <td>{candidate.experience}</td>
                <td>
                  <button
                    className="details-button"
                    onClick={() => alert(`Viewing details for ${candidate.fullName}`)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No candidates available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
