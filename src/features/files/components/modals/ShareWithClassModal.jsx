import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, CircularProgress, Box
} from '@mui/material';
import { toast } from 'react-toastify';
import { shareWithClass } from '../../fileSlice.js';
import { getClassCreationData } from '../../../teacher/teacherSlice.js';

const ShareWithClassModal = ({ open, handleClose, fileId }) => {
    const dispatch = useDispatch();
    const { assignedSubjects } = useSelector((state) => state.teacher);
    
    // Use a local loading state instead of a global one
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Local state for form fields
    const [selectedSubject, setSelectedSubject] = useState('');
    const [batch, setBatch] = useState('');
    const [section, setSection] = useState('');    
    
    useEffect(() => {
        // Only fetch data when the modal opens
        if (open) {
            dispatch(getClassCreationData());
        } else {
            // Reset form when modal closes
            setSelectedSubject('');
            setBatch('');
            setSection('');
        }
    }, [open, dispatch]);

    const handleSubmit = async () => {
        // Basic validation
        if (!selectedSubject || !batch || !section) {
            toast.error("Please fill out all fields.");
            return;
        }

        setIsSubmitting(true);
        
        const subjectDetails = assignedSubjects.find(s => s._id === selectedSubject);
        const classData = {
            subject: subjectDetails._id,
            batch: parseInt(batch),
            semester: subjectDetails.semester,
            section: section.toUpperCase(),
        };

        try {
            const res = await dispatch(shareWithClass({ fileId, classData })).unwrap();
            toast.success(res.message);
            handleClose();
        } catch (err) {
            toast.error(err || "Failed to share file.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Determine if the form is valid to enable/disable the submit button
    const isFormValid = selectedSubject && batch && section;

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
            <DialogTitle>Share File with a Class</DialogTitle>
            <DialogContent>
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
                            {`${subject.name} (Sem: ${subject.semester})`}
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
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit} 
                    variant="contained" 
                    disabled={!isFormValid || isSubmitting}
                >
                    {isSubmitting ? <CircularProgress size={24} /> : 'Share'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareWithClassModal;