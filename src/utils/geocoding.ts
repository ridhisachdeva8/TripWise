
import apiClient from "../api/apiClient";

type Coordinates = {
  latitude: number;
  longitude: number;
};

export const getCoordinates = async (
  destination: string
): Promise<Coordinates> => {
  const cacheKey = `tripwise-coordinates-${destination
    .trim()
    .toLowerCase()}`;

  // Check if coordinates already exist in cache
  const cachedCoordinates = localStorage.getItem(cacheKey);

  if (cachedCoordinates) {
    console.log("Coordinates loaded from cache:", destination);
    return JSON.parse(cachedCoordinates) as Coordinates;
  }

  // Fetch coordinates from backend if not cached
  const response = await apiClient.get("/api/geocode", {
    params: {
      place: destination,
    },
  });

  const coordinates: Coordinates = {
    latitude: Number(response.data.latitude),
    longitude: Number(response.data.longitude),
  };

  // Save coordinates for future use
  localStorage.setItem(cacheKey, JSON.stringify(coordinates));

  console.log("Coordinates saved to cache:", destination);

  return coordinates;
};
