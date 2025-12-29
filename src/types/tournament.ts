export interface Tournament {
    id: string; // Document ID (uuid)
    name: string;
    date: string; // ISO string for simplicity in storage, or Timestamp
    location: {
        street: string;
        city: string;
        state: string;
        zip: string;
        latitude: number;
        longitude: number;
    };
    description: string;
    courseName: string; // Required as per user request
    hostEmail: string;
    externalUrl?: string;
    maxPlayersPerTeam: number;
    maxTeams: number;
}
