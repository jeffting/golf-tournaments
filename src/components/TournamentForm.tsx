"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, runTransaction, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";
import { Typography, Box as MuiBox, CardMedia } from "@mui/material";
import { Tournament } from "@/types/tournament";
import { validateTournament } from "@/lib/validation";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    initialData?: Tournament;
    isEditing?: boolean;
    tournamentId?: string; // ID of the tournament being edited
}

export default function TournamentForm({ initialData, isEditing, tournamentId }: Props) {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [flyerFile, setFlyerFile] = useState<File | null>(null);
    const [flyerPreview, setFlyerPreview] = useState<string | null>(initialData?.flyerUrl || null);

    // Get today's date in YYYY-MM-DD format for min date attribute
    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        tournamentName: initialData?.tournamentName || "",
        courseName: initialData?.courseName || "",
        date: initialData?.date || "",
        location: {
            street: initialData?.location.street || "",
            city: initialData?.location.city || "",
            state: initialData?.location.state || "",
            zip: initialData?.location.zip || "",
        },
        description: initialData?.description || "",
        contactEmail: initialData?.contactEmail || "",
        externalUrl: initialData?.externalUrl || "",
        startTime: initialData?.startTime || "",
        timezone: initialData?.timezone || "America/Denver", // Default
    });

    const compressImage = async (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1600;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error("Canvas to Blob conversion failed"));
                            }
                        },
                        "image/jpeg",
                        0.7 // Compression quality
                    );
                };
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit for raw upload before compression
                setError("Image is too large. Please select a file smaller than 10MB.");
                return;
            }
            setFlyerFile(file);
            setFlyerPreview(URL.createObjectURL(file));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("location.")) {
            const field = name.split(".")[1];

            // Auto-select timezone based on state
            let newTimezone = formData.timezone;
            if (field === "state") {
                if (value === "AZ") newTimezone = "America/Phoenix";
                if (value === "UT") newTimezone = "America/Denver";
            }

            setFormData((prev) => ({
                ...prev,
                timezone: newTimezone,
                location: {
                    ...prev.location,
                    [field]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { isValid, error: validationError } = validateTournament(formData);
        if (!isValid) {
            setError(validationError);
            setLoading(false);
            return;
        }

        if (!user) {
            setError("You must be logged in.");
            setLoading(false);
            return;
        }

        try {
            let flyerUrl = initialData?.flyerUrl || "";

            // Upload flyer if a new one was selected
            if (flyerFile) {
                const compressedBlob = await compressImage(flyerFile);
                const storageRef = ref(storage, `flyers/${tournamentId || Date.now()}-${flyerFile.name}`);
                const snapshot = await uploadBytes(storageRef, compressedBlob);
                flyerUrl = await getDownloadURL(snapshot.ref);
            }

            if (isEditing && tournamentId) {
                // Update existing tournament
                const tournamentRef = doc(db, "tournaments", tournamentId);
                await updateDoc(tournamentRef, {
                    ...formData,
                    flyerUrl,
                    location: {
                        ...formData.location,
                        latitude: initialData?.location.latitude || 0,
                        longitude: initialData?.location.longitude || 0,
                    }
                });
                router.push(`/tournaments/view?id=${tournamentId}`);
            } else {
                // Create new tournament
                const now = new Date();
                const yearMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;
                const statsRef = doc(db, "userUsage", user.email!, "monthlyStats", yearMonth);

                await runTransaction(db, async (transaction) => {
                    const statsSnap = await transaction.get(statsRef);
                    const currentCount = statsSnap.exists() ? statsSnap.data().count : 0;
                    const isAdmin = user.email === "jefftingey22@gmail.com";

                    if (currentCount >= 5 && !isAdmin) {
                        throw new Error("Monthly tournament creation limit (5) reached.");
                    }

                    // Increment and update stats
                    transaction.set(statsRef, {
                        count: currentCount + 1,
                        lastUpdated: Date.now()
                    }, { merge: true });

                    // Create tournament
                    const tournamentsRef = collection(db, "tournaments");
                    const newTournamentRef = doc(tournamentsRef);
                    transaction.set(newTournamentRef, {
                        ...formData,
                        flyerUrl,
                        createdAt: Date.now(),
                        creatorUserId: user.uid,
                        location: {
                            ...formData.location,
                            latitude: 0,
                            longitude: 0,
                        }
                    });
                });
                router.push("/");
            }
        } catch (err: any) {
            console.error("Error saving tournament:", err);
            setError(err.message || "Failed to save tournament. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto p-10 bg-white rounded-[32px] shadow-2xl space-y-8 border border-white/20">
            <h2 className="text-4xl font-bold text-slate-900 mb-8" style={{ fontFamily: 'var(--font-bebas-neue)', letterSpacing: '0.02em' }}>
                {isEditing ? "Edit Tournament" : "Tournament Information"}
            </h2>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Tournament Name</label>
                        <input
                            type="text"
                            name="tournamentName"
                            required
                            placeholder="e.g. Bob's Charity Scramble"
                            className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-lg p-3.5 border text-slate-900 transition-colors"
                            value={formData.tournamentName}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Golf Course Name</label>
                        <input
                            type="text"
                            name="courseName"
                            required
                            placeholder="e.g. Pebble Beach"
                            className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-lg p-3.5 border text-slate-900 transition-colors"
                            value={formData.courseName}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Date</label>
                        <input
                            type="date"
                            name="date"
                            required
                            min={today}
                            className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-lg p-3.5 border text-slate-900 transition-colors"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Contact Email</label>
                        <input
                            type="email"
                            name="contactEmail"
                            placeholder="organizer@example.com"
                            className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-lg p-3.5 border text-slate-900 transition-colors"
                            value={formData.contactEmail}
                            onChange={handleChange}
                        />
                        <p className="mt-1 ml-1 text-xs text-slate-500">Required if no website is provided</p>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 space-y-4">
                    <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: '0.1em' }}>Tournament Flyer (Optional)</Typography>

                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="w-full md:w-1/2">
                            <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-slate-50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <CloudUploadIcon sx={{ fontSize: 40, color: '#64748b', mb: 1 }} />
                                    <p className="mb-2 text-sm text-slate-700 font-semibold">Click to upload flyer</p>
                                    <p className="text-xs text-slate-500">JPG, PNG or WEBP (Max 10MB)</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>

                        {flyerPreview && (
                            <div className="w-full md:w-1/2 relative">
                                <MuiBox sx={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                    <CardMedia
                                        component="img"
                                        image={flyerPreview}
                                        alt="Flyer Preview"
                                        sx={{ height: 192, objectFit: 'contain', bgcolor: '#f1f5f9' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFlyerFile(null);
                                            setFlyerPreview(initialData?.flyerUrl || null);
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white text-red-600 rounded-full shadow-md transition-colors"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </button>
                                </MuiBox>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 italic">
                        Images are compressed automatically to ensure fast loading times.
                    </p>
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: '0.1em', mb: 2 }}>Location Details</Typography>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-500 mb-1">Street Address</label>
                            <input
                                type="text"
                                name="location.street"
                                required
                                className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 border text-slate-900 transition-colors"
                                value={formData.location.street}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">City</label>
                            <input
                                type="text"
                                name="location.city"
                                required
                                className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 border text-slate-900 transition-colors"
                                value={formData.location.city}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">State</label>
                            <select
                                name="location.state"
                                required
                                className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 border text-slate-900 bg-white transition-colors"
                                value={formData.location.state}
                                onChange={handleChange as any}
                            >
                                <option value="">Select State</option>
                                <option value="UT">Utah</option>
                                <option value="AZ">Arizona</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">ZIP / Postal Code</label>
                            <input
                                type="text"
                                name="location.zip"
                                required
                                className="block w-full rounded-lg border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-3 border text-slate-900 transition-colors"
                                value={formData.location.zip}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Description</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        placeholder="Tell players about the format, prizes, schedule, and how to sign up etc..."
                        className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-lg p-3.5 border text-slate-900 transition-colors"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Tournament Website (Optional)</label>
                    <input
                        type="url"
                        name="externalUrl"
                        className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-lg p-3.5 border text-slate-900 transition-colors"
                        value={formData.externalUrl}
                        onChange={handleChange}
                        placeholder="https://your-tournament-site.com"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Start Time</label>
                        <input
                            type="time"
                            name="startTime"
                            required
                            className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-lg p-3.5 border text-slate-900 transition-colors"
                            value={formData.startTime}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1 ml-1">Timezone</label>
                        <select
                            name="timezone"
                            required
                            className="block w-full rounded-xl border-slate-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-lg p-3.5 border text-slate-900 bg-white transition-colors"
                            value={formData.timezone}
                            onChange={handleChange as any}
                        >
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Phoenix">Arizona Time (No DST)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/New_York">Eastern Time (ET)</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium">
                    {error}
                </div>
            )}

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex justify-center py-4 px-6 border border-transparent shadow-xl text-xl font-bold rounded-xl text-white bg-green-800 hover:bg-green-900 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all transform hover:-translate-y-1 active:translate-y-0"
                    style={{ fontFamily: 'var(--font-bebas-neue)', letterSpacing: '0.05em' }}
                >
                    {loading ? (isEditing ? "Updating..." : "Registering...") : (isEditing ? "Update Tournament" : "Create Tournament Listing")}
                </button>
            </div>
        </form>
    );
}
