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

    // At least one contact method required
    if (!data.contactEmail && !data.externalUrl && !data.contactPhone) {
        return { isValid: false, error: "Please provide at least one contact method (Email, Phone, or Website)." };
    }

    // Contact Email (5-50 if provided)
    if (data.contactEmail && (data.contactEmail.length < 5 || data.contactEmail.length > 50)) {
        return { isValid: false, error: "Contact Email must be between 5 and 50 characters." };
    }

    // Contact Phone Validation (based on digits)
    if (data.contactPhone) {
        const digits = data.contactPhone.replace(/\D/g, "");
        if (digits.length > 20) {
            return { isValid: false, error: "Contact Phone number is too long." };
        }
        if (digits.length < 10) {
            return { isValid: false, error: "Contact Phone number is too short." };
        }
    }

    // External URL (max 300 if provided)
    if (data.externalUrl && data.externalUrl.length > 300) {
        return { isValid: false, error: "Tournament Website URL must be at most 300 characters." };
    }

    // Description (5-4000)
    if (!data.description || data.description.length < 5 || data.description.length > 4000) {
        return { isValid: false, error: "Description must be between 5 and 4000 characters." };
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
