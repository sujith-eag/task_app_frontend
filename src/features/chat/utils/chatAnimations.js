/**
 * Framer Motion animation variants for chat components
 */

// Message bubble fade-in animation
export const messageBubbleVariants = {
    hidden: { 
        opacity: 0, 
        y: 20,
        scale: 0.95
    },
    visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

// Conversation item hover animation
export const conversationItemVariants = {
    hover: {
        x: 4,
        transition: {
            duration: 0.2,
            ease: "easeInOut"
        }
    }
};

// Typing indicator dots animation
export const typingDotVariants = {
    initial: { y: 0 },
    animate: { 
        y: [0, -8, 0],
        transition: {
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Stagger animation for conversation list
export const conversationListVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

export const conversationItemStagger = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
        opacity: 1, 
        x: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

// Date separator slide-in animation
export const dateSeparatorVariants = {
    hidden: { 
        opacity: 0,
        scale: 0.9
    },
    visible: { 
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
};

// Empty state animation
export const emptyStateVariants = {
    hidden: { 
        opacity: 0,
        y: 30
    },
    visible: { 
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

// Send button pulse animation
export const sendButtonVariants = {
    idle: { scale: 1 },
    hover: { 
        scale: 1.1,
        transition: {
            duration: 0.2,
            ease: "easeInOut"
        }
    },
    tap: { 
        scale: 0.95,
        transition: {
            duration: 0.1
        }
    }
};

// Badge pop animation
export const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
        scale: 1, 
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 25
        }
    }
};

// Online indicator pulse
export const onlineIndicatorVariants = {
    pulse: {
        scale: [1, 1.2, 1],
        opacity: [1, 0.8, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};
