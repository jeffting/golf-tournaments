import Link from "next/link";
import { Tournament } from "@/types/tournament";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { CardActionArea } from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface Props {
    tournament: Tournament;
}

export default function TournamentCard({ tournament }: Props) {
    const formatDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-');
        return `${month}-${day}-${year.slice(2)}`;
    };

    return (
        <Card sx={{ maxWidth: { xs: '100%', sm: 345 }, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }} className="hover:shadow-lg transition-shadow duration-200">
            <CardActionArea component={Link} href={`/tournaments/view?id=${tournament.id}`} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ width: '100%', background: 'linear-gradient(135deg, #2c9553ff 0%, #0b2f19ff 100%)', py: 2.5, px: 2, position: 'relative' }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 12,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: 'rgba(255, 255, 255, 0.9)',
                        }}
                    >
                        <CalendarMonthIcon sx={{ fontSize: '1rem' }} />
                        <Typography
                            sx={{
                                fontSize: '1.1rem',
                                fontFamily: 'var(--font-bebas-neue)',
                                letterSpacing: '0.05em'
                            }}
                        >
                            {formatDate(tournament.date)}
                        </Typography>
                    </Box>
                    <Typography
                        variant="h6"
                        component="div"
                        className="font-bold text-white text-center"
                        sx={{ fontFamily: 'var(--font-bebas-neue)', fontSize: '2rem', letterSpacing: '0.05em', mt: 1.5 }}
                    >
                        {tournament.tournamentName}
                    </Typography>
                </Box>

                <CardContent className="w-full flex-grow">

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', maxWidth: '280px' }}>
                            <GolfCourseIcon fontSize="small" sx={{ color: '#14532d', minWidth: '20px' }} />
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                className="font-medium line-clamp-1"
                                sx={{ fontFamily: 'var(--font-bebas-neue)', letterSpacing: '0.03em' }}
                            >
                                {tournament.courseName}
                            </Typography>
                        </Box>



                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', maxWidth: '280px' }}>
                            <LocationOnIcon fontSize="small" sx={{ color: '#ef4444', minWidth: '20px' }} />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                className="line-clamp-1"
                                sx={{ fontFamily: 'var(--font-bebas-neue)', letterSpacing: '0.03em' }}
                            >
                                {tournament.location.city}, {tournament.location.state}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

