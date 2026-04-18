"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import EmailIcon from '@mui/icons-material/Email';
import BugReportIcon from '@mui/icons-material/BugReport';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { Tooltip } from "@mui/material";

import { logAppError } from "@/lib/errorLogger";

export default function ContactClient() {
    const [copied, setCopied] = useState(false);
    const email = "golftourneytrackerservice@gmail.com";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            logAppError("Failed to copy email", err);
        }
    };
    return (
        <div className="flex-grow flex flex-col bg-slate-50">
            <Navbar />

            <Container maxWidth="md" sx={{ pb: 12, mt: 8 }}>
                <Paper elevation={0} sx={{ p: { xs: 4, md: 8 }, borderRadius: '32px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <Box sx={{ bgcolor: '#f0fdf4', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 4 }}>
                        <EmailIcon sx={{ fontSize: 40, color: '#15803d' }} />
                    </Box>
                    <Typography
                        variant="h3"
                        sx={{
                            fontFamily: 'var(--font-bebas-neue)',
                            color: '#1e293b',
                            mb: 2
                        }}
                    >
                        Get In Touch
                    </Typography>
                    <Typography sx={{ fontSize: '1.2rem', color: '#475569', mb: 6 }}>
                        The best way to reach us is via email at:
                    </Typography>

                    <Tooltip title={copied ? "Copied!" : "Click to copy"} arrow>
                        <Box
                            onClick={handleCopy}
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 2,
                                fontWeight: 700,
                                color: copied ? '#059669' : '#15803d',
                                cursor: 'pointer',
                                bgcolor: copied ? '#ecfdf5' : '#f0fdf4',
                                px: 4,
                                py: 2,
                                borderRadius: '16px',
                                border: '2px solid',
                                borderColor: copied ? '#10b981' : '#dcfce7',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(21, 128, 61, 0.1)',
                                    bgcolor: copied ? '#ecfdf5' : '#dcfce7'
                                },
                                mb: 8,
                                whiteSpace: 'nowrap',
                                maxWidth: '100%',
                                fontSize: { xs: '0.7rem', sm: '1rem', md: '1.5rem' },
                            }}
                        >
                            <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {email}
                            </Box>
                            {copied ? <CheckIcon fontSize="large" sx={{ flexShrink: 0 }} /> : <ContentCopyIcon fontSize="large" sx={{ flexShrink: 0 }} />}
                        </Box>
                    </Tooltip>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, textAlign: 'left' }}>
                        <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                                <BugReportIcon sx={{ color: '#ef4444' }} />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Bugs & Issues</Typography>
                            </Box>
                            <Typography color="text.secondary">
                                Found a glitch? Let us know and we'll fix it faster than a three-putt.
                            </Typography>
                        </Box>
                        <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                                <LightbulbIcon sx={{ color: '#eab308' }} />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Feature Requests</Typography>
                            </Box>
                            <Typography color="text.secondary">
                                Have an idea to make the tracker better? We love hearing suggestions from the community.
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </div>
    );
}
