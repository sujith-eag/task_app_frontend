import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    IconButton, Typography, List, ListItem, ListItemIcon,
    ListItemText, Divider, Button, Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { getComponentColor } from '../constants';
import { formatSections, hasSections } from '../utils';

const SessionModal = ({ session, onClose }) => {
    // Keep component mounted for better performance, control visibility with open prop
    const isOpen = !!session;
    const color = session ? getComponentColor(session.componentType) : { bgcolor: 'primary.main', color: 'white' };

    return (
        <Dialog 
            open={isOpen} 
            onClose={onClose} 
            fullWidth
            maxWidth="sm"
            slotProps={{
                transition: {
                    timeout: 300 // Faster transition
                },
                paper: {
                    sx: { 
                        borderRadius: 3, 
                        overflow: 'hidden',
                        backgroundColor: 'background.paper',
                        backgroundImage: 'none',
                    }
                }
            }}
        >
            {/* Accent bar/header */}
            {session && (
                <>
                    <DialogTitle sx={{ 
                        m: 0, 
                        p: 2,
                        pb: 2,
                        borderBottom: 1, 
                        borderColor: 'divider',
                    }}>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                        }}>
                            <Box sx={{
                                width: 40, 
                                height: 40, 
                                borderRadius: '8px',
                                bgcolor: color.bgcolor, 
                                color: color.color,
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                fontWeight: 700, 
                                fontSize: 20,
                                boxShadow: 2,
                            }}>
                                <SchoolIcon fontSize="medium" />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 700, mb: 0.5 }}>
                                    {session.shortCode ? `${session.shortCode} - ` : ''}{session.subjectTitle}
                                </Typography>
                                <Box sx={{ 
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 1.5,
                                    bgcolor: `${color.bgcolor}20`,
                                    border: '2px solid',
                                    borderColor: color.bgcolor,
                                }}>
                                    <Typography variant="body2" sx={{ color: color.bgcolor, fontWeight: 600 }}>
                                        {session.subjectCode}
                                    </Typography>
                                    <Box sx={{
                                        width: 4,
                                        height: 4,
                                        borderRadius: '50%',
                                        bgcolor: color.bgcolor,
                                    }} />
                                    <Typography variant="body2" sx={{ color: color.bgcolor, fontWeight: 600 }}>
                                        {session.componentType}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </DialogTitle>

                    <DialogContent sx={{ pt: 2.5, pb: 1 }}>
                        <List dense>
                            <ListItem sx={{
                                borderRadius: 1.5,
                                mb: 0.5,
                                '&:hover': { bgcolor: 'action.hover' }
                            }}>
                                <ListItemIcon><SchoolIcon color="primary" /></ListItemIcon>
                                <ListItemText 
                                    primary={<Typography sx={{ fontWeight: 600 }}>{session.facultyName}</Typography>} 
                                    secondary="Faculty" 
                                />
                            </ListItem>
                            <ListItem sx={{
                                borderRadius: 1.5,
                                mb: 0.5,
                                '&:hover': { bgcolor: 'action.hover' }
                            }}>
                                <ListItemIcon><GroupIcon color="info" /></ListItemIcon>
                                <ListItemText 
                                    primary={<Typography sx={{ fontWeight: 600 }}>{session.studentGroupId}</Typography>} 
                                    secondary="Group / Section" 
                                />
                            </ListItem>
                            {/* Display sections if available */}
                            {hasSections(session.sections) && (
                                <ListItem sx={{
                                    borderRadius: 1.5,
                                    mb: 0.5,
                                    '&:hover': { bgcolor: 'action.hover' }
                                }}>
                                    <ListItemIcon><GroupIcon color="primary" /></ListItemIcon>
                                    <ListItemText 
                                        primary={<Typography sx={{ fontWeight: 600 }}>{formatSections(session.sections)}</Typography>} 
                                        secondary="Section(s)" 
                                    />
                                </ListItem>
                            )}
                            <ListItem sx={{
                                borderRadius: 1.5,
                                mb: 0.5,
                                '&:hover': { bgcolor: 'action.hover' }
                            }}>
                                <ListItemIcon><MeetingRoomIcon color="secondary" /></ListItemIcon>
                                <ListItemText 
                                    primary={<Typography sx={{ fontWeight: 600 }}>{session.roomId}</Typography>} 
                                    secondary="Room" 
                                />
                            </ListItem>
                            <ListItem sx={{
                                borderRadius: 1.5,
                                mb: 0.5,
                                '&:hover': { bgcolor: 'action.hover' }
                            }}>
                                <ListItemIcon><ScheduleIcon color="action" /></ListItemIcon>
                                <ListItemText 
                                    primary={<Typography sx={{ fontWeight: 600 }}>{`${session.day}, ${session.startTime} - ${session.endTime}`}</Typography>} 
                                    secondary="Time" 
                                />
                            </ListItem>
                            {session.supportingStaff && session.supportingStaff.length > 0 && (
                                <>
                                    <Divider sx={{ my: 1.5 }} />
                                    <ListItem sx={{
                                        borderRadius: 1.5,
                                        bgcolor: (theme) => theme.palette.mode === 'dark' 
                                            ? 'rgba(76, 175, 80, 0.08)' 
                                            : 'rgba(76, 175, 80, 0.05)',
                                        border: '1px solid',
                                        borderColor: 'success.main',
                                    }}>
                                        <ListItemIcon><SupportAgentIcon color="success" /></ListItemIcon>
                                        <ListItemText 
                                            primary={<Typography sx={{ fontWeight: 600 }}>{session.supportingStaff.map(staff => staff.name).join(', ')}</Typography>} 
                                            secondary="Supporting Staff" 
                                        />
                                    </ListItem>
                                </>
                            )}
                        </List>
                    </DialogContent>

                    <DialogActions sx={{ px: 3, pb: 2.5, pt: 1.5 }}>
                        <Button 
                            onClick={onClose} 
                            variant="contained" 
                            color="primary" 
                            sx={{ 
                                borderRadius: 2, 
                                fontWeight: 600,
                                px: 3,
                                py: 1,
                                textTransform: 'none',
                            }}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </>
            )}
        </Dialog>
    );
};

export default SessionModal;