
import { useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Stack,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type SavedTrip = {
    id: number;
    trip: {
        destination: string;
        budget: number;
        startDate: string;
        endDate: string;
        travelers: number;
        travelType: string;
    };
    itinerary: string;
    createdAt: string;
};

const MyTrips = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState<SavedTrip[]>(() => {
        try {
            return JSON.parse(
                localStorage.getItem("tripwise-trips") || "[]"
            ) as SavedTrip[];
        } catch (error) {
            console.error("Failed to load saved trips:", error);
            return [];
        }
    });


    const [selectedTripId, setSelectedTripId] = useState<number | null>(null);

    const isDeleteDialogOpen = selectedTripId !== null;


    const handleOpenTrip = (savedTrip: SavedTrip) => {
        navigate("/trip-summary", {
            state: {
                trip: savedTrip.trip,
                itinerary: savedTrip.itinerary,
                savedTripId: savedTrip.id,
            },
        });
    };


    const handleConfirmDelete = () => {
        if (selectedTripId === null) return;

        const updatedTrips = trips.filter(
            (trip) => trip.id !== selectedTripId
        );

        localStorage.setItem(
            "tripwise-trips",
            JSON.stringify(updatedTrips)
        );

        setTrips(updatedTrips);
        setSelectedTripId(null);
    };



    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                My Trips ✈️
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 4 }}>
                Your saved adventures, all in one place.
            </Typography>

            {trips.length === 0 ? (
                <Alert severity="info">
                    No saved trips yet. Create your first trip to see it here!
                </Alert>
            ) : (
                <Stack spacing={3}>
                    {trips.map((savedTrip) => (
                        <Card key={savedTrip.id} elevation={3}>
                            <CardContent>
                                <Stack
                                    direction={{ xs: "column", sm: "row" }}
                                    component="div"
                                    sx={{
                                        justifyContent: "space-between",
                                        alignItems: { xs: "stretch", sm: "center" },
                                    }}
                                    spacing={2}
                                >
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            📍 {savedTrip.trip.destination}
                                        </Typography>

                                        <Typography sx={{ mt: 1 }}>
                                            💰 Budget: ₹
                                            {savedTrip.trip.budget.toLocaleString("en-IN")}
                                        </Typography>

                                        <Typography>
                                            👥 Travelers: {savedTrip.trip.travelers}
                                        </Typography>

                                        <Typography>
                                            🧳 Type: {savedTrip.trip.travelType}
                                        </Typography>

                                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                                            {savedTrip.trip.startDate} – {savedTrip.trip.endDate}
                                        </Typography>
                                    </Box>

                                    <Stack spacing={1}>
                                        <Button
                                            variant="contained"
                                            onClick={() => handleOpenTrip(savedTrip)}
                                        >
                                            View Trip
                                        </Button>

                                        <Button
                                            color="error"
                                            variant="outlined"
                                            onClick={() => setSelectedTripId(savedTrip.id)}
                                        >
                                            Delete
                                        </Button>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}

            <Button
                variant="outlined"
                sx={{ mt: 4 }}
                onClick={() => navigate("/create-trip")}
            >
                + Create New Trip
            </Button>

            <Dialog
                open={isDeleteDialogOpen}
                onClose={() => setSelectedTripId(null)}
                aria-labelledby="delete-trip-title"
                aria-describedby="delete-trip-description"
            >
                <DialogTitle id="delete-trip-title">
                    Delete Trip?
                </DialogTitle>

                <DialogContent>
                    <DialogContentText id="delete-trip-description">
                        Are you sure you want to delete this trip? This action
                        cannot be undone.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={() => setSelectedTripId(null)}
                        color="inherit"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container >
    );
};

export default MyTrips;
