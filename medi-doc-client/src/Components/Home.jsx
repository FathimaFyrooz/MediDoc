import React from 'react';
import { Box, Button, Typography, Card, CardContent, Container } from '@mui/material';
import Navbar from './NavBar';
import Grid from "@mui/material/Grid2"
import '../Styles/Home.css';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const nav=useNavigate();

  return(
    <>
    <Navbar />
    <Container maxWidth="lg" sx={{ mt: 5, textAlign: 'center' }}>
      {/* Hero Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Doctor AI
        </Typography>
        <Typography variant="h6" component="p" gutterBottom>
          Your AI-Powered Medical Assistant
        </Typography>
       
      </Box>
  
      {/* Features Section */}
      <Typography variant="h4" component="h2" gutterBottom>
        Why Choose DoctorAI?
      </Typography>
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Symptom Analysis
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Enter symptoms and get a comprehensive diagnosis instantly.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Accurate Predictions
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Get medication suggestions tailored to your needs.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Secure Records
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Store patient details securely for easy future reference.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
  
      {/* How It Works Section */}
      <Typography variant="h4" component="h2" gutterBottom>
        How It Works
      </Typography>
      <Grid container spacing={4} justifyContent="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Step 1
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Enter your symptoms.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Step 2
              </Typography>
              <Typography variant="body2" color="textSecondary">
                DoctorAI analyzes the input.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                Step 3
              </Typography>
              <Typography variant="body2" color="textSecondary">
                View diagnosis and prescription.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Call to Action */}
      <Typography variant="h5" component="p" gutterBottom>
        Ready to get started?
      </Typography>
      <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          sx={{ mt: 3,backgroundColor:"#ff4d6d",'&:hover': {
            backgroundColor: '#ffccd5', 
            color: '#590d22',
          } }}
          onClick={() => nav('/details')}
        >
          Get Started
        </Button>
    </Container>
  </>
  );
  
};
 
export default Home;
