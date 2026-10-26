import {
  Container,
  Paper,
  Typography,
  Stack,
  Divider,
  Button,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import type { CreateTripFormData } from "../schemas/tripSchema";
import PlaceIcon from "@mui/icons-material/Place";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PeopleIcon from "@mui/icons-material/People";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useEffect, useState } from "react";
import { getCoordinates } from "../utils/geocoding";
//import { destinations } from "../constants/destinations";
import "leaflet/dist/leaflet.css";
import TripMap from "../components/sections/TripMap";
import BudgetChart from "../components/sections/BudgetChart";
import { regenerateDay } from "../api/tripApi";

const TripSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as
    | {
      trip: CreateTripFormData;
      itinerary: string;
      savedTripId?: number;
    }
    | null;

  const savedTripId = state?.savedTripId;

  const savedTrips = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("tripwise-trips") || "[]"
      ) as {
        id: number;
        trip: CreateTripFormData;
        itinerary: string;
      }[];
    } catch (error) {
      console.error("Failed to read saved trips:", error);
      return [];
    }
  })();

  const savedTrip = savedTripId
    ? savedTrips.find((item) => item.id === savedTripId)
    : undefined;

  const trip = state?.trip ?? savedTrip?.trip;
  const itinerary = state?.itinerary ?? savedTrip?.itinerary;


  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);

  const [regeneratedDays, setRegeneratedDays] = useState<
    //Record<number, ...> TypeScript ka type hai jo batata hai ki object ke numeric keys ke saamne itinerary-day objects honge.
    Record<number, {
      day: number;
      morning: string;
      afternoon: string;
      evening: string;
      estimatedCost: number;
    }>
  >({});

  const [regenerationError, setRegenerationError] = useState<{
    day: number;
    message: string;
  } | null>(null);

  const handleRegenerateDay = async (
    day: {
      day: number;
      morning: string;
      afternoon: string;
      evening: string;
      estimatedCost: number;
    }
  ) => {
    if (!trip) return;

    setRegeneratingDay(day.day);
    setRegenerationError(null);

    try {
      const response = await regenerateDay(trip, day.day, day);
      const newDay = JSON.parse(response.data);

      setRegeneratedDays((previous) => ({
        ...previous,
        [day.day]: newDay,
      }));
    } catch (error) {
      console.error("Failed to regenerate day:", error);

      setRegenerationError({
        day: day.day,
        message: `Could not regenerate Day ${day.day}. Please try again.`,
      });
    } finally {
      setRegeneratingDay(null);
    }
  }
  useEffect(() => {
    //".?" is called optional chaining.
    if (trip?.destination) {
      getCoordinates(trip?.destination)
        .then((result) => {
          //console.log("Coordinates:", coordinates);
          setCoordinates(result);
        })
        .catch((error) => {
          console.error("Geocoding failed:", error);
        });
    }
  }, [trip?.destination]);

  //JSON.parse() us string ko JavaScript object bana dega Phir fhum easily UI bana sakenge.
  let aiTrip;
  try {
    aiTrip = itinerary ? JSON.parse(itinerary) : null;
  } catch (error) {
    console.error("Failed to parse AI itinerary:", error);
  }

  const totalEstimatedCost =
    aiTrip?.itinerary?.reduce(
      (
        total: number,
        day: { day: number; estimatedCost: number }
      ) => {
        const currentDay = regeneratedDays[day.day] ?? day;
        return total + (Number(currentDay.estimatedCost) || 0);
      },
      0
    ) ?? 0;

  console.log("ITINERARY:", itinerary);
  console.log("AI TRIP:", aiTrip);

  console.log("Location State:", location.state);

  if (!trip) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography>No trip data found</Typography>
      </Container>
    );
  }
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          mb: 4,
        }}
      >
        Trip Summary
      </Typography>

      {/* <Typography>
             {JSON.stringify(trip)}   
            </Typography> */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
        }}
      >
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <PlaceIcon color="primary" />
            <Typography>
              <strong>Destination:</strong> {trip.destination}
            </Typography>
          </Stack>

          <Divider />

          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <CurrencyRupeeIcon color="success" />
            <Typography>
              <strong>Budget:</strong>₹{trip.budget.toLocaleString()}
            </Typography>
          </Stack>

          <Divider />

          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <PeopleIcon color="secondary" />
            <Typography>
              <strong>Travelers:</strong> {trip.travelers}
            </Typography>
          </Stack>

          <Divider />

          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <FlightTakeoffIcon color="action" />
            <Typography>
              <strong>Travel Type:</strong> {trip.travelType}
            </Typography>
          </Stack>

          <Divider />

          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <CalendarMonthIcon color="warning" />
            <Typography>
              <strong>Start Date:</strong> {trip.startDate}
            </Typography>
          </Stack>

          <Divider />

          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <CalendarMonthIcon color="warning" />
            <Typography>
              <strong>End Date:</strong> {trip.endDate}
            </Typography>
          </Stack>

          <Divider />

          <Stack spacing={2}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              📍 Destination Map
            </Typography>
            {coordinates ? (
              <TripMap
                latitude={coordinates.latitude}
                longitude={coordinates.longitude}
                destination={trip.destination}
              />
            ) : (
              <Typography color="text.secondary">
                Loading destination map...
              </Typography>
            )}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={2}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {aiTrip?.tripTitle}
            </Typography>
            <Typography
              sx={{
                lineHeight: 1.8,
              }}
            >
              {aiTrip?.vibe}
            </Typography>
          </Stack>

          <Stack spacing={2}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                mt: 2,
              }}
            >
              Day Wise Itinerary
            </Typography>
            {aiTrip?.itinerary?.map(
              (day: {
                day: number;
                morning: string;
                afternoon: string;
                evening: string;
                estimatedCost: number;
              }) => {
                const currentDay = regeneratedDays[day.day] ?? day;
                return (
                  <Card key={day.day} elevation={2}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          mb: 2,
                        }}
                      >
                        Day {currentDay.day}
                      </Typography>

                      <Typography sx={{ mb: 1 }}>
                        <strong>Morning:</strong> {currentDay.morning}
                      </Typography>

                      <Typography sx={{ mb: 1 }}>
                        <strong>Afternoon:</strong> {currentDay.afternoon}
                      </Typography>

                      <Typography sx={{ mb: 1 }}>
                        <strong>Evening:</strong> {currentDay.evening}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 2,
                          fontWeight: 700,
                        }}
                      >
                        💰 Estimated Cost: ₹{currentDay.estimatedCost.toLocaleString()}
                      </Typography>

                      <Button
                        variant="contained"
                        onClick={() => handleRegenerateDay(day)}
                        disabled={regeneratingDay === day.day}
                      >
                        {regeneratingDay === day.day
                          ? "Regenerating Day..."
                          : "Regenerate Day"}
                      </Button>

                      {regenerationError?.day === day.day && (
                        <Typography color="error" sx={{ mt: 1 }}>
                          {regenerationError.message}
                        </Typography>
                      )}

                    </CardContent>
                  </Card>
                );
              },
            )}
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={2}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              💰 Budget Breakdown
            </Typography>

            {aiTrip?.budgetBreakdown && (
              <Card elevation={2}>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 2 }}
                  >
                    Budget Visualization
                  </Typography>
                  <BudgetChart
                    budgetBreakdown={aiTrip.budgetBreakdown}
                  />
                </CardContent>
              </Card>
            )}

            <Card elevation={2}>
              <CardContent>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>🏨 Stay</Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      ₹{aiTrip?.budgetBreakdown?.stay?.toLocaleString()}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>🍴 Food</Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      ₹{aiTrip?.budgetBreakdown?.food?.toLocaleString()}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>🎟️ Activities</Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      ₹{aiTrip?.budgetBreakdown?.activities?.toLocaleString()}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography>🚗 Transport</Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      ₹{aiTrip?.budgetBreakdown?.transport?.toLocaleString()}
                    </Typography>
                  </Box>

                  <Divider />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography sx={{ fontWeight: 700 }}>
                      Total Estimated Cost
                    </Typography>

                    <Typography sx={{ fontWeight: 700 }}>
                      ₹
                      {/* {(
                        aiTrip?.budgetBreakdown?.stay +
                        aiTrip?.budgetBreakdown?.food +
                        aiTrip?.budgetBreakdown?.activities +
                        aiTrip?.budgetBreakdown?.transport
                      )?.toLocaleString()} */}
                      {totalEstimatedCost.toLocaleString("en-IN")}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={2}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              🎒Packing List
            </Typography>

            <Card elevation={2}>
              <CardContent>
                <Stack spacing={1.5}>
                  {aiTrip?.packingList?.map((item: string, index: number) => (
                    <Typography key={index}>✅ {item}</Typography>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={2}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              💡Travel Tips
            </Typography>

            <Card elevation={2}>
              <CardContent>
                <Stack spacing={1.5}>
                  {aiTrip?.tips?.map((tip: string, index: number) => (
                    <Typography key={index}>✅ {tip}</Typography>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/create-trip")}
          >
            Create Another Trip
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};
export default TripSummary;
