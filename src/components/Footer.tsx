"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: '#1e293b',
                mt: 'auto',
                py: 4,
                color: 'white',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                width: '100%'
            }}
        >
            <Container maxWidth="lg" sx={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button
                    component={Link}
                    href="/about"
                    sx={{
                        color: 'rgba(255,255,255,0.7)',
                        fontFamily: 'var(--font-bebas-neue)',
                        fontSize: '1.2rem',
                        letterSpacing: '0.05em',
                        '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
                    }}
                >
                    About
                </Button>
                <Button
                    component={Link}
                    href="/contact"
                    sx={{
                        color: 'rgba(255,255,255,0.7)',
                        fontFamily: 'var(--font-bebas-neue)',
                        fontSize: '1.2rem',
                        letterSpacing: '0.05em',
                        '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.05)' }
                    }}
                >
                    Contact Us
                </Button>
            </Container>
        </Box>
    );
}
