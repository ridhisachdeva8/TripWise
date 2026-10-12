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



const TripSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as
    | {
      trip: CreateTripFormData;
      itinerary: string;
    }
    | undefined;

  const trip = state?.trip;
  const itinerary = state?.itinerary;

  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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
              }) => (
                <Card key={day.day} elevation={2}>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                      }}
                    >
                      Day {day.day}
                    </Typography>

                    <Typography sx={{ mb: 1 }}>
                      <strong>Morning:</strong> {day.morning}
                    </Typography>

                    <Typography sx={{ mb: 1 }}>
                      <strong>Afternoon:</strong> {day.afternoon}
                    </Typography>

                    <Typography sx={{ mb: 1 }}>
                      <strong>Evening:</strong> {day.evening}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 2,
                        fontWeight: 700,
                      }}
                    >
                      💰 Estimated Cost: ₹{day.estimatedCost.toLocaleString()}
                    </Typography>
                  </CardContent>
                </Card>
              ),
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
                      {(
                        aiTrip?.budgetBreakdown?.stay +
                        aiTrip?.budgetBreakdown?.food +
                        aiTrip?.budgetBreakdown?.activities +
                        aiTrip?.budgetBreakdown?.transport
                      )?.toLocaleString()}
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
