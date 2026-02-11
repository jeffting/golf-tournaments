"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

import { getAuthErrorMessage } from "@/lib/auth-errors";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(""); // Honeypot field
    const [error, setError] = useState("");
    const router = useRouter();

    const validatePassword = (password: string): string | null => {
        if (password.length < 6) {
            return "Password must be at least 6 characters long";
        }
        return null;
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Honeypot check: If the hidden 'username' field is filled, it's likely a bot.
        if (username) {
            console.warn("Honeypot field filled. Bot detected.");
            // We return early without showing a specific error to the bot, 
            // but for UX we might want to redirect to a fake success or just stay silent.
            // For now, we'll just stop the process.
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        try {
            // 1. Create user in Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Create user document in Firestore (No longer using updateProfile)
            await setDoc(doc(db, "users", user.uid), {
                userId: user.uid,
                email: user.email,
            });

            router.push("/");
        } catch (err: any) {
            setError(getAuthErrorMessage(err));
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Paper elevation={3} className="p-8">
                    <Typography variant="h4" component="h1" className="text-center font-bold text-slate-800 mb-6">
                        Sign Up
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSignUp} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            helperText="Must be at least 6 characters"
                        />

                        {/* Honeypot field - hidden from users but attractive to bots */}
                        <div style={{ display: 'none' }} aria-hidden="true">
                            <TextField
                                name="username"
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="off"
                                tabIndex={-1}
                            />
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, bgcolor: '#15803d', '&:hover': { bgcolor: '#166534' } }}
                        >
                            Sign Up
                        </Button>
                        <div className="text-center mt-4">
                            <Link href="/auth/signin" className="text-sm text-green-700 hover:underline">
                                {"Already have an account? Sign In"}
                            </Link>
                        </div>
                    </Box>
                </Paper>
            </Container>
        </div>
    );
}
