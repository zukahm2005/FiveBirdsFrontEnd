import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get("token");
const apiUrl = "http://localhost:5005/api/v1/";


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
const getCandidateTest = async () => {
    const response = await axios.get("http://localhost:5005/api/v1/candidate/test/get",
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
    );
    return response;
}

const getAllCandidate = async (pageNumber, pageSize, statusEmail, CandidatePositionId, startDate , endDate) => {
    const response = await fetch(apiUrl + `candidates/get/all?pageNumber=${pageNumber}&pageSize=${pageSize}&statusEmail=${statusEmail}&CandidatePositionId=${CandidatePositionId}&startDate=${startDate}&endDate=${endDate}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
    );
    return response.json();
}
const getExam = async () => {
    const dataExam = await fetch("http://localhost:5005/api/v1/exams/get", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return await dataExam.json();
}
const getExamByName = async (name) => {
    const dataExam = await fetch(`http://localhost:5005/api/v1/exams/get-position/${name}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return await dataExam.json();
}

const sendEmailCandidate = async (examTitle, comment, selectedTime, selectedDate, itemId) => {
    return await axios.post(`http://localhost:5005/api/v1/candidates/send/email/${itemId}`, { examTitle, comment, selectedTime, selectedDate },
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
};

const addUserExam = async (userId, examId, examTime, examDate) => {
    return await axios.post(`http://localhost:5005/api/v1/user-exam/add`, { userId, examId, examTime, examDate },
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });
}

const getCandidateById = async (candidateId) => {
    return await axios.get(`http://localhost:5005/api/v1/candidates/${candidateId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
}
const getCandidatePositions = async () => {
    return await axios.get(`http://localhost:5005/api/v1/candidate-positions`, {
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
    getCandidatePositions,
    getCandidateTest,
    getExamByName
}