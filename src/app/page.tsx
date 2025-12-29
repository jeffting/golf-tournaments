"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Tournament } from "@/types/tournament";
import TournamentCard from "@/components/TournamentCard";
import Navbar from "@/components/Navbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid"; // Grid version 2 is Grid2 in recent MUI, checking standard Grid usage or V2. 
// Using basic grid layout with Flex or Grid
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function Home() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "tournaments");
      // Basic query, no index required for default
      const q = query(colRef);
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Tournament);
      setTournaments(data);
    } catch (e) {
      console.error("Error fetching tournaments:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);



  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1" className="font-bold text-slate-800">
            Upcoming Tournaments
          </Typography>
        </Box>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : tournaments.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Typography variant="h6" color="text.secondary">
              No tournaments found.
            </Typography>
          </Box>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
