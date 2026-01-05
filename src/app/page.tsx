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
import InputAdornment from '@mui/material/InputAdornment';
import PublicIcon from '@mui/icons-material/Public';

export default function Home() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("");

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

  // Check for cached state on mount
  useEffect(() => {
    const cachedState = localStorage.getItem("selectedGolfState");
    if (cachedState && (cachedState === "UT" || cachedState === "AZ")) {
      setSelectedState(cachedState);
      fetchTournaments(cachedState);
    }
  }, [fetchTournaments]);

  const handleStateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newState = e.target.value;
    setSelectedState(newState);
    if (newState) {
      localStorage.setItem("selectedGolfState", newState);
      fetchTournaments(newState);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6, px: { xs: 3, sm: 4, md: 4 } }}>
        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }} mb={6}>
          <Box maxWidth="400px" sx={{ mx: { xs: 'auto', md: '0' } }}>
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
                    borderColor: '#14532d',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#14532d',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#64748b',
                  '&.Mui-focused': {
                    color: '#14532d',
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PublicIcon sx={{ color: '#14532d' }} />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="" disabled>Choose Location</MenuItem>
              <MenuItem value="UT" sx={{ py: 2, fontWeight: '600' }}>Utah</MenuItem>
              <MenuItem value="AZ" sx={{ py: 2, fontWeight: '600' }}>Arizona</MenuItem>
            </TextField>
          </Box>
        </Box>

        {!selectedState ? (
          <Box
            textAlign="center"
            py={12}
            className="bg-white rounded-[32px] border-2 border-dashed border-slate-200 shadow-sm"
          >
            <Typography variant="h5" className="text-slate-400 font-medium">
              Pick a state above to reveal tournaments
            </Typography>
          </Box>
        ) : loading ? (
          <Box display="flex" justifyContent="center" py={12}>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-800"></div>
          </Box>
        ) : tournaments.length === 0 ? (
          <Box textAlign="center" py={12} className="bg-white rounded-[32px] border border-slate-100 shadow-sm">
            <Typography variant="h4" className="font-bold text-slate-800 mb-2">
              All Quiet in {selectedState === "UT" ? "Utah" : "Arizona"}
            </Typography>
            <Typography variant="h6" className="text-slate-500 font-normal">
              No upcoming tournaments found. Check back later!
            </Typography>
          </Box>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
