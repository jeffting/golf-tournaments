"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";
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
import Divider from "@mui/material/Divider";
import GoogleIcon from "@mui/icons-material/Google";

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
        // ... existing handleSignUp logic ...
        e.preventDefault();
        setError("");

        if (username) {
            console.warn("Honeypot field filled. Bot detected.");
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                userId: user.uid,
                email: user.email,
                createdAt: new Date().toISOString(),
            });

            if (analytics) {
                logEvent(analytics, "auth_signup", { method: "email" });
            }

            router.push("/");
        } catch (err: any) {
            setError(getAuthErrorMessage(err));
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userDoc = await getDoc(doc(db, "users", user.uid));
            const isNewUser = !userDoc.exists();
            if (isNewUser) {
                await setDoc(doc(db, "users", user.uid), {
                    userId: user.uid,
                    email: user.email,
                    createdAt: new Date().toISOString(),
                });
            }

            if (analytics) {
                logEvent(analytics, isNewUser ? "auth_signup" : "auth_signin", { method: "google" });
            }

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

                        <Box sx={{ my: 2 }}>
                            <Divider>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    OR
                                </Typography>
                            </Divider>
                        </Box>

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<GoogleIcon />}
                            onClick={handleGoogleSignIn}
                            sx={{
                                mb: 2,
                                py: 1.2,
                                color: '#1e293b',
                                borderColor: '#e2e8f0',
                                '&:hover': { bgcolor: '#f8fafc', borderColor: '#cbd5e1' },
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            Continue with Google
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
