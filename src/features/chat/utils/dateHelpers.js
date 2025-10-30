import { formatDistanceToNow, format, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns';

/**
 * Format a date for conversation list timestamps
 * Shows: "5m ago", "2h ago", "Yesterday", "Jan 15"
 */
export const formatConversationTime = (date) => {
    if (!date) return '';
    
    const messageDate = new Date(date);
    
    if (isToday(messageDate)) {
        return formatDistanceToNow(messageDate, { addSuffix: true })
            .replace('about ', '')
            .replace('less than a minute ago', 'just now')
            .replace(' minutes', 'm')
            .replace(' minute', 'm')
            .replace(' hours', 'h')
            .replace(' hour', 'h')
            .replace(' ago', '');
    }
    
    if (isYesterday(messageDate)) {
        return 'Yesterday';
    }
    
    if (isThisWeek(messageDate)) {
        return format(messageDate, 'EEEE'); // "Monday", "Tuesday", etc.
    }
    
    if (isThisYear(messageDate)) {
        return format(messageDate, 'MMM d'); // "Jan 15"
    }
    
    return format(messageDate, 'MMM d, yyyy'); // "Jan 15, 2024"
};

/**
 * Format a date for message timestamps (hover tooltip)
 * Shows full date and time: "Jan 15, 2024 at 3:45 PM"
 */
export const formatMessageTimeFull = (date) => {
    if (!date) return '';
    return format(new Date(date), 'MMM d, yyyy \'at\' h:mm a');
};

/**
 * Format time only for message bubbles
 * Shows: "3:45 PM"
 */
export const formatMessageTime = (date) => {
    if (!date) return '';
    return format(new Date(date), 'h:mm a');
};

/**
 * Get date separator label
 * Shows: "Today", "Yesterday", "January 15, 2024"
 */
export const getDateSeparatorLabel = (date) => {
    if (!date) return '';
    
    const messageDate = new Date(date);
    
    if (isToday(messageDate)) {
        return 'Today';
    }
    
    if (isYesterday(messageDate)) {
        return 'Yesterday';
    }
    
    if (isThisYear(messageDate)) {
        return format(messageDate, 'MMMM d'); // "January 15"
    }
    
    return format(messageDate, 'MMMM d, yyyy'); // "January 15, 2024"
};

/**
 * Check if two dates are on the same day
 */
export const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};

/**
 * Check if messages should be grouped (same sender, within 5 minutes)
 */
export const shouldGroupMessages = (msg1, msg2) => {
    if (!msg1 || !msg2) return false;
    
    // Different senders = don't group
    if (msg1.sender._id !== msg2.sender._id) return false;
    
    // Different days = don't group
    if (!isSameDay(msg1.createdAt, msg2.createdAt)) return false;
    
    // More than 5 minutes apart = don't group
    const timeDiff = Math.abs(new Date(msg2.createdAt) - new Date(msg1.createdAt));
    const fiveMinutes = 5 * 60 * 1000;
    
    return timeDiff < fiveMinutes;
};
