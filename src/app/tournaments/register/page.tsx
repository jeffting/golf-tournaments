"use client";

import { useEffect, useState, Suspense } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, getDocs, runTransaction, query, where } from "firebase/firestore";
import { Tournament } from "@/types/tournament";
import { Team } from "@/types/team";
import Navbar from "@/components/Navbar";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Link from "next/link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const filter = createFilterOptions<TeamOption>();

interface TeamOption {
    id?: string;
    name: string;
    inputValue?: string;
    memberCount?: number;
}

function RegisterFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tournamentId = searchParams.get("tournamentId"); // Matches the 'id' param used in view page

    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [isCreatingNewTeam, setIsCreatingNewTeam] = useState(false);
    const [teamName, setTeamName] = useState("");
    const [teamPassword, setTeamPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);

    useEffect(() => {
        if (!tournamentId) {
            setLoading(false);
            setError("No tournament ID provided.");
            return;
        }

        const fetchTournamentAndTeams = async () => {
            setLoading(true);
            try {
                // Fetch Tournament
                const docRef = doc(db, "tournaments", tournamentId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setTournament({ id: docSnap.id, ...docSnap.data() } as Tournament);

                    // Fetch Teams
                    const teamsRef = collection(db, "tournaments", tournamentId, "teams");
                    const teamsSnap = await getDocs(teamsRef);
                    const teamsList = teamsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
                    setTeams(teamsList);
                } else {
                    setError("Tournament not found. It may have been deleted.");
                }
            } catch (e) {
                console.error("Error fetching tournament and teams:", e);
                setError("Failed to load tournament details.");
            } finally {
                setLoading(false);
            }
        };

        fetchTournamentAndTeams();
    }, [tournamentId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tournamentId || !tournament) return;

        // Basic password validation
        if ((isCreatingNewTeam || selectedTeam) && teamPassword.length < 4) {
            alert("Team password must be at least 4 characters long.");
            return;
        }

        setSubmitting(true);
        try {
            await runTransaction(db, async (transaction) => {
                // Check if email is already registered for this tournament
                // We use the email as the document ID for uniqueness
                const regRef = doc(db, "tournaments", tournamentId, "registrations", formData.email.toLowerCase());
                const regSnap = await transaction.get(regRef);
                if (regSnap.exists()) {
                    throw new Error("This email is already registered for this tournament.");
                }

                let teamIdToUse = null;
                let finalTeamName = "Individual (No Team)";

                if (isCreatingNewTeam) {
                    // New Team - Check maxTeams limit
                    if (teams.length >= (tournament.maxTeams || 100)) {
                        throw new Error(`Tournament has reached the maximum number of teams (${(tournament.maxTeams || 100)}).`);
                    }

                    const teamsRef = collection(db, "tournaments", tournamentId, "teams");
                    const newTeamRef = doc(teamsRef);
                    teamIdToUse = newTeamRef.id;
                    finalTeamName = teamName;

                    transaction.set(newTeamRef, {
                        name: teamName,
                        memberCount: 1,
                        tournamentId,
                        createdAt: Date.now()
                    });

                    // Create the secret document for the team password
                    const secretRef = doc(db, "tournaments", tournamentId, "teams", teamIdToUse, "secrets", "config");
                    transaction.set(secretRef, {
                        password: teamPassword
                    });
                } else if (selectedTeam) {
                    // Joining Existing Team
                    const teamRef = doc(db, "tournaments", tournamentId, "teams", selectedTeam.id!);
                    const teamSnap = await transaction.get(teamRef);

                    if (!teamSnap.exists()) {
                        throw new Error("Team no longer exists.");
                    }

                    const teamData = teamSnap.data() as Team;
                    if (teamData.memberCount >= (tournament.maxPlayersPerTeam || 4)) {
                        throw new Error(`Team "${teamData.name}" is full.`);
                    }

                    // We include the joinPassword in the update so Firestore rules can verify it
                    // The rule will check if this matches the doc in secrets/config
                    transaction.update(teamRef, {
                        memberCount: teamData.memberCount + 1,
                        joinPassword: teamPassword
                    });

                    teamIdToUse = selectedTeam.id;
                    finalTeamName = selectedTeam.name;
                } else {
                    throw new Error("Please select an existing team or create a new one.");
                }

                // Create Registration using email as the document ID
                transaction.set(regRef, {
                    name: formData.name,
                    email: formData.email,
                    tournamentId,
                    teamId: teamIdToUse,
                    teamName: finalTeamName,
                    teamPassword: teamIdToUse ? teamPassword : null, // Used for rule verification
                    createdAt: Date.now()
                });
            });

            alert("Registration successful!");
            router.push(`/tournaments/view?id=${tournamentId}`);
        } catch (e: any) {
            console.error("Error submitting registration:", e);
            if (e.code === 'permission-denied') {
                setPasswordError("Incorrect team password. Please try again.");
            } else {
                alert(e.message || "Failed to register. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Typography>Loading tournament details...</Typography>;
    }

    if (error || !tournament) {
        return (
            <Box textAlign="center" py={4}>
                <Typography color="error" variant="h6" gutterBottom>
                    {error || "Error initializing registration."}
                </Typography>
                <Button component={Link} href="/" startIcon={<ArrowBackIcon />}>
                    Back to Home
                </Button>
            </Box>
        );
    }

    return (
        <Box maxWidth="sm" mx="auto">
            <Box mb={3}>
                <Button
                    component={Link}
                    href={`/tournaments/view?id=${tournamentId}`}
                    startIcon={<ArrowBackIcon />}
                >
                    Back to Tournament
                </Button>
            </Box>

            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom className="font-bold text-slate-800">
                    Register
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Tournament: <strong>{tournament.name}</strong>
                </Typography>

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Your Full Name"
                        required
                        margin="normal"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={submitting}
                    />
                    <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        required
                        margin="normal"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={submitting}
                    />

                    <Box sx={{ mt: 3, mb: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Team Registration
                        </Typography>

                        <Box display="flex" gap={2} mb={3}>
                            <Button
                                variant={!isCreatingNewTeam ? "contained" : "outlined"}
                                color="primary"
                                onClick={() => {
                                    setIsCreatingNewTeam(false);
                                    setTeamPassword("");
                                }}
                                sx={{
                                    flex: 1,
                                    bgcolor: !isCreatingNewTeam ? '#1d4ed8' : 'transparent',
                                    '&:hover': { bgcolor: !isCreatingNewTeam ? '#1e40af' : 'rgba(29, 78, 216, 0.04)' }
                                }}
                            >
                                Join Existing Team
                            </Button>
                            <Button
                                variant={isCreatingNewTeam ? "contained" : "outlined"}
                                color="success"
                                onClick={() => {
                                    setIsCreatingNewTeam(true);
                                    setSelectedTeam(null);
                                    setTeamPassword("");
                                }}
                                sx={{
                                    flex: 1,
                                    bgcolor: isCreatingNewTeam ? '#15803d' : 'transparent',
                                    borderColor: '#15803d',
                                    color: isCreatingNewTeam ? '#fff' : '#15803d',
                                    '&:hover': {
                                        bgcolor: isCreatingNewTeam ? '#166534' : 'rgba(21, 128, 61, 0.04)',
                                        borderColor: '#166534'
                                    }
                                }}
                            >
                                Create New Team
                            </Button>
                        </Box>

                        {/* Join Existing Team UI */}
                        {!isCreatingNewTeam && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Select Team"
                                    value={selectedTeam?.id || ""}
                                    onChange={(e) => {
                                        const team = teams.find(t => t.id === e.target.value);
                                        setSelectedTeam(team || null);
                                    }}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                    disabled={submitting}
                                >
                                    <option value="" disabled>-- Chose from existing teams --</option>
                                    {teams.map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.name} ({team.memberCount} / {tournament.maxPlayersPerTeam})
                                        </option>
                                    ))}
                                </TextField>

                                {selectedTeam && (
                                    <TextField
                                        fullWidth
                                        label="Team Password"
                                        type="password"
                                        required
                                        value={teamPassword}
                                        onChange={(e) => {
                                            setTeamPassword(e.target.value);
                                            setPasswordError(null);
                                        }}
                                        placeholder="Enter team password"
                                        disabled={submitting}
                                        error={!!passwordError}
                                        helperText={passwordError}
                                    />
                                )}
                            </Box>
                        )}

                        {/* Create New Team UI */}
                        {isCreatingNewTeam && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="New Team Name"
                                    required
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    disabled={submitting}
                                />
                                <TextField
                                    fullWidth
                                    label="Set Team Password"
                                    type="password"
                                    required
                                    value={teamPassword}
                                    onChange={(e) => {
                                        setTeamPassword(e.target.value);
                                        setPasswordError(null);
                                    }}
                                    helperText={passwordError || "At least 4 characters. Share this with teammates."}
                                    error={!!passwordError}
                                    disabled={submitting}
                                />
                            </Box>
                        )}
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        disabled={!!(submitting || (isCreatingNewTeam && !teamName) || (!isCreatingNewTeam && selectedTeam && !teamPassword))}
                        sx={{ mt: 3, bgcolor: '#15803d', '&:hover': { bgcolor: '#166534' } }}
                    >
                        {submitting ? "Submitting..." : "Submit Registration"}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Suspense fallback={<Typography>Loading...</Typography>}>
                    <RegisterFormContent />
                </Suspense>
            </Container>
        </div>
    );
}
