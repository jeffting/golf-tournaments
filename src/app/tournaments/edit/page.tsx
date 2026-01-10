"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import TournamentForm from "@/components/TournamentForm";
import { Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Tournament } from "@/types/tournament";

export default function EditTournamentPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/signin");
            return;
        }

        if (id) {
            const fetchTournament = async () => {
                try {
                    const docRef = doc(db, "tournaments", id);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data() as Tournament;
                        // Verify ownership
                        if (user && data.creatorUserId !== user.uid) {
                            alert("You do not have permission to edit this tournament.");
                            router.push("/");
                            return;
                        }
                        setTournament({ id: docSnap.id, ...data });
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
        }
    }, [user, authLoading, router, id]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!tournament) {
        return <div className="p-8 text-center text-white">Tournament not found</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-green-900 to-slate-950 py-12 px-4 shadow-inner">
            <div className="max-w-4xl mx-auto">
                <Button
                    component={Link}
                    href={`/tournaments/view?id=${id}`}
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
                    Back to Details
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
                        Edit Tournament
                    </Typography>
                </Box>
                <TournamentForm initialData={tournament} isEditing={true} tournamentId={id!} />
            </div>
        </div>
    );
}
