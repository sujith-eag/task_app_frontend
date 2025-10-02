import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getFeedbackSummary } from '../../adminSlice/adminReportingSlice';
import DetailedFeedbackModal from './DetailedFeedbackModal.jsx';

const FeedbackReport = () => {
    const dispatch = useDispatch();
    const { feedbackSummary, isLoading } = useSelector((state) => state.adminReporting);
    
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState(null);

    useEffect(() => {
        dispatch(getFeedbackSummary()); // Fetch initial summary
    }, [dispatch]);
    
    const handleViewDetails = (id) => {
        setSelectedSessionId(id);
        setModalOpen(true);
    };

    const columns = [
        // Define columns for DataGrid: subjectName, teacherName, averageRating, feedbackCount
        { field: 'subjectName', headerName: 'Subject', flex: 1 },
        { field: 'teacherName', headerName: 'Teacher', flex: 1 },
        { field: 'averageRating', headerName: 'Avg. Rating', width: 150 },
        { field: 'feedbackCount', headerName: 'Responses', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Button variant="outlined" size="small" onClick={() => handleViewDetails(params.row.classSessionId)}>
                    View Details
                </Button>
            ),
        },
    ];

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <Typography variant="h5" gutterBottom>Feedback Summary</Typography>
            {/* Add filter components here */}
            <DataGrid
                rows={feedbackSummary}
                columns={columns}
                loading={isLoading}
                getRowId={(row) => row.classSessionId} // Specify unique ID for each row
            />
            {selectedSessionId && (
                <DetailedFeedbackModal
                    open={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    classSessionId={selectedSessionId}
                />
            )}
        </Box>
    );
};

export default FeedbackReport;