"use client";

import { useEffect, useState, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { Tournament } from "@/types/tournament";
import TournamentCard from "@/components/TournamentCard";
import Navbar from "@/components/Navbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import PublicIcon from '@mui/icons-material/Public';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { Collapse, Grid, Select, FormControl, InputLabel } from "@mui/material";
import { useMemo } from "react";
import Link from "next/link";
import AddIcon from '@mui/icons-material/Add';

export default function Home() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterCity, setFilterCity] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const fetchTournaments = useCallback(async (state: string) => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const colRef = collection(db, "tournaments");

      const q = query(
        colRef,
        where("location.state", "==", state),
        where("date", ">=", today),
        orderBy("date", "asc")
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Tournament);
      setTournaments(data);
    } catch (e) {
      console.error("Error fetching tournaments:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load filters from localStorage on mount
  useEffect(() => {
    const cachedState = localStorage.getItem("selectedGolfState");
    const cachedCity = localStorage.getItem("golfFilterCity");
    const cachedCourse = localStorage.getItem("golfFilterCourse");
    const cachedStart = localStorage.getItem("golfFilterStart");
    const cachedEnd = localStorage.getItem("golfFilterEnd");
    const cachedShowFilters = localStorage.getItem("golfShowFilters");

    if (cachedState && (cachedState === "UT" || cachedState === "AZ")) {
      setSelectedState(cachedState);
      fetchTournaments(cachedState);
    }
    if (cachedCity) setFilterCity(cachedCity);
    if (cachedCourse) setFilterCourse(cachedCourse);
    if (cachedStart) setFilterStartDate(cachedStart);
    if (cachedEnd) setFilterEndDate(cachedEnd);
    if (cachedShowFilters === "true") setShowFilters(true);
  }, [fetchTournaments]);

  // Save filters to localStorage whenever they change
  useEffect(() => {
    if (selectedState) {
      localStorage.setItem("golfFilterCity", filterCity);
      localStorage.setItem("golfFilterCourse", filterCourse);
      localStorage.setItem("golfFilterStart", filterStartDate);
      localStorage.setItem("golfFilterEnd", filterEndDate);
      localStorage.setItem("golfShowFilters", showFilters.toString());
    }
  }, [filterCity, filterCourse, filterStartDate, filterEndDate, showFilters, selectedState]);

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    // Reset filters when state changes
    setFilterCity("");
    setFilterCourse("");
    setFilterStartDate("");
    setFilterEndDate("");

    // Clear filter cache on state change
    localStorage.removeItem("golfFilterCity");
    localStorage.removeItem("golfFilterCourse");
    localStorage.removeItem("golfFilterStart");
    localStorage.removeItem("golfFilterEnd");

    if (newState) {
      localStorage.setItem("selectedGolfState", newState);
      fetchTournaments(newState);
    }
  };

  const activeCities = useMemo(() => {
    const cities = tournaments.map(t => t.location.city);
    return Array.from(new Set(cities)).sort();
  }, [tournaments]);

  const activeCourses = useMemo(() => {
    const courses = tournaments.map(t => t.courseName);
    return Array.from(new Set(courses)).sort();
  }, [tournaments]);

  const filteredTournaments = useMemo(() => {
    return tournaments.filter(t => {
      const matchesCity = !filterCity || t.location.city === filterCity;
      const matchesCourse = !filterCourse || t.courseName === filterCourse;
      const matchesStart = !filterStartDate || t.date >= filterStartDate;
      const matchesEnd = !filterEndDate || t.date <= filterEndDate;
      return matchesCity && matchesCourse && matchesStart && matchesEnd;
    });
  }, [tournaments, filterCity, filterCourse, filterStartDate, filterEndDate]);

  const clearFilters = () => {
    setFilterCity("");
    setFilterCourse("");
    setFilterStartDate("");
    setFilterEndDate("");

    // Clear localStorage
    localStorage.removeItem("golfFilterCity");
    localStorage.removeItem("golfFilterCourse");
    localStorage.removeItem("golfFilterStart");
    localStorage.removeItem("golfFilterEnd");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Full-Width Hero Section */}
      <Box sx={{
        background: 'linear-gradient(to bottom, #14532d 0%, #002478ff 50%, #00580aff 100%)',
        pt: { xs: 8, md: 10 },
        pb: { xs: 8, md: 10 },
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 4 } }}>
          <Typography
            variant="h1"
            sx={{
              fontFamily: 'var(--font-bebas-neue)',
              fontSize: { xs: '3rem', md: '5rem' },
              lineHeight: 1,
              color: 'white',
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
              mb: 4,
              letterSpacing: '0.02em'
            }}
          >
            List local golf tournaments.<br />Find local golf tournaments.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box
              onClick={() => {
                const element = document.getElementById('find-tournaments');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              sx={{
                display: 'inline-block',
                px: 4,
                py: 2,
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '100px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Typography sx={{ color: 'white', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '1rem' }}>
                Find tournaments near you
              </Typography>
            </Box>

            <Box
              component={Link}
              href="/tournaments/new"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 4,
                py: 2,
                bgcolor: 'white',
                borderRadius: '100px',
                border: '1px solid white',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#f8fafc',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                }
              }}
            >
              <AddIcon sx={{ color: '#14532d', fontSize: '1.4rem' }} />
              <Typography sx={{ color: '#14532d', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '1rem' }}>
                Create a Tournament
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Tournament Discovery Section */}
      <Box sx={{ bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', py: 8 }}>
        <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4, md: 4 } }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'var(--font-bebas-neue)',
              mb: 3,
              color: '#1e293b',
              letterSpacing: '0.02em',
              textTransform: 'uppercase'
            }}
          >
            Upcoming Tournaments
          </Typography>

          <Box id="find-tournaments" sx={{ mb: 6 }}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2,
              mb: 2
            }}>
              <Box maxWidth="400px" sx={{ flexGrow: 1 }}>
                <TextField
                  select
                  fullWidth
                  label="Select your state"
                  value={selectedState}
                  onChange={handleStateChange}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '16px',
                      backgroundColor: 'white',
                      fontSize: '1.2rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                      '& fieldset': {
                        borderColor: '#e2e8f0',
                        borderWidth: '2px',
                      },
                      '&:hover fieldset': {
                        borderColor: '#15803d',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#15803d',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PublicIcon sx={{ color: '#15803d' }} />
                      </InputAdornment>
                    ),
                  }}
                >
                  <MenuItem value="" disabled>Choose Location</MenuItem>
                  <MenuItem value="UT" sx={{ py: 2, fontWeight: '600' }}>Utah</MenuItem>
                  <MenuItem value="AZ" sx={{ py: 2, fontWeight: '600' }}>Arizona</MenuItem>
                </TextField>
              </Box>

              {selectedState && (
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    borderRadius: '12px',
                    py: 1.5,
                    px: 3,
                    borderColor: '#e2e8f0',
                    color: '#475569',
                    fontFamily: 'var(--font-bebas-neue)',
                    fontSize: '1.1rem',
                    letterSpacing: '0.05em',
                    bgcolor: showFilters ? '#f1f5f9' : 'white',
                    '&:hover': { borderColor: '#15803d', color: '#15803d' }
                  }}
                >
                  {showFilters ? 'Hide Filters' : 'Filters'}
                </Button>
              )}
            </Box>

            <Collapse in={showFilters}>
              <Box sx={{
                p: 3,
                mt: 2,
                bgcolor: 'white',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
              }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>City</InputLabel>
                      <Select
                        value={filterCity}
                        label="City"
                        onChange={(e) => setFilterCity(e.target.value)}
                        sx={{ borderRadius: '8px' }}
                      >
                        <MenuItem value="">All Cities</MenuItem>
                        {activeCities.map(city => (
                          <MenuItem key={city} value={city}>{city}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Golf Course</InputLabel>
                      <Select
                        value={filterCourse}
                        label="Golf Course"
                        onChange={(e) => setFilterCourse(e.target.value)}
                        sx={{ borderRadius: '8px' }}
                      >
                        <MenuItem value="">All Courses</MenuItem>
                        {activeCourses.map(course => (
                          <MenuItem key={course} value={course}>{course}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="From"
                      type="date"
                      value={filterStartDate}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="To"
                      type="date"
                      value={filterEndDate}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 1 }} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Button
                      fullWidth
                      color="error"
                      onClick={clearFilters}
                      sx={{ minWidth: 'auto', p: 1 }}
                      title="Clear Filters"
                    >
                      <ClearAllIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Box>

          {!selectedState ? (
            <Box
              textAlign="center"
              py={12}
              className="bg-white rounded-[32px] border-2 border-dashed border-slate-200 shadow-sm"
            >
              <Typography variant="h5" className="text-slate-400 font-medium" sx={{ fontFamily: 'var(--font-bebas-neue)', letterSpacing: '0.05em' }}>
                Pick a state above to reveal tournaments
              </Typography>
            </Box>
          ) : loading ? (
            <Box display="flex" justifyContent="center" py={12}>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-800"></div>
            </Box>
          ) : filteredTournaments.length === 0 ? (
            <Box textAlign="center" py={12} className="bg-white rounded-[32px] border border-slate-100 shadow-sm">
              <Typography variant="h4" className="font-bold text-slate-800 mb-2" sx={{ fontFamily: 'var(--font-bebas-neue)', letterSpacing: '0.02em' }}>
                {tournaments.length > 0 ? "No Matches Found" : `All Quiet in ${selectedState === "UT" ? "Utah" : "Arizona"}`}
              </Typography>
              <Typography variant="h6" className="text-slate-500 font-normal">
                {tournaments.length > 0
                  ? "Try adjusting your filters to see more tournaments."
                  : "No upcoming tournaments found. Check back later!"}
              </Typography>
              {tournaments.length > 0 && (
                <Button
                  onClick={clearFilters}
                  sx={{ mt: 3, fontFamily: 'var(--font-bebas-neue)', fontSize: '1.1rem' }}
                  color="success"
                >
                  Clear All Filters
                </Button>
              )}
            </Box>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {filteredTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          )}
        </Container>
      </Box>
    </div >
  );
}
