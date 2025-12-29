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

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // 1. Create user in Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update profile with display name
            await updateProfile(user, {
                displayName: displayName
            });

            // 3. Create user document in Firestore
            await setDoc(doc(db, "users", user.uid), {
                userId: user.uid,
                email: user.email,
                displayName: displayName,
            });

            router.push("/");
        } catch (err: any) {
            setError(err.message || "Failed to sign up");
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
                            id="displayName"
                            label="Display Name"
                            name="displayName"
                            autoComplete="name"
                            autoFocus
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
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
                        />
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
