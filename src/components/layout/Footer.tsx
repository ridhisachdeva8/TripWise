import { Box, Container, Link, Stack, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: "#f5f5f5",
        py: 4,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            TripWise ✈️
          </Typography>

          <Stack direction="row" spacing={3}>
            <Link href="#" underline="none">
              Home
            </Link>

            <Link href="#" underline="none">
              Destinations
            </Link>

            <Link href="#" underline="none">
              About
            </Link>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            @ 2026 TripWise. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
