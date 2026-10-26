import apiClient from "./apiClient";
import type { CreateTripFormData } from "../schemas/tripSchema";

export const createTrip = async (data: CreateTripFormData) => {
  //POST request ka matlab:Server ko naya data bhejna.
  const response = await apiClient.post("/api/generate-trip", data);

  return response.data;
};

export const getTrips = async () => {
  const response = await apiClient.get("/posts");

  return response.data;
};

export const regenerateDay = async (
  tripData: CreateTripFormData,
  selectedDay: number,
  currentDay: {
    day: number;
    morning: string;
    afternoon: string;
    evening: string;
    estimatedCost: number;
  },
) => {
  const response = await apiClient.post("/api/regenerate-day", {
    tripData,
    selectedDay,
    currentDay,
  });

  return response.data;
};
