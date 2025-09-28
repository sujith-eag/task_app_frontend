import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Typography, Button, TextField, MenuItem, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

import { promoteToFaculty } from '../../adminSlice.js';

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

const PromoteUserModal = ({ open, handleClose, user }) => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.admin);

    const [role, setRole] = useState('teacher');
    const [staffId, setStaffId] = useState('');
    const [department, setDepartment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!staffId || !department) {
            return toast.error('Please fill out all fields.');
        }

        const facultyData = { role, staffId, department };

        dispatch(promoteToFaculty({ userId: user._id, facultyData }))
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
                    Promote {user?.name} to Faculty
                </Typography>
                <TextField
                    select
                    label="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                >
                    <MenuItem value="teacher">Teacher</MenuItem>
                    <MenuItem value="hod">HOD</MenuItem>
                </TextField>
                <TextField
                    label="Staff ID"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />
                <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : `Promote User`}
                </Button>
                <Button onClick={handleClose} sx={{ mt: 2, ml: 1 }}>
                    Cancel
                </Button>
            </Box>
        </Modal>
    );
};

export default PromoteUserModal;