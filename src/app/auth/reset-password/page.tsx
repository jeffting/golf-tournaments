"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Link from "next/link";
import { getAuthErrorMessage } from "@/lib/auth-errors";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess(true);
            setEmail("");
        } catch (err: any) {
            setError(getAuthErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Paper elevation={3} className="p-8">
                    <Typography variant="h4" component="h1" className="text-center font-bold text-slate-800 mb-6" sx={{ fontFamily: 'var(--font-bebas-neue)', letterSpacing: '0.02em' }}>
                        Reset Password
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>
                        Password reset email sent! Please check your inbox for instructions.
                    </Alert>}

                    {!success ? (
                        <>
                            <Typography variant="body1" color="text.secondary" className="text-center mb-6">
                                Enter your email address and we'll send you a link to reset your password.
                            </Typography>
                            <Box component="form" onSubmit={handleReset} noValidate sx={{ mt: 1 }}>
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
                                    disabled={loading}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        mt: 3,
                                        mb: 2,
                                        bgcolor: '#15803d',
                                        '&:hover': { bgcolor: '#166534' },
                                        fontFamily: 'var(--font-bebas-neue)',
                                        fontSize: '1.2rem',
                                        letterSpacing: '0.05em'
                                    }}
                                >
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </Button>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Button
                                component={Link}
                                href="/auth/signin"
                                fullWidth
                                variant="outlined"
                                sx={{
                                    fontFamily: 'var(--font-bebas-neue)',
                                    fontSize: '1.2rem',
                                    letterSpacing: '0.05em',
                                    color: '#15803d',
                                    borderColor: '#15803d',
                                    '&:hover': { borderColor: '#166534', bgcolor: 'rgba(21, 128, 61, 0.04)' }
                                }}
                            >
                                Back to Sign In
                            </Button>
                        </Box>
                    )}

                    <div className="text-center mt-6">
                        <Link href="/auth/signin" className="text-sm text-green-700 hover:underline">
                            Back to Sign In
                        </Link>
                    </div>
                </Paper>
            </Container>
        </div>
    );
}
