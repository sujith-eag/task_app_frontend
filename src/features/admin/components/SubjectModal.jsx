import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Typography, Button, TextField, MenuItem, CircularProgress } from '@mui/material';
import { createSubject, updateSubject } from '../adminSlice.js';
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

const SubjectModal = ({ open, handleClose, subject }) => {
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
    
    useEffect(() => {
        if (subject) {
            setFormData(subject); // Populate form if in edit mode
        } else {
            setFormData({ name: '', subjectCode: '', semester: '', department: '' }); // Clear form for create mode
        }
    }, [subject, open]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const action = subject 
            ? updateSubject({ id: subject._id, ...formData }) 
            : createSubject(formData);

        dispatch(action)
            .unwrap()
            .then(() => {
                toast.success(`Subject ${subject ? 'updated' : 'created'} successfully!`);
                handleClose();
            })
            .catch((err) => toast.error(err));
    };

    return (
        
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2" gutterBottom>
                    {subject ? 'Edit Subject' : 'Create New Subject'}
                </Typography>
                {/* Add the value prop to all TextFields */}
                <TextField label="Subject Name" name="name" value={formData.name} onChange={handleChange} fullWidth required margin="normal" />
                <TextField label="Subject Code" name="subjectCode" value={formData.subjectCode} onChange={handleChange} fullWidth required margin="normal" />
                <TextField label="Semester" name="semester" type="number" value={formData.semester} onChange={handleChange} fullWidth required margin="normal" />
                <TextField label="Department" name="department" value={formData.department} onChange={handleChange} fullWidth required margin="normal" />

                <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : (subject ? 'Save Changes' : 'Create Subject')}
                </Button>
            </Box>
        </Modal>
    );
};
export default SubjectModal;