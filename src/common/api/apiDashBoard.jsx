import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get("token");


const getCandidate = async () => {
    const response = await fetch("http://46.202.178.139:5050/api/v1/candidates",
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
    );
    return await response.json();
}
const getAllCandidate = async (pageNumber, pageSize) => {
    const response = await fetch(`http://46.202.178.139:5050/api/v1/candidates?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }
    );
    return await response.json();
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
    return await axios.post(`http://46.202.178.139:5050/api/v1/candidates/send/email/${itemId}`, { examTitle, comment,  selectedTime, selectedDate },
    {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
};

export {
    getCandidate,
    getAllCandidate,
    getExam,
    sendEmailCandidate
}