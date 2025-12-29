"use client";

import { useEffect, useState, Suspense } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, deleteDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import { Tournament } from "@/types/tournament";
import { Registration } from "@/types/registration";
import Navbar from "@/components/Navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import GroupIcon from '@mui/icons-material/Group';

function TournamentViewContent() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingRegistrations, setLoadingRegistrations] = useState(false);

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

    useEffect(() => {
        const fetchRegistrations = async () => {
            if (!id || !user || !tournament || user.email !== tournament.hostEmail) return;

            setLoadingRegistrations(true);
            try {
                const regsRef = collection(db, "tournaments", id, "registrations");
                // Note: Multiple orderBys might require a composite index.
                // We'll try it, and if it fails, we can sort on the client.
                const q = query(regsRef, orderBy("teamName"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
                setRegistrations(data);
            } catch (e) {
                console.error("Error fetching registrations:", e);
                // If it fails due to index, try a simpler query and sort on client
                try {
                    const simpleQuery = query(collection(db, "tournaments", id, "registrations"));
                    const snap = await getDocs(simpleQuery);
                    const rawData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Registration));
                    const sortedData = [...rawData].sort((a, b) => {
                        const teamCompare = (a.teamName || "").localeCompare(b.teamName || "");
                        if (teamCompare !== 0) return teamCompare;
                        return b.createdAt - a.createdAt;
                    });
                    setRegistrations(sortedData);
                } catch (err) {
                    console.error("Final fallback error:", err);
                }
            } finally {
                setLoadingRegistrations(false);
            }
        };

        fetchRegistrations();
    }, [id, user, tournament]);

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

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Button component={Link} href="/" startIcon={<ArrowBackIcon />}>
                        Back to List
                    </Button>
                    {user && tournament && user.email === tournament.hostEmail && (
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleDelete}
                        >
                            Delete Tournament
                        </Button>
                    )}
                </Box>

                <Paper elevation={0} className="overflow-hidden bg-white border border-slate-200 rounded-lg">

                    <div className="p-6 md:p-8">
                        <Typography variant="h3" component="h1" className="font-bold text-slate-900 mb-4">
                            {tournament.name}
                        </Typography>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            <div className="md:col-span-8">
                                <Typography variant="h6" className="font-semibold text-slate-800 mb-2">
                                    About this Event
                                </Typography>
                                <Typography variant="body1" className="text-slate-600 whitespace-pre-wrap mb-6">
                                    {tournament.description}
                                </Typography>

                                <Typography variant="h6" className="font-semibold text-slate-800 mb-2">
                                    Location
                                </Typography>
                                <Box className="flex items-start gap-2 text-slate-600 mb-4">
                                    <LocationOnIcon color="action" />
                                    <div>
                                        <Typography variant="body1">{tournament.location.street}</Typography>
                                        <Typography variant="body1">
                                            {tournament.location.city}, {tournament.location.state} {tournament.location.zip}
                                        </Typography>
                                    </div>
                                </Box>
                            </div>

                            <div className="md:col-span-4">
                                <Paper variant="outlined" className="p-4 bg-slate-50">
                                    <Typography variant="h6" className="font-semibold text-slate-800 mb-4">
                                        Event Details
                                    </Typography>

                                    <div className="flex items-center gap-3 mb-3 text-slate-700">
                                        <CalendarMonthIcon fontSize="small" />
                                        <Typography>{tournament.date}</Typography>
                                    </div>

                                    <div className="flex items-center gap-3 mb-3 text-slate-700">
                                        <EmailIcon fontSize="small" />
                                        <Typography component="a" href={`mailto:${tournament.hostEmail}`} className="hover:underline hover:text-green-700">
                                            Contact Host
                                        </Typography>
                                    </div>

                                    <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        component={Link}
                                        href={`/tournaments/register?tournamentId=${id}`}
                                        sx={{ mt: 2, bgcolor: '#15803d', '&:hover': { bgcolor: '#166534' } }}
                                    >
                                        Register
                                    </Button>

                                    {tournament.externalUrl && (
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            fullWidth
                                            href={tournament.externalUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ mt: 1 }}
                                        >
                                            Tournament Website
                                        </Button>
                                    )}
                                </Paper>
                            </div>
                        </div>
                    </div>
                </Paper>

                {user && tournament && user.email === tournament.hostEmail && (
                    <Box sx={{ mt: 6 }}>
                        <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <GroupIcon color="primary" />
                            <Typography variant="h5" className="font-bold text-slate-800">
                                Registered Participants
                            </Typography>
                        </Box>

                        <TableContainer component={Paper} elevation={0} variant="outlined">
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ bgcolor: 'slate.50' }}>
                                    <TableRow>
                                        <TableCell className="font-bold">Team Name</TableCell>
                                        <TableCell className="font-bold">Name</TableCell>
                                        <TableCell className="font-bold">Email</TableCell>
                                        <TableCell className="font-bold" align="right">Registered Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {registrations.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                                {loadingRegistrations ? "Loading participants..." : "No participants registered yet."}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        registrations.map((reg) => (
                                            <TableRow
                                                key={reg.id}
                                                sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <Box sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                                        {reg.teamName}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{reg.name}</TableCell>
                                                <TableCell>{reg.email}</TableCell>
                                                <TableCell align="right">
                                                    {new Date(reg.createdAt).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </Container>
        </div>
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
