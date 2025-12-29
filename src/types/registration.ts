export interface Registration {
    id: string;
    tournamentId: string;
    name: string;
    email: string;
    teamName?: string;
    teamId?: string;
    createdAt: number;
}
