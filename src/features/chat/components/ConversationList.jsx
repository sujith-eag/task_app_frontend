import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    List, ListItemButton, ListItemAvatar, Avatar,
    ListItemText, Typography, Box, CircularProgress, Alert, 
    TextField, InputAdornment,
} from '@mui/material';
import { getMessages, 
    setActiveConversationId, 
    startConversation, 
    selectAllConversations } from '../chatSlice.js';
import profileService from '../../profile/profileService.js';
import { toast } from 'react-toastify';


const ConversationList = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const conversations = useSelector(selectAllConversations);
  const { status, error, activeConversationId } = useSelector(
    (state) => state.chat
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  
  const handleConversationClick = (conversationId) => {
      dispatch(setActiveConversationId(conversationId)); // Set the active conversation ID
      dispatch(getMessages(conversationId));        // And fetch its messages
  };

  const handleStartConversation = (recipientId) => {
    dispatch(startConversation(recipientId));
    setSearchTerm(''); // Clear search after selection
    setSearchResults([]);
  };

  // Debounced search effect
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true); // Show spinner
      try {
        const users = await profileService.getDiscoverableUsers(user.token);
        setSearchResults(
          users.filter((u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      } catch (err) {
        toast.error('Failed to search for users.');
      }
      setIsSearching(false); // Hide spinner
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, user.token]);

  // --- Helper to render main conversation list ---
  const renderListContent = () => {
    if (status === 'loading') {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            p: 2,
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    if (status === 'failed') {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      );
    }
    if (conversations.length === 0) {
      return (
        <Box sx={{ p: 2 }}>
          <Typography color="text.secondary">
            You have no active conversations yet.
          </Typography>
        </Box>
      );
    }

    // --- Existing Conversations ---
    return (
      <List sx={{ height: '100%', overflowY: 'auto', p: 0 }}>
        {conversations.map((convo) => {
          const otherParticipant = convo.participants.find(
            (p) => p._id !== user._id
          );

          if (!otherParticipant) {
            console.warn(
              'Conversation with malformed participant data found:',
              convo._id
            );
            return null; // skip bad data instead of crashing
          }
      return (
            <ListItemButton
              key={convo._id}
              selected={activeConversationId === convo._id}
              onClick={() => handleConversationClick(convo._id)}
            >
              <ListItemAvatar>
                <Avatar src={otherParticipant.avatar} />
              </ListItemAvatar>
              <ListItemText primary={otherParticipant.name} />
            </ListItemButton>
          );
        })}
      </List>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search users to start a chat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  {isSearching && <CircularProgress size={20} />}
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Search results, otherwise conversation list */}
      {searchResults.length > 0 ? (
        <List sx={{ overflowY: 'auto' }}>
          {searchResults.map((foundUser) => (
            <ListItemButton
              key={foundUser._id}
              onClick={() => handleStartConversation(foundUser._id)}
            >
              <ListItemAvatar>
                <Avatar src={foundUser.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={foundUser.name}
                secondary="Start new conversation"
              />
            </ListItemButton>
          ))}
        </List>
      ) : (
        renderListContent()
      )}
    </Box>
  );
};

export default ConversationList;