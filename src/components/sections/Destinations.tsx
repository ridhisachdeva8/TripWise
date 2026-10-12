import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { destinations } from "../../constants/destinations";
const Destinations = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: 700,
          mb: 5,
        }}
      >
        Popular Destinations
      </Typography>

      <Grid container spacing={3}>
        {destinations.map((destination) => (
          <Grid key={destination.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                height: "100%",
              }}
            >
              <CardMedia
                component="img"
                height="220"
                image={destination.image}
                alt={destination.name}
              />

              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {destination.name}
                </Typography>

                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {destination.country}
                </Typography>

                <Button variant="contained" fullWidth>
                  Explore
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Destinations;
