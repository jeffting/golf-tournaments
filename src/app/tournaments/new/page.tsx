"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import TournamentForm from "@/components/TournamentForm";
import { Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from "next/link";

export default function CreateTournamentPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/signin");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-green-900 to-slate-950 py-12 px-4 shadow-inner">
            <div className="max-w-4xl mx-auto">
                <Button
                    component={Link}
                    href="/"
                    startIcon={<ArrowBackIcon />}
                    sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        mb: 4,
                        fontFamily: 'var(--font-bebas-neue)',
                        fontSize: '1.1rem',
                        letterSpacing: '0.05em',
                        '&:hover': { color: 'white', bgcolor: 'rgba(255, 255, 255, 0.1)' }
                    }}
                >
                    Back to Tournaments
                </Button>
                <Box sx={{ mb: 6, textAlign: 'center' }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontFamily: 'var(--font-bebas-neue)',
                            color: 'white',
                            fontSize: { xs: '3.5rem', md: '5rem' },
                            textShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            mb: 1
                        }}
                    >
                        Host a Tournament
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '1.2rem',
                            fontWeight: 400
                        }}
                    >
                        Fill out the details below to list your event
                    </Typography>
                </Box>
                <TournamentForm />
            </div>
        </div>
    );
}
