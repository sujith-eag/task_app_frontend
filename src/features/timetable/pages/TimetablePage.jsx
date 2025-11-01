import React from 'react';
import { Container, Alert } from '@mui/material';
import Timetable from '../Timetable.jsx';

// --- MOCK DATA SECTION ---
// TODO: Replace sampleData and mockCurrentUser with API/user data in production
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

    // TODO: Replace sampleData with data fetched from API
    // const timetableSessions = await timetableService.getTimetableData();
    const timetableSessions = sampleData?.timetable_A || [];

    // Show error if no timetable data is available
    if (!timetableSessions || timetableSessions.length === 0) {
        return (
            <Container maxWidth="xl" sx={{ my: 4 }}>
                <Alert severity="error">Timetable data could not be loaded. Check your JSON file.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ my: 4 }}>
            <Timetable data={timetableSessions} currentUser={user} />
        </Container>
    );
};

export default TimetablePage;