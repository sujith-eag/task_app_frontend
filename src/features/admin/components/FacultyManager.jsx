import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import TeacherAssignmentModal from './TeacherAssignmentModal';

const FacultyManager = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState(null); // ID of teacher being edited

    // This component would display a list of all teachers.
    // For simplicity, we'll just have a button to open the assignment modal.
    
    const handleOpenModal = (teacherId) => {
        setSelectedTeacher(teacherId);
        setIsModalOpen(true);
    };

    return (
        <Box>
            <Typography variant="h5">Manage Faculty Assignments</Typography>
            {/* Placeholder to simulate selecting a teacher to edit */}
            <Button sx={{mt: 2}} variant="outlined" onClick={() => handleOpenModal('teacher_id_placeholder')}>
                Assign Subjects to Dr. Smith
            </Button>
            
            {selectedTeacher && (
                <TeacherAssignmentModal 
                    open={isModalOpen} 
                    handleClose={() => setIsModalOpen(false)} 
                    teacherId={selectedTeacher} 
                />
            )}
        </Box>
    );
};

export default FacultyManager;