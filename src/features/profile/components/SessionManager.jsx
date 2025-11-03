import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, List, ListItem, ListItemText, Button, Chip, CircularProgress, Divider, Stack, Tooltip } from '@mui/material';
import { fetchSessions, revokeSession } from '../profileSlice.js';
import { getDeviceId } from '../../../utils/deviceId.js';
import ConfirmationDialog from '../../../components/ConfirmationDialog.jsx';
import { toast } from 'react-toastify';
import fetchWithRetry from '../../../utils/fetchWithRetry.js';

const SessionManager = () => {
  const dispatch = useDispatch();
  const { sessions, sessionStatus } = useSelector((state) => state.profile);
  const currentDeviceId = getDeviceId();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [geoMap, setGeoMap] = useState({}); // deviceId -> { city, region, country }

  useEffect(() => {
    dispatch(fetchSessions());
  }, [dispatch]);

  // When sessions load, attempt to fetch geo info (best-effort)
  useEffect(() => {
    if (Array.isArray(sessions)) {
      sessions.forEach((s) => {
        if (s && s.ipAddress) fetchGeoForIp(s.ipAddress, s.deviceId);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions]);

  // Helper: relative time (e.g., "5 minutes ago")
  const timeAgo = (iso) => {
    if (!iso) return '—';
    const then = new Date(iso).getTime();
    const now = Date.now();
    const seconds = Math.floor((now - then) / 1000);
    if (seconds < 60) return `${seconds} sec${seconds !== 1 ? 's' : ''} ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
    return new Date(iso).toLocaleDateString();
  };

  // Optional: fetch simple geolocation for an IP using ipapi.co (best-effort)
  const fetchGeoForIp = async (ip, deviceId) => {
    if (!ip || ip.startsWith('::ffff:127') || ip === '::1' || ip === '127.0.0.1') return;
    try {
      const cleaned = ip.replace('::ffff:', '');
      // Use dev proxy when running in dev to avoid CORS; in production call ipapi.co directly
      const url = import.meta.env.DEV ? `/ipapi/${cleaned}/json/` : `https://ipapi.co/${cleaned}/json/`;

      const res = await fetchWithRetry(url, {}, 3, 400);
      if (!res || !res.ok) return;
      const data = await res.json();
      const pretty = [data.city, data.region, data.country_name].filter(Boolean).join(', ');
      setGeoMap((m) => ({ ...m, [deviceId]: pretty }));
    } catch (err) {
      // ignore geo errors — best-effort only
    }
  };

  // Format IP for display: strip IPv6 prefix, show DeveloperZone for localhost
  const formatIp = (ip) => {
    if (!ip) return 'Unknown IP';
    const cleaned = ip.replace('::ffff:', '');
    if (cleaned === '127.0.0.1' || cleaned === '::1' || cleaned === 'localhost') return 'DeveloperZone';
    return cleaned;
  };

  // Shorten long device ids for display with full value in tooltip
  const shortenId = (id) => {
    if (!id) return '';
    if (id.length <= 16) return id;
    return `${id.slice(0, 8)}...${id.slice(-6)}`;
  };

  // Simple UA parser to show concise device/browser info
  const parseUserAgent = (ua) => {
    if (!ua) return 'Unknown device';
    try {
      // Try to extract platform inside parentheses
      const platformMatch = ua.match(/\(([^)]+)\)/);
      const platform = platformMatch ? platformMatch[1].split(';')[0].trim() : null;
      // Try to detect common browsers
      let browser = '';
      if (/Chrome\//i.test(ua)) {
        const m = ua.match(/Chrome\/([\d.]+)/i);
        browser = m ? `Chrome ${m[1].split('.')[0]}` : 'Chrome';
      } else if (/Firefox\//i.test(ua)) {
        const m = ua.match(/Firefox\/([\d.]+)/i);
        browser = m ? `Firefox ${m[1].split('.')[0]}` : 'Firefox';
      } else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) {
        browser = 'Safari';
      } else if (/Edg\//i.test(ua)) {
        browser = 'Edge';
      }
      return browser ? (platform ? `${browser} — ${platform}` : browser) : (platform || ua.slice(0, 40) + (ua.length > 40 ? '...' : ''));
    } catch (e) {
      return ua.slice(0, 40) + (ua.length > 40 ? '...' : '');
    }
  };

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
        (() => {
          // Deduplicate sessions by deviceId (keep the most recently used entry)
          const dedupeMap = new Map();
          sessions.forEach((s) => {
            if (!s || !s.deviceId) return;
            const existing = dedupeMap.get(s.deviceId);
            if (!existing) dedupeMap.set(s.deviceId, s);
            else {
              // pick the one with newer lastUsedAt (or createdAt)
              const existingTime = new Date(existing.lastUsedAt || existing.createdAt || 0).getTime();
              const sTime = new Date(s.lastUsedAt || s.createdAt || 0).getTime();
              if (sTime >= existingTime) dedupeMap.set(s.deviceId, s);
            }
          });
          const deduped = Array.from(dedupeMap.values()).sort((a, b) => {
            const at = new Date(b.lastUsedAt || b.createdAt || 0).getTime();
            const bt = new Date(a.lastUsedAt || a.createdAt || 0).getTime();
            return at - bt;
          });

          return (
            <List>
              {deduped.map((s) => (
                <div key={s.deviceId}>
                  <ListItem sx={{ flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' } }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Tooltip title={s.userAgent || 'Unknown device'} arrow>
                        <Typography component="span" variant="subtitle2" sx={{ maxWidth: 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', verticalAlign: 'middle' }}>
                          {parseUserAgent(s.userAgent)}
                        </Typography>
                      </Tooltip>
                      {s.deviceId === currentDeviceId && (
                        <Chip label="This device" size="small" color="primary" />
                      )}
                      {/* show shortened device id */}
                      {s.deviceId && (
                        <Tooltip title={s.deviceId} arrow>
                          <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', display: 'inline-block', verticalAlign: 'middle' }}>
                            ID: {shortenId(s.deviceId)}
                          </Typography>
                        </Tooltip>
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                        {formatIp(s.ipAddress)}{geoMap[s.deviceId] && formatIp(s.ipAddress) !== 'DeveloperZone' ? ` — ${geoMap[s.deviceId]}` : ''}
                      </Typography>
                      <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block' }}>Last used: {timeAgo(s.lastUsedAt)}</Typography>
                    </>
                  }
                  sx={{ mb: { xs: 1, sm: 0 } }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleRevoke(s.deviceId)}
                    disabled={sessionStatus === 'loading'}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                  >
                    Revoke
                  </Button>
                </Box>
                  </ListItem>
                  <Divider component="li" />
                </div>
              ))}
            </List>
          );
        })()
      )}

      {sessionStatus === 'failed' && (
        <Typography variant="body2" color="error">Failed to load sessions.</Typography>
      )}
      <ConfirmationDialog
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setSelectedSession(null); }}
        onConfirm={handleConfirmRevoke}
        title="Revoke session"
        message={
          selectedSession
            ? (selectedSession.deviceId === currentDeviceId
                ? 'You are revoking the session for this device. You will be signed out on this device. Continue?'
                : `Revoke session for ${selectedSession.userAgent || selectedSession.deviceId}? This will sign out that device.`)
            : 'Revoke this session?'
        }
        variant="delete"
        confirmText="Revoke"
        cancelText="Cancel"
      />
    </Box>
  );
};

export default SessionManager;
