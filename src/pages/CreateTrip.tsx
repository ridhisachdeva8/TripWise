import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Alert,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tripSchema } from "../schemas/tripSchema";
import type {
  CreateTripFormInput,
  CreateTripFormData,
} from "../schemas/tripSchema";
import { useMutation } from "@tanstack/react-query";
import { createTrip } from "../api/tripApi";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateTrip = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTripFormInput>({
    resolver: zodResolver(tripSchema),

    defaultValues: {
      destination: "",
      budget: 0,
      startDate: "",
      endDate: "",
      travelers: 1,
      travelType: "",
    },
  });

  //her state ke liye ek hi snackbar bana rhe hai
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: createTrip,

    //onSuccess sirf test ke liye abhi
    onSuccess: (_response, variables) => {
      console.log("API Response:", _response);
      console.log("Form Data:", variables);

      const savedTrip = {
        id: Date.now(),
        trip: variables,
        itinerary: _response.data,
        createdAt: new Date().toISOString(),
      };

      const existingTrips = JSON.parse(
        localStorage.getItem("tripwise-trips") || "[]"
      );

      localStorage.setItem(
        "tripwise-trips",
        JSON.stringify([...existingTrips, savedTrip])
      );
      //success hote hi state update hogi.
      setSnackbarMessage("Trip Created Successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      //Ye form ko defaultValues par le aata hai
      reset();

      setTimeout(() => {
        navigate("/trip-summary", {
          state: {
            trip: variables,
            itinerary: _response.data,
          },
        });
      }, 2000);
    },

    //onError jab API fail ho jayegi tab
    onError: (error, variables) => {
      console.log("Error:", error);
      console.log("Submitted Data:", variables);

      if (axios.isAxiosError(error)) {
        setSnackbarMessage("Failed to create trip");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
      // console.log(error);
    },
  });

  // console.log(errors);

  const onSubmit = (data: CreateTripFormData) => {
    //console.log(data);
    mutation.mutate(data);
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          mb: 4,
        }}
      >
        Create Your Trip
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Destination"
            margin="normal"
            error={!!errors.destination}
            helperText={errors.destination?.message}
            {...register("destination")}
          />

          <TextField
            fullWidth
            label="Budget"
            type="number"
            margin="normal"
            error={!!errors.budget}
            helperText={errors.budget?.message}
            {...register("budget", {
              valueAsNumber: true,
            })}
          />

          <TextField
            fullWidth
            type="date"
            margin="normal"
            label="Start Date"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            error={!!errors.startDate}
            helperText={errors.startDate?.message}
            {...register("startDate")}
          />

          <TextField
            fullWidth
            type="date"
            margin="normal"
            label="End Date"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            error={!!errors.endDate}
            helperText={errors.endDate?.message}
            {...register("endDate")}
          />

          <TextField
            fullWidth
            label="Number of Travelers"
            type="number"
            margin="normal"
            error={!!errors.travelers}
            helperText={errors.travelers?.message}
            {...register("travelers", {
              valueAsNumber: true,
            })}
          />

          {/* <TextField
            fullWidth
            label="Travel Type"
            margin="normal"
            error={!!errors.travelType}
            helperText={errors.travelType?.message}
            {...register("travelType")}
          /> */}

          <FormControl fullWidth margin="normal" error={!!errors.travelType}>
            <InputLabel id="travel-type-label">Travel Type</InputLabel>

            <Controller
              name="travelType"
              control={control}
              render={({ field }) => (
                <Select
                  labelId="travel-type-label"
                  label="Travel Type"
                  {...field}
                  displayEmpty
                >
                  <MenuItem value="">Select Travel Type</MenuItem>

                  <MenuItem value="Solo">Solo</MenuItem>

                  <MenuItem value="Family">Family</MenuItem>

                  <MenuItem value="Friends">Friends</MenuItem>

                  <MenuItem value="Couple">Couple</MenuItem>

                  <MenuItem value="Business">Business</MenuItem>
                </Select>
              )}
            />

            <FormHelperText>{errors.travelType?.message}</FormHelperText>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating Trip..." : "Create Trip"}
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setOpenSnackbar(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreateTrip;
