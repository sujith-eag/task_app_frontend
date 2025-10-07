import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Typography, Button, FormGroup, 
        FormControlLabel, Checkbox, CircularProgress, 
        Paper } from '@mui/material';
import { toast } from 'react-toastify';

import { updateStudentEnrollment } from '../../adminSlice/adminUserSlice.js';
import { getSubjects } from '../../adminSlice/adminSubjectSlice.js';

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

const ManageEnrollmentModal = ({ open, handleClose, student }) => {
    const dispatch = useDispatch();
    const { subjects, isLoading: isSubjectsLoading } = useSelector((state) => state.adminSubjects);
    const { isLoading: isUserLoading } = useSelector((state) => state.adminUsers);
    const isLoading = isSubjectsLoading || isUserLoading;

    
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    useEffect(() => {
        // Fetch subjects if the modal is open AND student has a semester assigned
        if (open && student?.studentDetails?.semester){
            // Fetch the list of all subjects when the modal opens
            dispatch(getSubjects({ semester: student.studentDetails.semester }));
        }
        if (student) {
            // Initialize the state with the student's currently enrolled subjects
            setSelectedSubjects(student.studentDetails?.enrolledSubjects || []);
        }
    }, [student, open, dispatch]);

    const handleSubjectChange = (e) => {
        const { value, checked } = e.target;
        setSelectedSubjects(prev => 
            checked ? [...prev, value] : prev.filter(id => id !== value)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateStudentEnrollment({ studentId: student._id, subjectIds: selectedSubjects }))
            .unwrap()
            .then((res) => {
                toast.success(res.message);
                handleClose();
            })
            .catch((err) => toast.error(err));
    };

    // A conditional render for when a student has no semester
    const studentSemester = student?.studentDetails?.semester;
    
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Manage Enrollment for {student?.name}
                </Typography>

                {!studentSemester ? (
                    <Typography color="error" sx={{ mt: 2 }}>
                        Please assign a semester to this student before managing enrollment.
                    </Typography>
                ) : (
                <Paper variant="outlined" sx={{ p: 2, mt: 2, maxHeight: 300, overflowY: 'auto' }}>
                    <FormGroup>
                        {subjects.map(subject => (
                            <FormControlLabel
                                key={subject._id}
                                control={
                                    <Checkbox
                                        checked={selectedSubjects.includes(subject._id)}
                                        onChange={handleSubjectChange}
                                        value={subject._id}
                                    />
                                }
                                label={`${subject.name} (${subject.subjectCode})`}
                            />
                        ))}
                    </FormGroup>
                </Paper>
                )}
                                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>

                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={isLoading}>
                            {isLoading ? <CircularProgress size={24} /> : 'Save Enrollment'}
                    </Button>
                </Box>

            </Box>
        </Modal>
    );
};

export default ManageEnrollmentModal;