import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import TeacherAssignmentModal from './TeacherAssignmentModal.jsx';
import TeacherList from './TeacherList.jsx';

const FacultyManager = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null); // ID of teacher being edited
    
    const handleOpenModal = (teacher) => {
        setSelectedTeacher(teacher);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedTeacher(null);
    };

    return (
        <Box>
            <Typography variant="h5">Manage Faculty Assignments</Typography>

            <TeacherList onAssign={handleOpenModal} />
            
            {selectedTeacher && (
                <TeacherAssignmentModal 
                    open={isModalOpen} 
                    handleClose={handleCloseModal} 
                    teacherId={selectedTeacher._id} 
                />
            )}
        </Box>
    );
};

export default FacultyManager;