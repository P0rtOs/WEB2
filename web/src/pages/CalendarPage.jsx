import React from "react";
import { Container, Typography, Box, Grid } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Calendar from "../components/Calendar";

const drawerWidth = 240;

const CalendarPage = () => {
  return (
    <>
      <Sidebar />
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          ml: `${drawerWidth}px`, // Відступ справа від сайдбару
          px: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Календар подій
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              sx={{
                bgcolor: "background.paper",
                p: 2,
                borderRadius: 1,
                boxShadow: 3,
              }}
            >
              <Calendar />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CalendarPage;
