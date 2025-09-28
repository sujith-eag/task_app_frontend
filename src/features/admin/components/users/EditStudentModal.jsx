import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Typography, Button, TextField, 
    MenuItem, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

import { updateStudentDetails } from '../../adminSlice.js';

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

const sections = ['A', 'B', 'C'];

const EditStudentModal = ({ open, handleClose, student }) => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.admin);

    const [formData, setFormData] = useState({
        usn: '',
        batch: '',
        section: '',
        semester: '',
    });

    // Pre-populate the form when the modal opens with a student's data
    useEffect(() => {
        if (student) {
            setFormData({
                usn: student.studentDetails?.usn || '',
                batch: student.studentDetails?.batch || '',
                section: student.studentDetails?.section || '',
                semester: student.studentDetails?.semester || '',
            });
        }
    }, [student, open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.usn || !formData.batch || !formData.section) {
            return toast.error('All fields are required.');
        }

        dispatch(updateStudentDetails({ studentId: student._id, studentData: formData }))
            .unwrap()
            .then((res) => {
                toast.success(res.message);
                handleClose();
            })
            .catch((err) => {
                toast.error(err);
            });
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Edit Details for {student?.name}
                </Typography>
                <TextField
                    label="University Seat Number (USN)"
                    name="usn"
                    value={formData.usn}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Batch"
                    name="batch"
                    type="number"
                    value={formData.batch}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Semester"
                    name="semester"
                    type="number"
                    value={formData.semester}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    select
                    label="Section"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                >
                    {sections.map((sec) => (
                        <MenuItem key={sec} value={sec}>{sec}</MenuItem>
                    ))}
                </TextField>
                <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
            </Box>
        </Modal>
    );
};

export default EditStudentModal;