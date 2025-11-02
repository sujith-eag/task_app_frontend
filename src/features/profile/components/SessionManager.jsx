import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, List, ListItem, ListItemText, Button, Chip, CircularProgress, Divider } from '@mui/material';
import { fetchSessions, revokeSession } from '../profileSlice.js';
import { getDeviceId } from '../../../utils/deviceId.js';
import ConfirmationDialog from '../../../components/ConfirmationDialog.jsx';
import { toast } from 'react-toastify';

const SessionManager = () => {
  const dispatch = useDispatch();
  const { sessions, sessionStatus } = useSelector((state) => state.profile);
  const currentDeviceId = getDeviceId();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  const handleRevoke = (deviceId) => {
    if (!deviceId) return;
    // Open confirmation dialog
    const session = sessions.find((s) => s.deviceId === deviceId) || { deviceId };
    setSelectedSession(session);
    setConfirmOpen(true);
  };

  const handleConfirmRevoke = async () => {
    if (!selectedSession) return;
    try {
      await dispatch(revokeSession(selectedSession.deviceId)).unwrap();
      toast.success('Session revoked');
    } catch (err) {
      const msg = err?.message || err || 'Failed to revoke session';
      toast.error(msg);
    } finally {
      setConfirmOpen(false);
      setSelectedSession(null);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Active Sessions</Typography>

      {sessionStatus === 'loading' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={20} />
          <Typography variant="body2">Loading sessions...</Typography>
        </Box>
      )}

      {sessionStatus === 'succeeded' && (!sessions || sessions.length === 0) && (
        <Typography variant="body2" color="text.secondary">No active sessions found.</Typography>
      )}

      {sessionStatus === 'succeeded' && sessions && sessions.length > 0 && (
        <List>
          {sessions.map((s) => (
            <div key={s.deviceId}>
              <ListItem sx={{ alignItems: 'flex-start' }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2">{s.userAgent || 'Unknown device'}</Typography>
                      {s.deviceId === currentDeviceId && (
                        <Chip label="This device" size="small" color="primary" />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">{s.ipAddress || 'Unknown IP'}</Typography>
                      <Typography variant="caption" color="text.secondary">Last used: {s.lastUsedAt ? new Date(s.lastUsedAt).toLocaleString() : '—'}</Typography>
                    </>
                  }
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRevoke(s.deviceId)}
                    disabled={sessionStatus === 'loading'}
                  >
                    Revoke
                  </Button>
                </Box>
              </ListItem>
              <Divider component="li" />
            </div>
          ))}
        </List>
      )}

      {sessionStatus === 'failed' && (
        <Typography variant="body2" color="error">Failed to load sessions.</Typography>
      )}
      <ConfirmationDialog
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setSelectedSession(null); }}
        onConfirm={handleConfirmRevoke}
        title="Revoke session"
        message={selectedSession ? `Revoke session for ${selectedSession.userAgent || selectedSession.deviceId}? This will sign out that device.` : 'Revoke this session?'}
        variant="delete"
        confirmText="Revoke"
        cancelText="Cancel"
      />
    </Box>
  );
};

export default SessionManager;
