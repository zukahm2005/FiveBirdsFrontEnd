import React, { useEffect } from 'react';
import { Alert } from 'antd';

const GlobalAlert = ({ setVisible, visible, type, description }) => {

    let message = 'Informational Notes';

    if (type === "success") {
        message = "Success Tips";
    } else if (type === "error") {
        message = "Error";
    } else if (type === "warning") {
        message = "Warning";
    }

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                setVisible(false);  
            }, 3000);
            return () => clearTimeout(timer);  
        }
    }, [visible, type, description]); 

    return (
        visible && type && description && (
            <Alert
                message={message}
                type={type}
                description={description}
                showIcon
                style={{
                    width: '20%',
                    marginBottom: 16,
                    position: 'fixed',
                    top: 25,
                    right: 25,
                    zIndex: 9999,
                }}
            />
        )
    );
};

export default GlobalAlert;
