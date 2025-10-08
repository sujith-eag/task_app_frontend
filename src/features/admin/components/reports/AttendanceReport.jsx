import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { getAttendanceStats } from '../../adminSlice/adminReportingSlice.js';
import { getAllTeachers } from '../../adminSlice/adminTeacherSlice.js';
import { getSubjects } from '../../adminSlice/adminSubjectSlice.js'

const AttendanceReport = () => {
    const dispatch = useDispatch();
    
    // --- Selectors for Redux State ---
    const { attendanceStats, isLoading } = useSelector((state) => state.adminReporting);
    const { teachers } = useSelector((state) => state.adminTeachers); 
    const { subjects } = useSelector((state) => state.adminSubjects);
    
    // --- Local State for Filter Values ---
    const [filters, setFilters] = useState({
        teacherId: '',
        subjectId: '',
        semester: '',
    });

    // --- State for filtered subjects ---
    const [filteredSubjects, setFilteredSubjects] = useState([]);

    // --- Data Fetching and Filter Logic ---
    useEffect(() => {
        dispatch(getAllTeachers());
        dispatch(getSubjects());
    }, [dispatch]);

    // This effect filters the subjects whenever the semester or main subject list changes
    useEffect(() => {
        if (filters.semester) {
            setFilteredSubjects(subjects.filter(s => s.semester === parseInt(filters.semester, 10)));
        } else {
            setFilteredSubjects(subjects); // If no semester, show all
        }
    }, [filters.semester, subjects]);
    
    useEffect(() => {
        // runs whenever the filters change to re-fetch the report data.
        const activeFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '')
        );
        dispatch(getAttendanceStats(activeFilters));
    }, [dispatch, filters]);

    // --- Event Handlers ---
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        
        // If semester is changed, reset the subject filter
        if (name === 'semester') {
            setFilters(prev => ({ ...prev, subjectId: '', [name]: value }));
        } else {
            setFilters(prev => ({ ...prev, [name]: value }));
        }
    };

    // --- DataGrid Column Definitions ---
    // These fields match the response from the getAttendanceStats controller
    const columns = [
        { field: 'subjectName', headerName: 'Subject', flex: 1.5 },
        { field: 'teacherName', headerName: 'Teacher', flex: 1 },
        { field: 'semester', headerName: 'Sem', width: 80 },
        { field: 'batch', headerName: 'Batch', width: 100 },
        { field: 'section', headerName: 'Sec', width: 80 },
        { 
            field: 'attendancePercentage', 
            headerName: 'Attendance %', 
            width: 150,
            renderCell: (params) => `${params.value.toFixed(2)}%`
        },
        { field: 'presentStudents', headerName: 'Present', width: 100 },
        { field: 'totalStudents', headerName: 'Total', width: 100 },
    ];


    return (
        <Box>
            <Typography variant="h5" gutterBottom>Attendance Statistics</Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel id="teacher-filter-label">Teacher</InputLabel>
                        <Select
                            labelId="teacher-filter-label"
                            name="teacherId"
                            value={filters.teacherId}
                            label="Teacher"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value=""><em>All Teachers</em></MenuItem>
                            {/* --- Map over the 'teachers' array --- */}
                            {teachers.map((teacher) => (
                                <MenuItem key={teacher._id} value={teacher._id}>{teacher.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel id="subject-filter-label">Subject</InputLabel>
                        <Select
                            labelId="subject-filter-label"
                            name="subjectId"
                            value={filters.subjectId}
                            label="Subject"
                            onChange={handleFilterChange}
                        >
                            <MenuItem value=""><em>All Subjects</em></MenuItem>
                            {/* --- Map over the 'subjects' array --- */}
                            {filteredSubjects.map((subject) => (
                                <MenuItem key={subject._id} value={subject._id}>{subject.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                
                
                <Grid item xs={12} sm={4}>
                     <FormControl fullWidth>
                        <InputLabel id="semester-filter-label">Semester</InputLabel>
                        <Select
                            labelId="semester-filter-label"
                            name="semester"
                            value={filters.semester}
                            label="Semester"
                            onChange={handleFilterChange}
                        >
                             <MenuItem value=""><em>All Semesters</em></MenuItem>
                             <MenuItem value="1">1</MenuItem>
                             <MenuItem value="2">2</MenuItem>
                             <MenuItem value="3">3</MenuItem>
                             <MenuItem value="4">4</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={attendanceStats}
                    columns={columns}
                    loading={isLoading}
                    disableRowSelectionOnClick
                />
            </Box>
        </Box>
    );
};

export default AttendanceReport;