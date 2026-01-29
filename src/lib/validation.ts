export interface ValidationResult {
    isValid: boolean;
    error: string | null;
}

export const validateTournament = (data: any): ValidationResult => {
    // Tournament Name (3-128)
    if (!data.tournamentName || data.tournamentName.length < 3 || data.tournamentName.length > 128) {
        return { isValid: false, error: "Tournament Name must be between 3 and 128 characters." };
    }

    // Course Name (3-100)
    if (!data.courseName || data.courseName.length < 3 || data.courseName.length > 100) {
        return { isValid: false, error: "Golf Course Name must be between 3 and 100 characters." };
    }

    // Location: State (UT or AZ)
    if (!["UT", "AZ"].includes(data.location?.state)) {
        return { isValid: false, error: "Please select a supported state (Utah or Arizona)." };
    }

    // Location: City (3-50)
    if (!data.location?.city || data.location.city.length < 3 || data.location.city.length > 50) {
        return { isValid: false, error: "City must be between 3 and 50 characters." };
    }

    // Location: Street (3-50)
    if (!data.location?.street || data.location.street.length < 3 || data.location.street.length > 50) {
        return { isValid: false, error: "Street Address must be between 3 and 50 characters." };
    }

    // Contact Email or External URL (at least one required)
    if (!data.contactEmail && !data.externalUrl) {
        return { isValid: false, error: "Please provide either a contact email or a tournament website." };
    }

    // Contact Email (5-50 if provided)
    if (data.contactEmail && (data.contactEmail.length < 5 || data.contactEmail.length > 50)) {
        return { isValid: false, error: "Contact Email must be between 5 and 50 characters." };
    }

    // External URL (max 80 if provided)
    if (data.externalUrl && data.externalUrl.length > 80) {
        return { isValid: false, error: "Tournament Website URL must be at most 80 characters." };
    }

    // Description (5-1000)
    if (!data.description || data.description.length < 5 || data.description.length > 1000) {
        return { isValid: false, error: "Description must be between 5 and 1000 characters." };
    }

    // Start Time (HH:mm format)
    const timeMatch = data.startTime?.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/);
    if (!timeMatch) {
        return { isValid: false, error: "Please select a valid start time." };
    }

    // Timezone (3-50)
    if (!data.timezone || data.timezone.length < 3 || data.timezone.length > 50) {
        return { isValid: false, error: "Please select a valid timezone." };
    }

    return { isValid: true, error: null };
};
