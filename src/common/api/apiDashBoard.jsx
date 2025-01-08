import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get("token");
const apiUrl = "http://46.202.178.139:5050/api/v1/";


const getCandidate = async () => {
    const response = await axios.get(apiUrl + "candidates",
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
    );
    return response;
}
const getAllCandidate = async (pageNumber, pageSize, statusEmail, CandidatePositionId) => {
    const response = await axios.get(`http://46.202.178.139:5050/api/v1/candidates/get/all?pageNumber=${pageNumber}&pageSize=${pageSize}&statusEmail=${statusEmail}&CandidatePositionId=${CandidatePositionId}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
    );
    return response;
}
const getExam = async () => {
    const dataExam = await fetch("http://46.202.178.139:5050/api/v1/exams/get", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return await dataExam.json();

}

const sendEmailCandidate = async (examTitle, comment, selectedTime, selectedDate, itemId) => {
    return await axios.post(`http://46.202.178.139:5050/api/v1/candidates/send/email/${itemId}`, { examTitle, comment, selectedTime, selectedDate },
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
};

const addUserExam = async (userId, examId, examTime, examDate) => {
    return await axios.post(`http://46.202.178.139:5050/api/v1/user-exam/add`, { userId, examId, examTime, examDate },
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
}

const getCandidateById = async (candidateId) => {
    return await axios.get(`http://46.202.178.139:5050/api/v1/candidates/${candidateId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
}
const getCandidatePositions = async () => {
    return await axios.get(`http://46.202.178.139:5050/api/v1/candidate-positions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
}

export {
    getCandidateById,
    getCandidate,
    getAllCandidate,
    getExam,
    sendEmailCandidate,
    addUserExam,
    getCandidatePositions
}