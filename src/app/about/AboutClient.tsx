"use client";

import Navbar from "@/components/Navbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Link from "next/link";
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';

export default function AboutClient() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <Box sx={{
                background: 'linear-gradient(to bottom, #14532d 0%, #267746ff 50%, #011d0cff 100%)',
                color: 'white',
                pt: { xs: 8, md: 12 },
                pb: { xs: 8, md: 12 },
                mb: 8
            }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h1"
                        component="h1"
                        sx={{
                            fontFamily: 'var(--font-bebas-neue)',
                            fontSize: { xs: '3rem', md: '5rem' },
                            mb: 3,
                            lineHeight: 0.9
                        }}
                    >
                        Connecting Golfers <br /> with Local Tournaments
                    </Typography>
                    <Typography variant="h5" sx={{ maxWidth: '800px', opacity: 0.9, lineHeight: 1.6 }}>
                        Anyone can list a tournament for free. This is the easiest way to find and list local golf events. From charity scrambles to competitive stroke play, find your next tee time here.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ pb: 12 }}>

                {/* Mission Section */}
                <Grid container spacing={6} sx={{ mb: 12 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography
                            variant="h3"
                            component="h2"
                            sx={{
                                fontFamily: 'var(--font-bebas-neue)',
                                color: '#1e293b',
                                mb: 3
                            }}
                        >
                            Our Mission
                        </Typography>
                        <Typography paragraph sx={{ fontSize: '1.1rem', color: '#475569', mb: 3 }}>
                            Golf Tourney Tracker was built to solve a simple problem: finding local golf tournaments shouldn't be hard. Whether you're a tournament director trying to fill your field or a player looking for a weekend scramble, we provide a centralized hub for the local golf community.
                        </Typography>
                        <Typography paragraph sx={{ fontSize: '1.1rem', color: '#475569' }}>
                            We currently focus on the vibrant golf scenes in <strong>Utah</strong> and <strong>Arizona</strong>, bringing visibility to events that might otherwise get lost in email chains and clubhouse flyers.
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper elevation={0} sx={{ p: 4, bgcolor: '#f0fdf4', borderRadius: '24px', border: '1px solid #dcfce7' }}>
                            <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'flex-start' }}>
                                <GolfCourseIcon sx={{ fontSize: 40, color: '#15803d' }} />
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>For Players</Typography>
                                    <Typography color="text.secondary">
                                        Discover new courses and competitive opportunities. Filter by date, location, and format to find the perfect event for your foursome.
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                <GroupsIcon sx={{ fontSize: 40, color: '#15803d' }} />
                                <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>For Directors</Typography>
                                    <Typography color="text.secondary">
                                        List your tournament for free. Reach a targeted audience of local golfers and fill your spots faster with a professional event listing.
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Features / SEO Content */}
                <Box sx={{ mb: 12 }}>
                    <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                            fontFamily: 'var(--font-bebas-neue)',
                            color: '#1e293b',
                            mb: 6,
                            textAlign: 'center'
                        }}
                    >
                        Why Use Golf Tourney Tracker?
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                <Box sx={{ bgcolor: '#eff6ff', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                                    <EmojiEventsIcon sx={{ fontSize: 32, color: '#2563eb' }} />
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Competitive & Fun</Typography>
                                <Typography color="text.secondary">
                                    From high-stakes championships to fun charity scrambles, we host a wide variety of formats for every skill level.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                <Box sx={{ bgcolor: '#fef3c7', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                                    <GolfCourseIcon sx={{ fontSize: 32, color: '#d97706' }} />
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Top Courses</Typography>
                                <Typography color="text.secondary">
                                    Find events hosted at some of the best public and private courses across the country.
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Paper elevation={0} sx={{ p: 4, height: '100%', borderRadius: '20px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                <Box sx={{ bgcolor: '#dcfce7', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3 }}>
                                    <GroupsIcon sx={{ fontSize: 32, color: '#16a34a' }} />
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Community Focused</Typography>
                                <Typography color="text.secondary">
                                    We support local charities and organizations. Listing your charity golf tournament here helps you raise more funds for your cause.
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>

                {/* Call to Action */}
                <Box sx={{
                    bgcolor: '#1e293b',
                    borderRadius: '32px',
                    p: { xs: 4, md: 8 },
                    textAlign: 'center',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                            fontFamily: 'var(--font-bebas-neue)',
                            mb: 2,
                            position: 'relative',
                            zIndex: 1
                        }}
                    >
                        Ready to Tee It Up?
                    </Typography>
                    <Typography sx={{ mb: 4, opacity: 0.8, fontSize: '1.2rem', maxWidth: '600px', mx: 'auto', position: 'relative', zIndex: 1 }}>
                        Browse our upcoming events or create your own tournament listing today.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                        <Button
                            variant="contained"
                            size="large"
                            component={Link}
                            href="/"
                            sx={{
                                bgcolor: '#10b981',
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                '&:hover': { bgcolor: '#059669' }
                            }}
                        >
                            Find Tournaments
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            component={Link}
                            href="/tournaments/new"
                            sx={{
                                color: 'white',
                                borderColor: 'white',
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: 'white' }
                            }}
                        >
                            List a Tournament
                        </Button>
                    </Box>
                </Box>
            </Container>
        </div>
    );
}
