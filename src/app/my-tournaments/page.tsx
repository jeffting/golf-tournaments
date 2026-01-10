"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import TournamentCard from "@/components/TournamentCard";
import { useAuth } from "@/context/AuthContext";
import { Tournament } from "@/types/tournament";
import { Container, Typography, Grid, Box, CircularProgress, Button } from "@mui/material";
import Link from 'next/link';

export default function MyTournamentsPage() {
    const { user } = useAuth();
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserTournaments = async () => {
            if (!user) return;

            setLoading(true);
            try {
                // Query tournaments created by the current user
                const tournamentsRef = collection(db, "tournaments");
                const q = query(
                    tournamentsRef,
                    where("creatorUserId", "==", user.uid)
                    // Note: 'date' ordering requires a composite index with 'creatorUserId'
                    // Failing that, we can sort client-side for now to avoid index creation delay
                );

                const querySnapshot = await getDocs(q);
                const tournamentData: Tournament[] = [];
                querySnapshot.forEach((doc) => {
                    tournamentData.push({ id: doc.id, ...doc.data() } as Tournament);
                });

                // Client-side sort by date descending (newest first)
                tournamentData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setTournaments(tournamentData);
            } catch (error) {
                console.error("Error fetching tournaments:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchUserTournaments();
        } else {
            setLoading(false); // Not logged in
        }
    }, [user]);

    if (!user && !loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
                    <Typography variant="h4" gutterBottom>Please Sign In</Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        You need to be logged in to view your tournaments.
                    </Typography>
                    <Button variant="contained" component={Link} href="/auth/signin">Sign In</Button>
                </Container>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Box sx={{ mb: 6 }}>
                    <Typography
                        variant="div"
                        component="h1"
                        sx={{
                            fontFamily: 'var(--font-bebas-neue)',
                            fontSize: '4rem',
                            color: '#1e293b',
                            lineHeight: 1
                        }}
                    >
                        My Tournaments
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1, fontSize: '1.2rem' }}>
                        Manage the tournaments you are hosting.
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : tournaments.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8, bgcolor: 'white', borderRadius: 4, border: '1px dashed #cbd5e1' }}>
                        <Typography variant="h5" color="text.secondary" gutterBottom>
                            No tournaments found
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            You haven't created any tournaments yet.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            component={Link}
                            href="/tournaments/new"
                            sx={{ bgcolor: '#15803d', '&:hover': { bgcolor: '#14532d' } }}
                        >
                            Create Your First Tournament
                        </Button>
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {tournaments.map((tournament) => (
                            <Grid item key={tournament.id} xs={12} sm={6} md={4} lg={3}>
                                <TournamentCard tournament={tournament} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </div>
    );
}
