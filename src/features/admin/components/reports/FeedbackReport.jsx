import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button } from '@mui/material';
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
        { field: 'subjectName', headerName: 'Subject', flex: 1.5 },
        { field: 'teacherName', headerName: 'Teacher', flex: 1 },
        { field: 'feedbackCount', headerName: 'Responses', width: 120 },
        
        // --- UPDATED COLUMNS using renderCell ---
        { 
            field: 'clarity', // Field is now a simple identifier
            headerName: 'Clarity', 
            width: 120,
            // renderCell gives you direct access to the full row object
            renderCell: (params) => {
                const value = params.row.averageRatings?.clarity;
                return value ? value.toFixed(2) : 'N/A';
            }
        },
        { 
            field: 'engagement', 
            headerName: 'Engagement', 
            width: 120,
            renderCell: (params) => {
                const value = params.row.averageRatings?.engagement;
                return value ? value.toFixed(2) : 'N/A';
            }
        },
        { 
            field: 'pace', 
            headerName: 'Pace', 
            width: 120,
            renderCell: (params) => {
                const value = params.row.averageRatings?.pace;
                return value ? value.toFixed(2) : 'N/A';
            }
        },
        { 
            field: 'knowledge', 
            headerName: 'Knowledge', 
            width: 120,
            renderCell: (params) => {
                const value = params.row.averageRatings?.knowledge;
                return value ? value.toFixed(2) : 'N/A';
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Button variant="outlined" size="small" onClick={() => handleViewDetails(params.row.id)}>
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