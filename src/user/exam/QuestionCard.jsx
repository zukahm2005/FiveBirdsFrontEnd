import React from 'react';

const QuestionCard = ({ question, onSelectAnswer, selectedAnswer }) => {
  return (
    <div>
      <h3>{question.question}</h3>
      {question.answers.map((answer, index) => (
        <button
          key={index}
          style={{
            display: 'block',
            margin: '10px 0',
            padding: '10px',
            background: selectedAnswer === index ? '#f0ad4e' : '#f7f7f7',
          }}
          onClick={() => onSelectAnswer(index)}
        >
          {answer}
        </button>
      ))}
    </div>
  );
};

export default QuestionCard;
