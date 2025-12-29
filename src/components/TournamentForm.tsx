"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function TournamentForm() {
    const { user } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Get today's date in YYYY-MM-DD format for min date attribute
    const today = new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        name: "",
        courseName: "",
        date: "",
        location: {
            street: "",
            city: "",
            state: "",
            zip: "",
        },
        description: "",
        maxPlayersPerTeam: 4,
        maxTeams: 18,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("location.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
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

        if (!user) {
            setError("You must be logged in to create a tournament.");
            setLoading(false);
            return;
        }

        try {
            await addDoc(collection(db, "tournaments"), {
                ...formData,
                hostEmail: user.email,
                // Basic lat/long placeholder or we could fetch it. 
                // Leaving as 0,0 for now as Geocoding wasn't explicitly requested yet but is in the type.
                location: {
                    ...formData.location,
                    latitude: 0,
                    longitude: 0,
                }
            });
            router.push("/");
        } catch (err) {
            console.error("Error creating tournament:", err);
            setError("Failed to create tournament. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Tournament</h2>

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tournament Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Golf Course Name</label>
                    <input
                        type="text"
                        name="courseName"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                        value={formData.courseName}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        name="date"
                        required
                        min={today}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Street Address</label>
                        <input
                            type="text"
                            name="location.street"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                            value={formData.location.street}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                            type="text"
                            name="location.city"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                            value={formData.location.city}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <input
                            type="text"
                            name="location.state"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                            value={formData.location.state}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                        <input
                            type="text"
                            name="location.zip"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                            value={formData.location.zip}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>


                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Max Players per Team</label>
                        <input
                            type="number"
                            name="maxPlayersPerTeam"
                            required
                            min="1"
                            max="10"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                            value={formData.maxPlayersPerTeam}
                            onChange={(e) => setFormData(prev => ({ ...prev, maxPlayersPerTeam: parseInt(e.target.value) || 4 }))}
                        />
                        <p className="mt-1 text-xs text-gray-500">Players allowed per team (e.g. 4).</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Max Teams</label>
                        <input
                            type="number"
                            name="maxTeams"
                            required
                            min="1"
                            max="100"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border text-gray-900"
                            value={formData.maxTeams}
                            onChange={(e) => setFormData(prev => ({ ...prev, maxTeams: parseInt(e.target.value) || 18 }))}
                        />
                        <p className="mt-1 text-xs text-gray-500">Maximum number of teams in tournament.</p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Tournament"}
                </button>
            </div>
        </form>
    );
}
