import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Typography, Button, TextField, MenuItem, CircularProgress } from '@mui/material';
import { createSubject } from '../adminSlice.js';
import { toast } from 'react-toastify';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const SubjectModal = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.admin);
    const [formData, setFormData] = useState({
        name: '',
        subjectCode: '',
        semester: '',
        department: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createSubject(formData))
            .unwrap()
            .then(() => {
                toast.success("Subject created successfully!");
                handleClose();
            })
            .catch((err) => toast.error(err));
    };

    return (
        
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2" gutterBottom>Create New Subject</Typography>
                <TextField label="Subject Name" name="name" onChange={handleChange} fullWidth required margin="normal" />
                <TextField label="Subject Code" name="subjectCode" onChange={handleChange} fullWidth required margin="normal" />
                <TextField label="Semester" name="semester" type="number" onChange={handleChange} fullWidth required margin="normal" />
                <TextField label="Department" name="department" onChange={handleChange} fullWidth required margin="normal" />
                <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : 'Create Subject'}
                </Button>
            </Box>
        </Modal>
    );
};

export default SubjectModal;