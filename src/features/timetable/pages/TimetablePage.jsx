// src/features/timetable/pages/TimetablePage.jsx

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Container, Typography, Box, FormControl,
    InputLabel, Select, MenuItem, CircularProgress, Alert
} from '@mui/material';
import Timetable from '../Timetable.jsx';

// import timetableService from '../timetableService'; 

import sampleData from '../data/sampleTimetable.json';

const mockCurrentUser = {
    type: 'student', // Try changing to 'staff' to test the other view
    section: 'MCA_SEM3_A',
    facultyName: 'Ms Geethanjali R'
};

const TimetablePage = () => {
    // You would fetch the current user to pass down for default view selection
    const { user } = useSelector((state) => state.auth);

    const [availableTimetables, setAvailableTimetables] = useState([]);
    const [selectedTimetableId, setSelectedTimetableId] = useState('');
    const [timetableData, setTimetableData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const timetableSessions = sampleData.timetable_A;
    if (!timetableSessions) {
        return <Alert severity="error">Timetable data could not be loaded. Check your JSON file.</Alert>;
    }
    // Effect 1: Fetch the list of all available timetables on component mount
    useEffect(() => {
        const fetchTimetableList = async () => {
            setIsLoading(true);
            try {
                // const timetables = await timetableService.getAvailableTimetables();
                // --- MOCKED DATA FOR DEMONSTRATION ---
                const timetables = [{ id: 'MCA_SEM3_A', name: 'MCA 3rd Semester - Section A' }];
                // ------------------------------------
                setAvailableTimetables(timetables);
                // Set the first timetable as the default selection
                if (timetables.length > 0) {
                    setSelectedTimetableId(timetables[0].id);
                } else {
                    setIsLoading(false); // Stop loading if there's nothing to show
                }
            } catch (err) {
                setError('Failed to fetch available timetables.');
                setIsLoading(false);
            }
        };
        fetchTimetableList();
    }, []);

    // Effect 2: Fetch the detailed session data whenever the selection changes
    useEffect(() => {
        if (!selectedTimetableId) return;

        const fetchTimetableData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // const data = await timetableService.getTimetableDataById(selectedTimetableId);
                // --- MOCKED DATA FOR DEMONSTRATION (using your provided JSON) ---
                const response = { /* Paste your JSON object here */ };
                const data = response.timetable_A; 
                // -----------------------------------------------------------------
                setTimetableData(data);
            } catch (err) {
                setError(`Failed to load data for the selected timetable.`);
                setTimetableData(null);
            }
            setIsLoading(false);
        };
        fetchTimetableData();
    }, [selectedTimetableId]);

    return (
        <Container maxWidth="xl" sx={{ my: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Academic Timetable
                </Typography>

                <FormControl fullWidth>
                    <InputLabel id="timetable-select-label">Select Timetable</InputLabel>
                    <Select
                        labelId="timetable-select-label"
                        label="Select Timetable"
                        value={selectedTimetableId}
                        onChange={(e) => setSelectedTimetableId(e.target.value)}
                        disabled={isLoading || availableTimetables.length === 0}
                    >
                        {availableTimetables.map((tt) => (
                            <MenuItem key={tt.id} value={tt.id}>{tt.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}><CircularProgress /></Box>
            )}
            {error && <Alert severity="error">{error}</Alert>}
            {!isLoading && !error && timetableSessions && (
                <Timetable data={timetableSessions} currentUser={mockCurrentUser} />
            )}
            {!isLoading && !error && availableTimetables.length === 0 && (
                <Alert severity="info">No timetables are available to display.</Alert>
            )}
        </Container>
    );
};

export default TimetablePage;