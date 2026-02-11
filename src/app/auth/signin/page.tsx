"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
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

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        try {
            await signInWithEmailAndPassword(auth, email, password);
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

            // Check if user document exists in Firestore, if not create it
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, "users", user.uid), {
                    userId: user.uid,
                    email: user.email,
                    createdAt: new Date().toISOString(),
                });
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
                        Sign In
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <Box component="form" onSubmit={handleSignIn} noValidate sx={{ mt: 1 }}>
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
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Link href="/auth/reset-password" target="_self" className="text-sm text-green-700 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, bgcolor: '#15803d', '&:hover': { bgcolor: '#166534' } }}
                        >
                            Sign In
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
                            <Link href="/auth/signup" className="text-sm text-green-700 hover:underline">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </div>
                    </Box>
                </Paper>
            </Container>
        </div>
    );
}
