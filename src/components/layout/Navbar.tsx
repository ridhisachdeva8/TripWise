import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Navbar = () => {

  const navigate= useNavigate();

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Typography
        variant="h6"
        sx={{
          flexGrow:1,
          fontWeight:700,
        }}
        >
          TripWise ✈️
        </Typography>
        <Box sx={{ display:'flex', gap:2}}>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Destinations</Button>
          <Button color="inherit">About</Button>

          <Button variant="contained"
          onClick={()=> navigate("/create-trip")}>
            Plan Trip
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;