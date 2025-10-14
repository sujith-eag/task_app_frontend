import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Typography, Button, TextField, MenuItem, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { shareWithClass } from '../../fileSlice.js';

import { getClassCreationData } from '../../../teacher/teacherSlice.js';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const ShareWithClassModal = ({ open, handleClose, fileId }) => {
    const dispatch = useDispatch();
    const { assignedSubjects } = useSelector((state) => state.teacher);
    const { isLoading } = useSelector((state) => state.files);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [batch, setBatch] = useState('');
    const [section, setSection] = useState('');    
    
    useEffect(() => {
        // Fetch the teacher's subjects to populate the dropdown
        dispatch(getClassCreationData());
    }, [dispatch]);

    const handleSubmit = () => {
        if (!selectedSubject) {
            toast.error("Please select a subject.");
            return;
        }
        const subjectDetails = assignedSubjects.find(s => s._id === selectedSubject);
        const classData = {
            subject: subjectDetails._id,
            batch: parseInt(batch),
            semester: subjectDetails.semester,
            section: section,
        };

        dispatch(shareWithClass({ fileId, classData }))
            .unwrap()
            .then((res) => {
                toast.success(res.message);
                handleClose();
            })
            .catch((err) => toast.error(err));
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">Share File with a Class</Typography>
                <TextField
                    select
                    label="Select Subject/Class"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    {assignedSubjects.map((subject) => (
                        <MenuItem key={subject._id} value={subject._id}>
                            {subject.name} (Sem: {subject.semester})
                        </MenuItem>
                    ))}
                </TextField>
                
                <TextField
                    label="Batch (e.g., 2025)"
                    type="number"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Section (e.g., A)"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                                
                <Button onClick={handleSubmit} variant="contained" sx={{ mt: 2 }} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : 'Share File'}
                </Button>
            </Box>
        </Modal>
    );
};

export default ShareWithClassModal;