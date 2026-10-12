import { Box, Button, Container, Grid, Stack, Typography } from "@mui/material";

const Hero = () => {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid size={6}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
            Plan Your Dream Journey
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Discover destinations, explore attractions,and create personalized
            travel plans.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button variant="contained" size="large">
              Start Planning
            </Button>

            <Button variant="outlined" size="large">
              Explore
            </Button>
          </Stack>
        </Grid>

        <Grid size={6}>
          <Box
            sx={{
              height: 400,
              backgroundColor: "#f5f5f5",
              borderRadius: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Travel Image Here
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box></Box>
      </Box>
    </Container>
  );
};

export default Hero;
