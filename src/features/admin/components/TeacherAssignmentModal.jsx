import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Typography, Button, TextField, MenuItem, CircularProgress, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { toast } from 'react-toastify';

import { updateTeacherAssignments, getSubjects } from '../adminSlice.js';

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

const sections = ['A', 'B'];

const TeacherAssignmentModal = ({ open, handleClose, teacherId }) => {
    const dispatch = useDispatch();
    const { subjects, isLoading } = useSelector((state) => state.admin);
    const [subject, setSubject] = useState('');
    const [selectedSections, setSelectedSections] = useState([]);
    const [batch, setBatch] = useState(new Date().getFullYear());

    useEffect(() => {
        // Fetch subjects when the modal is opened
        if (open) {
            dispatch(getSubjects());
        }
    }, [open, dispatch]);


    const handleSectionChange = (event) => {
        const { name, checked } = event.target;
        setSelectedSections(prev => 
            checked ? [...prev, name] : prev.filter(s => s !== name)
        );
    };

    const handleSubmit = () => {
        const assignmentData = { subject, sections: selectedSections, batch };
        
        
    dispatch(updateTeacherAssignments({ teacherId, assignmentData }))
        .unwrap()
        .then(() => {
            toast.success("Assignment saved successfully!");
            handleClose();
        })
        .catch(err => toast.error(err));
    };


    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">Assign Subject to Teacher</Typography>

                <TextField 
                    select 
                    label="Select Subject" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    fullWidth 
                    required 
                    margin="normal"
                >
                {subjects.map((s) => (
                    <MenuItem key={s._id} value={s._id}>{s.name} ({s.subjectCode})</MenuItem>
                ))}
                </TextField>

                <TextField label="Batch Year" type="number" value={batch} onChange={(e) => setBatch(e.target.value)} fullWidth required margin="normal" />
                <Typography variant="subtitle1" sx={{ mt: 1 }}>Assign Sections</Typography>

                <FormGroup row>
                    {sections.map(sec => (
                        <FormControlLabel 
                            key={sec} 
                            control={<Checkbox checked={selectedSections.includes(sec)} onChange={handleSectionChange} name={sec} />} 
                            label={sec} 
                        />
                    ))}
                </FormGroup>
                <Button onClick={handleSubmit} variant="contained" sx={{ mt: 2 }} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : 'Save Assignment'}
                </Button>
            </Box>
        </Modal>
    );
};

export default TeacherAssignmentModal;