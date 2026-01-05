export interface Tournament {
    id: string; // Document ID (uuid)
    creatorUserId: string; // uuid of the user who created the tournament
    tournamentName: string;
    date: string; // ISO string for simplicity in storage, or Timestamp
    location: {
        street: string;
        city: string;
        state: string;
        zip: number;
        latitude: number;
        longitude: number;
    };
    description: string;
    courseName: string;
    contactEmail: string; // email of the person who should be contacted for more details. Doesn't have to be the same as the creator of the tournament.
    externalUrl?: string;
}
