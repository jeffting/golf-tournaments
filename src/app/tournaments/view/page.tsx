"use client";

import { useEffect, useState, Suspense } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { Tournament } from "@/types/tournament";
import Navbar from "@/components/Navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';


function TournamentViewContent() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState(true);
    const [openLinkDialog, setOpenLinkDialog] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchTournament = async () => {
            setLoading(true);
            try {
                const docRef = doc(db, "tournaments", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setTournament({ id: docSnap.id, ...docSnap.data() } as Tournament);
                } else {
                    console.log("No such document!");
                }
            } catch (e) {
                console.error("Error fetching tournament:", e);
            } finally {
                setLoading(false);
            }
        };

        fetchTournament();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;
        if (!confirm("Are you sure you want to delete this tournament? This action cannot be undone.")) return;

        try {
            await deleteDoc(doc(db, "tournaments", id));
            router.push("/");
        } catch (error) {
            console.error("Error deleting tournament:", error);
            alert("Failed to delete tournament.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <Container sx={{ py: 4 }}>
                    <Typography>Loading details...</Typography>
                </Container>
            </div>
        );
    }

    if (!tournament) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <Container sx={{ py: 4 }}>
                    <Typography>Tournament not found.</Typography>
                    <Button component={Link} href="/" startIcon={<ArrowBackIcon />} sx={{ mt: 2 }}>
                        Back to Home
                    </Button>
                </Container>
            </div>
        );
    }

    const isHost = user && tournament && user.uid === tournament.creatorUserId;

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />

            {/* Hero Section */}
            <Box sx={{
                width: '100%',
                background: 'linear-gradient(135deg, #2c9553ff 0%, #0b2f19ff 100%)',
                pt: { xs: 8, md: 12 },
                pb: { xs: 10, md: 16 },
                color: 'white',
                position: 'relative',
                mb: -6
            }}>
                <Container maxWidth="lg">
                    <Button
                        component={Link}
                        href="/"
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            mb: 4,
                            '&:hover': { color: 'white', bgcolor: 'rgba(255, 255, 255, 0.1)' }
                        }}
                    >
                        Back to Tournaments
                    </Button>

                    <Typography
                        variant="h1"
                        sx={{
                            fontFamily: 'var(--font-bebas-neue)',
                            fontSize: { xs: '3.5rem', md: '6rem' },
                            lineHeight: 0.9,
                            mb: 2,
                            textShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}
                    >
                        {tournament.tournamentName}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CalendarMonthIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                            <Typography sx={{ fontSize: '1.2rem', fontWeight: 500 }}>
                                {tournament.date.split('-')[1]}-{tournament.date.split('-')[2]}-{tournament.date.split('-')[0]}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOnIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                            <Typography sx={{ fontSize: '1.2rem', fontWeight: 500 }}>
                                {tournament.location.city}, {tournament.location.state}
                            </Typography>
                        </Box>
                        {isHost && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                startIcon={<DeleteIcon />}
                                onClick={handleDelete}
                                sx={{
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.2)', borderColor: '#ef4444' }
                                }}
                            >
                                Delete
                            </Button>
                        )}
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ pb: 10, position: 'relative', zIndex: 1 }}>
                <Grid container spacing={4}>
                    {/* Main Content */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 4, md: 6 },
                                borderRadius: '24px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)'
                            }}
                        >
                            <Box sx={{ mb: 6 }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontFamily: 'var(--font-bebas-neue)',
                                        color: '#1e293b',
                                        mb: 3,
                                        letterSpacing: '0.02em'
                                    }}
                                >
                                    Course & Location
                                </Typography>

                                <Box
                                    component="a"
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${tournament.courseName} ${tournament.location.street} ${tournament.location.city} ${tournament.location.state} ${tournament.location.zip}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 3,
                                        p: 3,
                                        bgcolor: '#f8fafc',
                                        borderRadius: '16px',
                                        border: '1px solid #f1f5f9',
                                        mb: 4,
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            bgcolor: '#f1f5f9',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                            borderColor: '#e2e8f0'
                                        }
                                    }}
                                >
                                    <Box sx={{
                                        bgcolor: '#15803d',
                                        p: 2,
                                        borderRadius: '12px',
                                        display: 'flex',
                                        color: 'white'
                                    }}>
                                        <GolfCourseIcon fontSize="large" />
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                            {tournament.courseName}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {tournament.location.street}, {tournament.location.city}, {tournament.location.state} {tournament.location.zip}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontFamily: 'var(--font-bebas-neue)',
                                        color: '#1e293b',
                                        mb: 3,
                                        letterSpacing: '0.02em'
                                    }}
                                >
                                    Description
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: '#475569',
                                        lineHeight: 1.8,
                                        fontSize: '1.1rem',
                                        whiteSpace: 'pre-wrap'
                                    }}
                                >
                                    {tournament.description}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Sidebar */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ position: 'sticky', top: 24 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: '24px',
                                    bgcolor: '#1e293b',
                                    color: 'white',
                                    mb: 4,
                                    border: '1px solid #334155'
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontFamily: 'var(--font-bebas-neue)',
                                        mb: 4,
                                        letterSpacing: '0.05em'
                                    }}
                                >
                                    Contact & Links
                                </Typography>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', p: 1, borderRadius: '8px' }}>
                                            <EmailIcon sx={{ color: '#10b981' }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                                Inquiries
                                            </Typography>
                                            <Typography sx={{ fontWeight: 600 }}>{tournament.contactEmail}</Typography>
                                        </Box>
                                    </Box>

                                    {tournament.externalUrl && (
                                        <>
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                onClick={() => setOpenLinkDialog(true)}
                                                sx={{
                                                    bgcolor: '#10b981',
                                                    py: 2,
                                                    borderRadius: '12px',
                                                    fontFamily: 'var(--font-bebas-neue)',
                                                    fontSize: '1.2rem',
                                                    letterSpacing: '0.05em',
                                                    '&:hover': { bgcolor: '#059669' }
                                                }}
                                            >
                                                Visit Tournament Website
                                            </Button>

                                            <Dialog
                                                open={openLinkDialog}
                                                onClose={() => setOpenLinkDialog(false)}
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
                                                            {tournament.externalUrl}
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
                                                        onClick={() => setOpenLinkDialog(false)}
                                                        sx={{ color: '#64748b', fontWeight: 600 }}
                                                    >
                                                        Go Back
                                                    </Button>
                                                    <Button
                                                        variant="contained"
                                                        href={tournament.externalUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={() => setOpenLinkDialog(false)}
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
                                        </>
                                    )}

                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        href={`mailto:${tournament.contactEmail}`}
                                        sx={{
                                            color: 'white',
                                            borderColor: 'rgba(255, 255, 255, 0.2)',
                                            py: 1.5,
                                            borderRadius: '12px',
                                            '&:hover': { borderColor: 'white', bgcolor: 'rgba(255, 255, 255, 0.05)' },
                                            display: { xs: 'flex', md: 'none' }
                                        }}
                                    >
                                        Email Organizer
                                    </Button>
                                </Box>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </div >
    );
}

export default function TournamentViewPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <Container sx={{ py: 4 }}>
                    <Typography>Loading...</Typography>
                </Container>
            </div>
        }>
            <TournamentViewContent />
        </Suspense>
    );
}
