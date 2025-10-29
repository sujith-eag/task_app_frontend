import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Box,
    TextField,
    Typography,
    CircularProgress,
    Alert,
    IconButton,
} from '@mui/material';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

/**
 * Enhanced ConfirmationDialog Component
 * 
 * @param {boolean} open - Controls dialog visibility
 * @param {function} onClose - Callback when dialog is closed
 * @param {function} onConfirm - Callback when confirmed (async supported)
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {string} variant - Dialog type: 'success' | 'warning' | 'error' | 'info' | 'delete' (default: 'warning')
 * @param {string} confirmText - Custom confirm button text (default: 'Confirm')
 * @param {string} cancelText - Custom cancel button text (default: 'Cancel')
 * @param {boolean} showIcon - Show variant icon (default: true)
 * @param {boolean} requireConfirmation - Require text input to confirm (default: false)
 * @param {string} confirmationText - Text that must be typed to confirm (default: 'CONFIRM')
 * @param {number} countdown - Countdown timer before confirm button enables (seconds, default: 0)
 * @param {boolean} loading - Show loading state (default: false)
 * @param {string} loadingText - Text to show during loading (default: 'Processing...')
 * @param {string} maxWidth - Dialog max width: 'xs' | 'sm' | 'md' | 'lg' | 'xl' (default: 'sm')
 * @param {boolean} disableBackdropClick - Prevent closing on backdrop click (default: false)
 * @param {node} children - Custom content to replace message
 */
const ConfirmationDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    variant = 'warning',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    showIcon = true,
    requireConfirmation = false,
    confirmationText = 'CONFIRM',
    countdown = 0,
    loading = false,
    loadingText = 'Processing...',
    maxWidth = 'sm',
    disableBackdropClick = false,
    children,
}) => {
    const [confirmInput, setConfirmInput] = useState('');
    const [countdownValue, setCountdownValue] = useState(countdown);
    const [isProcessing, setIsProcessing] = useState(false);

    // Reset state when dialog opens
    useEffect(() => {
        if (open) {
            setConfirmInput('');
            setCountdownValue(countdown);
            setIsProcessing(false);
        }
    }, [open, countdown]);

    // Countdown timer
    useEffect(() => {
        if (open && countdownValue > 0) {
            const timer = setTimeout(() => {
                setCountdownValue((prev) => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [open, countdownValue]);

    // Get variant configuration
    const getVariantConfig = () => {
        switch (variant) {
            case 'success':
                return {
                    color: 'success',
                    icon: CheckCircleOutlineIcon,
                    iconColor: 'success.main',
                    confirmColor: 'success',
                };
            case 'error':
                return {
                    color: 'error',
                    icon: ErrorOutlineIcon,
                    iconColor: 'error.main',
                    confirmColor: 'error',
                };
            case 'warning':
                return {
                    color: 'warning',
                    icon: WarningAmberIcon,
                    iconColor: 'warning.main',
                    confirmColor: 'warning',
                };
            case 'info':
                return {
                    color: 'info',
                    icon: InfoOutlinedIcon,
                    iconColor: 'info.main',
                    confirmColor: 'info',
                };
            case 'delete':
                return {
                    color: 'error',
                    icon: DeleteOutlineIcon,
                    iconColor: 'error.main',
                    confirmColor: 'error',
                };
            default:
                return {
                    color: 'warning',
                    icon: WarningAmberIcon,
                    iconColor: 'warning.main',
                    confirmColor: 'warning',
                };
        }
    };

    const config = getVariantConfig();
    const IconComponent = config.icon;

    // Check if confirm button should be disabled
    const isConfirmDisabled = () => {
        if (isProcessing || loading) return true;
        if (countdownValue > 0) return true;
        if (requireConfirmation && confirmInput !== confirmationText) return true;
        return false;
    };

    // Handle confirm with async support
    const handleConfirm = async () => {
        if (isConfirmDisabled()) return;

        setIsProcessing(true);
        try {
            // Check if onConfirm is async
            const result = onConfirm();
            if (result instanceof Promise) {
                await result;
            }
        } catch (error) {
            console.error('Confirmation action failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Handle backdrop click
    const handleBackdropClick = (event, reason) => {
        if (disableBackdropClick && reason === 'backdropClick') {
            return;
        }
        if (!isProcessing && !loading) {
            onClose();
        }
    };

    // Get confirm button text with countdown
    const getConfirmButtonText = () => {
        if (isProcessing || loading) return loadingText;
        if (countdownValue > 0) return `${confirmText} (${countdownValue}s)`;
        return confirmText;
    };

    return (
        <Dialog
            open={open}
            onClose={handleBackdropClick}
            maxWidth={maxWidth}
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    boxShadow: (theme) =>
                        theme.palette.mode === 'dark'
                            ? '0 16px 48px rgba(0, 0, 0, 0.7)'
                            : '0 16px 48px rgba(0, 0, 0, 0.15)',
                },
            }}
        >
            {/* Dialog Title with Icon and Close Button */}
            <DialogTitle
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    pb: 2,
                    pr: 6,
                }}
            >
                {showIcon && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: (theme) =>
                                theme.palette.mode === 'dark'
                                    ? `${config.color}.dark`
                                    : `${config.color}.light`,
                            color: config.iconColor,
                        }}
                    >
                        <IconComponent sx={{ fontSize: 24 }} />
                    </Box>
                )}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    disabled={isProcessing || loading}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'text.secondary',
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* Dialog Content */}
            <DialogContent sx={{ pb: 2 }}>
                {children ? (
                    <Box>{children}</Box>
                ) : (
                    <DialogContentText
                        sx={{
                            color: 'text.primary',
                            fontSize: '0.95rem',
                            lineHeight: 1.6,
                        }}
                    >
                        {message}
                    </DialogContentText>
                )}

                {/* Confirmation Input Field */}
                {requireConfirmation && (
                    <Box sx={{ mt: 3 }}>
                        <Alert severity={config.color} sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                Type <strong>{confirmationText}</strong> to confirm this action.
                            </Typography>
                        </Alert>
                        <TextField
                            fullWidth
                            placeholder={`Type "${confirmationText}" to confirm`}
                            value={confirmInput}
                            onChange={(e) => setConfirmInput(e.target.value)}
                            disabled={isProcessing || loading}
                            autoComplete="off"
                            variant="outlined"
                            size="small"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    fontFamily: 'monospace',
                                },
                            }}
                        />
                    </Box>
                )}

                {/* Countdown Warning */}
                {countdown > 0 && countdownValue > 0 && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            Please wait {countdownValue} second{countdownValue !== 1 ? 's' : ''} before confirming...
                        </Typography>
                    </Alert>
                )}
            </DialogContent>

            {/* Dialog Actions */}
            <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                <Button
                    onClick={onClose}
                    disabled={isProcessing || loading}
                    variant="outlined"
                    color="inherit"
                    sx={{
                        minWidth: 100,
                        textTransform: 'none',
                    }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={isConfirmDisabled()}
                    variant="contained"
                    color={config.confirmColor}
                    startIcon={
                        isProcessing || loading ? (
                            <CircularProgress size={16} color="inherit" />
                        ) : null
                    }
                    sx={{
                        minWidth: 120,
                        textTransform: 'none',
                    }}
                >
                    {getConfirmButtonText()}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;