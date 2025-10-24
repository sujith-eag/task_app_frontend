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
    // Use the presence of the session object to control the dialog's open state
    if (!session) return null;
    const color = getComponentColor(session.componentType);

    return (
        <Dialog 
            open={!!session} 
            onClose={onClose} 
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: { borderRadius: 3, overflow: 'visible' }
            }}
        >
            {/* Accent bar/header */}
            <Box sx={{
                height: 8,
                width: '100%',
                bgcolor: color.bgcolor,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
            }} />
            <DialogTitle sx={{ m: 0, p: 2, borderBottom: 1, borderColor: 'divider', pb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                        width: 36, height: 36, borderRadius: '50%',
                        bgcolor: color.bgcolor, color: color.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 20,
                        boxShadow: 2,
                    }}>
                        <SchoolIcon fontSize="medium" />
                    </Box>
                    <Box>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                            {session.subjectTitle}
                        </Typography>
                        <Typography variant="body2" sx={{ color: color.bgcolor, fontWeight: 500 }}>
                            {session.subjectCode} ({session.componentType})
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 2, pb: 1 }}>
                <List dense>
                    <ListItem>
                        <ListItemIcon><SchoolIcon color="primary" /></ListItemIcon>
                        <ListItemText primary={<b>{session.facultyName}</b>} secondary="Faculty" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><GroupIcon color="info" /></ListItemIcon>
                        <ListItemText primary={<b>{session.studentGroupId}</b>} secondary="Group / Section" />
                    </ListItem>
                    {/* Display sections if available */}
                    {hasSections(session.sections) && (
                        <ListItem>
                            <ListItemIcon><GroupIcon color="primary" /></ListItemIcon>
                            <ListItemText 
                                primary={<b>{formatSections(session.sections)}</b>} 
                                secondary="Section(s)" 
                            />
                        </ListItem>
                    )}
                    <ListItem>
                        <ListItemIcon><MeetingRoomIcon color="secondary" /></ListItemIcon>
                        <ListItemText primary={<b>{session.roomId}</b>} secondary="Room" />
                    </ListItem>
                    <ListItem>
                        <ListItemIcon><ScheduleIcon color="action" /></ListItemIcon>
                        <ListItemText primary={<b>{`${session.day}, ${session.startTime} - ${session.endTime}`}</b>} secondary="Time" />
                    </ListItem>
                    {session.supportingStaff && session.supportingStaff.length > 0 && (
                        <>
                            <Divider sx={{ my: 1 }} />
                            <ListItem>
                                <ListItemIcon><SupportAgentIcon color="success" /></ListItemIcon>
                                <ListItemText 
                                    primary={<b>{session.supportingStaff.map(staff => staff.staffName).join(', ')}</b>} 
                                    secondary="Supporting Staff" 
                                />
                            </ListItem>
                        </>
                    )}
                </List>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
                <Button onClick={onClose} variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 600 }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SessionModal;