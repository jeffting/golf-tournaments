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
import Tooltip from "@mui/material/Tooltip";

interface Props {
    tournament: Tournament;
}

export default function TournamentCard({ tournament }: Props) {
    const formatDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split('-');
        return `${month}-${day}-${year.slice(2)}`;
    };

    return (
        <Card sx={{ maxWidth: { xs: '100%', md: 360 }, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }} className="hover:shadow-lg transition-shadow duration-200">
            <CardActionArea component={Link} href={`/tournaments/view?id=${tournament.id}`} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                    sx={{
                        width: '100%',
                        background: tournament.flyerUrl
                            ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(${tournament.flyerUrl})`
                            : 'linear-gradient(135deg, #2c9553ff 0%, #0b2f19ff 100%)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        py: { xs: 2.5, md: 3 },
                        px: { xs: 2, md: 2.2 },
                        position: 'relative'
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: { xs: 8, md: 10 },
                            left: { xs: 12, md: 14 },
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: 'rgba(255, 255, 255, 0.9)',
                        }}
                    >
                        <CalendarMonthIcon sx={{ fontSize: { xs: '1rem', md: '1.15rem' } }} />
                        <Typography
                            sx={{
                                fontSize: { xs: '1.3rem', md: '1.5rem' },
                                fontFamily: 'var(--font-bebas-neue)',
                                letterSpacing: '0.05em'
                            }}
                        >
                            {formatDate(tournament.date)}
                        </Typography>
                    </Box>
                    <Box sx={{ height: { xs: '80px', md: '90px' }, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: { xs: 1.5, md: 2 } }}>
                        <Tooltip title={tournament.tournamentName} arrow placement="top" disableHoverListener={tournament.tournamentName.length <= 40}>
                            <Typography
                                variant="h6"
                                component="div"
                                className="font-bold text-white text-center"
                                sx={{
                                    fontFamily: 'var(--font-bebas-neue)',
                                    fontSize: tournament.tournamentName.length > 25 ? { xs: '1.4rem', md: '1.6rem' } :
                                        tournament.tournamentName.length > 15 ? { xs: '1.7rem', md: '1.9rem' } : { xs: '2.1rem', md: '2.4rem' },
                                    letterSpacing: '0.05em',
                                    lineHeight: 1.1,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    width: '100%',
                                    cursor: 'default',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}
                            >
                                {tournament.tournamentName}
                            </Typography>
                        </Tooltip>
                    </Box>
                </Box>

                <CardContent sx={{ width: '100%', flexGrow: 1, px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 } }}>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 }, alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, width: '100%', maxWidth: { xs: '280px', md: '360px' } }}>
                            <GolfCourseIcon sx={{ color: '#14532d', minWidth: '20px', fontSize: { xs: '1.25rem', md: '1.5rem' } }} />
                            <Typography
                                variant="subtitle1"
                                color="text.secondary"
                                className="font-medium line-clamp-1"
                                sx={{ fontFamily: 'var(--font-bebas-neue)', letterSpacing: '0.03em', fontSize: { xs: '1rem', md: '1.2rem' } }}
                            >
                                {tournament.courseName}
                            </Typography>
                        </Box>



                        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, md: 2 }, width: '100%', maxWidth: { xs: '280px', md: '360px' } }}>
                            <LocationOnIcon sx={{ color: '#ef4444', minWidth: '20px', fontSize: { xs: '1.25rem', md: '1.5rem' } }} />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                className="line-clamp-1"
                                sx={{ fontFamily: 'var(--font-bebas-neue)', letterSpacing: '0.03em', fontSize: { xs: '0.875rem', md: '1rem' } }}
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

