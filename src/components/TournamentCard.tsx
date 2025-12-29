import Link from "next/link";
import { Tournament } from "@/types/tournament";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface Props {
    tournament: Tournament;
}

export default function TournamentCard({ tournament }: Props) {
    return (
        <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }} className="hover:shadow-lg transition-shadow duration-200">
            <CardActionArea component={Link} href={`/tournaments/view?id=${tournament.id}`} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <CardContent className="w-full flex-grow">
                    <Typography gutterBottom variant="h5" component="div" className="font-bold text-green-900 line-clamp-1">
                        {tournament.name}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" className="font-medium -mt-1 mb-2 line-clamp-1">
                        {tournament.courseName}
                    </Typography>

                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                        <CalendarMonthIcon fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                            {tournament.date}
                        </Typography>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                        <LocationOnIcon fontSize="small" />
                        <Typography variant="body2" color="text.secondary" className="line-clamp-1">
                            {tournament.location.city}, {tournament.location.state}
                        </Typography>
                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

