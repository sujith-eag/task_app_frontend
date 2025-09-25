import React, { useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import SubjectModal from './SubjectModal.jsx';
import SubjectList from './SubjectList.jsx';

const SubjectManager = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState(null);

    const handleOpenModal = (subject = null) => {
        setEditingSubject(subject);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSubject(null);
    };
    
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Manage Academic Subjects</Typography>
                <Button variant="contained" onClick={() => handleOpenModal()}>
                    Add New Subject
                </Button>
            </Box>
            
            <SubjectList onEdit={handleOpenModal} /> 
                       
            <SubjectModal open={isModalOpen} handleClose={handleCloseModal} subject={editingSubject} />
        </Box>
    );
};

export default SubjectManager;

// In a full implementation, this component would:
// 1. Fetch all subjects and display them in a DataGrid.
// 2. Have a "Create Subject" button that opens a modal form.
// 3. The form would include fields for name, code, semester, and a multi-select for teachers.
// 4. Dispatch actions from the adminSlice to create, update, or delete subjects.

