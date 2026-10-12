import { Card, CardContent, Container, Grid, Typography } from "@mui/material";
import {features} from "../../constants/features";

const Features = () => {
  return(
    <Container maxWidth="lg" sx={{py:8}}>
      <Typography
      variant="h4"
      align="center"
      sx={{
        fontWeight: 700,
        mb: 5,
      }}
      >
        Why Choose TripWise?
      </Typography>

      <Grid container spacing={3}>
        {features.map((feature)=>(
          <Grid key={feature.id} size={{xs: 12, md:4}}>
            <Card>
              <CardContent>
                <Typography
                variant="h6"
                sx={{ fontWeight: 600}}
                >
                  {feature.title}
                </Typography>

                <Typography
                variant="body1"
                color="text.secondary"
                sx={{mt:1}}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Features;