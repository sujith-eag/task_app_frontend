import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Typography, Button, TextField, MenuItem, 
    CircularProgress, FormGroup, FormControlLabel, Checkbox,
    List, ListItem, ListItemText, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

import { updateTeacherAssignments, deleteTeacherAssignment
    } from '../../adminSlice/adminTeacherSlice.js';

import { getSubjects } from '../../adminSlice/adminSubjectSlice.js'

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

const TeacherAssignmentModal = ({ open, handleClose, teacher }) => {
    const dispatch = useDispatch();

    // Different name for the subjects from the store to avoid confusion
    const { subjects: allSubjects, isLoading: isSubjectsLoading } = useSelector((state) => state.adminSubjects);
    const { isLoading: isTeacherLoading } = useSelector((state) => state.adminTeachers);
    // Combining Both loading into one to handle submit button
    const isLoading = isSubjectsLoading || isTeacherLoading;

    const [semester, setSemester] = useState('');
    const [filteredSubjects, setFilteredSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(''); // For the selected subject ID
    const [selectedSections, setSelectedSections] = useState([]);
    const [batch, setBatch] = useState(new Date().getFullYear());


    useEffect(() => {
        // Re-fetch subjects every time the modal opens to ensure fresh data
        if (open) {
            dispatch(getSubjects());
        }
    }, [open, dispatch]);

    
    // --- CASCADING LOGIC ---
    // When the semester changes, filter the list of available subjects
    useEffect(() => {
        if (semester) {
            const filtered = allSubjects.filter(s => s.semester === parseInt(semester));
            setFilteredSubjects(filtered);
            setSelectedSubject(''); // Reset selected subject when semester changes
        } else {
            setFilteredSubjects([]);
        }
    }, [semester, allSubjects]);
        
    
    
    const handleSectionChange = (event) => {
        const { name, checked } = event.target;
        setSelectedSections(prev => 
            checked ? [...prev, name] : prev.filter(s => s !== name)
        );
    };

    // Handler for ADDING a new assignment
    const handleAddAssignment = () => {
        if (!selectedSubject || selectedSections.length === 0 || !batch) {
            return toast.error("Please fill all fields to add an assignment.");
        }
        
        // Semester value comes directly from our state, ensuring consistency
        const assignmentData = { subject: selectedSubject, sections: selectedSections, batch, semester };
        
        dispatch(updateTeacherAssignments({ teacherId: teacher._id, assignmentData }))
            .unwrap()
            .then(() => {
                toast.success("Assignment added successfully!");
                // Reset form after successful submission
                setSelectedSubject('');
                setSelectedSections([]);
                setSemester('');
                setBatch(new Date().getFullYear());
                handleClose();
            })
            .catch(err => toast.error(err));
    };

    // Handler for DELETING an existing assignment
    const handleDeleteAssignment = (assignmentId) => {
        if (window.confirm('Are you sure you want to remove this assignment?')) {
            dispatch(deleteTeacherAssignment({ teacherId: teacher._id, assignmentId }))
                .unwrap()
                .then(() => toast.success("Assignment removed successfully!"))
                .catch(err => toast.error(err));
        }
    };

    const isFormInvalid = !selectedSubject || selectedSections.length === 0 || !batch || !semester;
    
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">Manage Assignments for {teacher?.name}</Typography>

                {/* --- DISPLAY EXISTING ASSIGNMENTS --- */}
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>Current Assignments</Typography>
                <List dense>
                    {teacher?.teacherDetails?.assignments?.length > 0 ? (
                        teacher.teacherDetails.assignments.map(assign => (
                            <ListItem
                                key={assign._id}
                                secondaryAction={
                                    <IconButton 
                                        edge="end" 
                                        aria-label="delete" 
                                        onClick={() => handleDeleteAssignment(assign._id)
                                        }>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText 
                                    primary={`${assign.subject.name} (${assign.subject.subjectCode})`}
                                    secondary={`Batch: ${assign.batch}, Semester: ${assign.semester}, Sections: ${assign.sections.join(', ')}`}
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body2">No subjects assigned yet.</Typography>
                    )}
                </List>
                
                <Divider sx={{ my: 2 }} />

                {/* --- FORM TO ADD NEW ASSIGNMENT --- */}
                <Typography 
                    variant="subtitle1" 
                    sx={{ fontWeight: 'bold' }
                    }>Add New Assignment
                </Typography>

                {/* Select Semester First */}
                <TextField 
                    label="Semester" 
                    type="number" 
                    value={semester} 
                    onChange={(e) => setSemester(e.target.value)} 
                    fullWidth 
                    required 
                    margin="normal" 
                />

                {/* Subject Dropdown is dependent on Semester */}
                <TextField 
                    select 
                    label="Select Subject" 
                    value={selectedSubject} 
                    onChange={(e) => setSelectedSubject(e.target.value)} 
                    fullWidth 
                    required 
                    margin="normal"
                    disabled={!semester || filteredSubjects.length === 0} // Disable if no semester or no subjects
                >
                    {filteredSubjects.length > 0 ? (
                        filteredSubjects.map((s) => (
                            <MenuItem 
                                key={s._id} 
                                value={s._id}
                                >{s.name} ({s.subjectCode})
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>
                            No subjects found for this semester.
                        </MenuItem>
                    )}
                </TextField>

                <TextField 
                    label="Batch Year" 
                    type="number" 
                    value={batch} 
                    onChange={(e) => setBatch(e.target.value)} 
                    fullWidth 
                    required 
                    margin="normal" 
                />

                <FormGroup row>
                    {sections.map(sec => (
                        <FormControlLabel 
                            key={sec} 
                            control={<Checkbox checked={selectedSections.includes(sec)} 
                            onChange={handleSectionChange} 
                            name={sec} 
                        />} label={sec} />
                    ))}
                </FormGroup>


                <Button type="submit" variant="contained" 
                    sx={{ mt: 2 }} 
                    disabled={isLoading || isFormInvalid}
                    onClick={handleAddAssignment}
                >{isLoading ? <CircularProgress size={24} /> : 'Add Assignment'}
                </Button>
                <Button onClick={handleClose} sx={{ mt: 2, ml: 1 }}>
                    Cancel
                </Button> 
            </Box>
        </Modal>
    );
};

export default TeacherAssignmentModal;