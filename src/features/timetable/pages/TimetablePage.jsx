import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Container, Typography, Box, FormControl,
    InputLabel, Select, MenuItem, CircularProgress, Alert
} from '@mui/material';
import Timetable from '../Timetable.jsx';

// --- MOCK DATA SECTION ---
// Replace sampleData and mockCurrentUser with API/user data in production
// import sampleData from '../data/newTimeTable.json';
import sampleData from '../data/currentTimeTable.json'

const mockCurrentUser = {
    type: 'student', // Change to 'staff' to test staff view
    section: 'MCA_SEM3_A',
    facultyName: 'Ms Geethanjali R'
};
// --- END MOCK DATA SECTION ---

const TimetablePage = () => {
    // TODO: Replace mockCurrentUser with actual user from Redux or API
    // const { user } = useSelector((state) => state.auth);
    const user = mockCurrentUser;

    // TODO: Replace sampleData with data fetched from API based on selected timetable
    // const [timetableData, setTimetableData] = useState(null);
    // Extract timetable_A array from the new data structure
    const timetableSessions = sampleData?.timetable_A || [];

    // Timetable selection state (for future API integration)
    const [availableTimetables, setAvailableTimetables] = useState([]);
    const [selectedTimetableId, setSelectedTimetableId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Show error if no timetable data is available
    if (!timetableSessions || timetableSessions.length === 0) {
        return <Alert severity="error">Timetable data could not be loaded. Check your JSON file.</Alert>;
    }

    // --- EFFECT: Fetch available timetables (replace with API call) ---
    useEffect(() => {
        const fetchTimetableList = async () => {
            setIsLoading(true);
            try {
                // TODO: Replace with API call to fetch available timetables
                // const timetables = await timetableService.getAvailableTimetables();
                // MOCKED DATA
                const timetables = [{ id: 'MCA_SEM3_A', name: 'MCA 3rd Semester - Section A' }];
                setAvailableTimetables(timetables);
                if (timetables.length > 0) {
                    setSelectedTimetableId(timetables[0].id);
                } else {
                    setIsLoading(false);
                }
            } catch (err) {
                setError('Failed to fetch available timetables.');
                setIsLoading(false);
            }
        };
        fetchTimetableList();
    }, []);

    // --- EFFECT: Fetch timetable data for selected timetable (replace with API call) ---
    useEffect(() => {
        if (!selectedTimetableId) return;
        const fetchTimetableData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // TODO: Replace with API call to fetch timetable data by ID
                // const data = await timetableService.getTimetableDataById(selectedTimetableId);
                // MOCKED DATA
                // const response = { ... };
                // const data = response.timetable_A;
                // setTimetableData(data);
            } catch (err) {
                setError(`Failed to load data for the selected timetable.`);
                // setTimetableData(null);
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
                {/* Timetable selection dropdown (future: populate from API) */}
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
            {/* Pass user and timetableSessions as props. Replace with API/user data in production. */}
            {!isLoading && !error && timetableSessions && timetableSessions.length > 0 && (
                <Timetable data={timetableSessions} currentUser={user} />
            )}
            {!isLoading && !error && availableTimetables.length === 0 && (
                <Alert severity="info">No timetables are available to display.</Alert>
            )}
        </Container>
    );
};

export default TimetablePage;