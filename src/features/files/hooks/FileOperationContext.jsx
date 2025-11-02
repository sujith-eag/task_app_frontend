import React, { createContext, useState, useContext, useMemo } from 'react';

const FileOperationContext = createContext(null);

export const FileOperationProvider = ({ children }) => {
    // This state will hold the status, e.g., { 'fileId-123': 'deleting' }
    const [operationStatus, setOperationStatus] = useState({});

    const startOperation = (fileId, status) => {
        setOperationStatus(prev => ({ ...prev, [fileId]: status }));
    };

    const stopOperation = (fileId) => {
        setOperationStatus(prev => {
            const newState = { ...prev };
            delete newState[fileId];
            return newState;
        });
    };

    const value = useMemo(() => ({
        operationStatus,
        startOperation,
        stopOperation,
    }), [operationStatus]);

    return (
        <FileOperationContext.Provider value={value}>
            {children}
        </FileOperationContext.Provider>
    );
};

export const useFileOperations = () => {
    const context = useContext(FileOperationContext);
    if (!context) {
        throw new Error('useFileOperations must be used within a FileOperationProvider');
    }
    return context;
};

export default FileOperationContext;
