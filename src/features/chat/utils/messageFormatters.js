import { isSameDay, shouldGroupMessages } from './dateHelpers.js';

/**
 * Group messages by date for date separators
 * Returns array of { date, messages } objects
 */
export const groupMessagesByDate = (messages) => {
    if (!messages || messages.length === 0) return [];
    
    const grouped = [];
    let currentGroup = null;
    
    messages.forEach((message) => {
        const messageDate = new Date(message.createdAt).toDateString();
        
        if (!currentGroup || currentGroup.date !== messageDate) {
            currentGroup = {
                date: messageDate,
                dateObj: new Date(message.createdAt),
                messages: []
            };
            grouped.push(currentGroup);
        }
        
        currentGroup.messages.push(message);
    });
    
    return grouped;
};

/**
 * Add grouping metadata to messages
 * Marks first/last in group for styling
 */
export const addMessageGrouping = (messages) => {
    if (!messages || messages.length === 0) return [];
    
    return messages.map((msg, index) => {
        const prevMsg = index > 0 ? messages[index - 1] : null;
        const nextMsg = index < messages.length - 1 ? messages[index + 1] : null;
        
        const groupedWithPrev = prevMsg && shouldGroupMessages(prevMsg, msg);
        const groupedWithNext = nextMsg && shouldGroupMessages(msg, nextMsg);
        
        return {
            ...msg,
            isFirstInGroup: !groupedWithPrev,
            isLastInGroup: !groupedWithNext,
            showAvatar: !groupedWithNext, // Only show avatar on last message in group
            showTimestamp: !groupedWithNext, // Only show timestamp on last message in group
        };
    });
};

/**
 * Truncate message content for preview
 */
export const truncateMessage = (content, maxLength = 50) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
};

/**
 * Get message status icon
 */
export const getMessageStatusIcon = (status) => {
    switch (status) {
        case 'sending':
            return '○'; // Empty circle
        case 'sent':
            return '✓'; // Single check
        case 'delivered':
            return '✓✓'; // Double check
        case 'read':
            return '✓✓'; // Double check (will be colored blue in UI)
        default:
            return '';
    }
};

/**
 * Count unread messages in a conversation
 */
export const getUnreadCount = (messages, userId) => {
    if (!messages || !userId) return 0;
    
    return messages.filter(msg => 
        msg.sender._id !== userId && msg.status !== 'read'
    ).length;
};
