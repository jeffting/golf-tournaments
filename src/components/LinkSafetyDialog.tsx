"use client";

import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    Typography
} from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface LinkSafetyDialogProps {
    open: boolean;
    onClose: () => void;
    url: string;
}

export default function LinkSafetyDialog({ open, onClose, url }: LinkSafetyDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { borderRadius: '20px', p: 1 }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                fontFamily: 'var(--font-bebas-neue)',
                fontSize: '2rem',
                color: '#1e293b'
            }}>
                <WarningAmberIcon color="warning" sx={{ fontSize: '2.5rem' }} />
                Safety Check
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2, color: '#475569', fontSize: '1.1rem' }}>
                    You are about to leave Golf Tourney Tracker and visit:
                </DialogContentText>
                <Box sx={{
                    p: 2,
                    bgcolor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    mb: 3,
                    wordBreak: 'break-all'
                }}>
                    <Typography sx={{ color: '#15803d', fontWeight: 600, fontFamily: 'monospace' }}>
                        {url}
                    </Typography>
                </Box>
                <Box sx={{
                    p: 2,
                    bgcolor: '#fff7ed',
                    borderRadius: '12px',
                    border: '1px solid #fed7aa',
                    display: 'flex',
                    gap: 2
                }}>
                    <Typography sx={{ color: '#9a3412', fontSize: '0.95rem', fontWeight: 500 }}>
                        <strong>Security Note:</strong> Always be wary of potential scams. Never share your password or sensitive financial details on a site you don't trust. Ensure the URL matches the official tournament provider.
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button
                    onClick={onClose}
                    sx={{ color: '#64748b', fontWeight: 600 }}
                >
                    Go Back
                </Button>
                <Button
                    variant="contained"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    sx={{
                        bgcolor: '#15803d',
                        px: 4,
                        borderRadius: '10px',
                        fontFamily: 'var(--font-bebas-neue)',
                        fontSize: '1.1rem',
                        '&:hover': { bgcolor: '#14532d' }
                    }}
                >
                    Continue to Website
                </Button>
            </DialogActions>
        </Dialog>
    );
}
