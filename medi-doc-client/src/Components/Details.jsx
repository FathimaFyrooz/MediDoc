import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import NavBar from "./NavBar";
import Grid from "@mui/material/Grid2"
const Details = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    symptoms: "",
    diagnosis: "",
    prescription: "",
  });
  const [documents, setDocuments] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/save/", formData);
      alert(response.data.message);
      setFormData({
        name: "",
        age: "",
        symptoms: "",
        diagnosis: "",
        prescription: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to save details.");
    }
  };

  // const handleView = async () => {
  //   try {
  //     const response = await axios.get("http://127.0.0.1:8000/view/");
  //     setDocuments(response.data.documents);
  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to load document.");
  //   }
  // };

  const AskAI = async () => {
    try {
      // Use axios to send a POST request
      const response = await axios.post('http://127.0.0.1:8000/ai_analysis/', {
        symptoms: formData.symptoms,
      });
  
      const data = response.data;
  
      // Update form data with both diagnosis and prescription
      if (data.diagnosis && data.prescription) {
        setFormData((prev) => ({
          ...prev,
          diagnosis: data.diagnosis,
          prescription: data.prescription,
        }));
      } else {
        console.error('Incomplete data received from backend:', data);
      }
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
    }
  };

  return (
    <>
      <NavBar />
      <Box   sx={{ marginRight:0,marginLeft:0 ,padding: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          Doctor AI
        </Typography>
        {/* <Grid container spacing={8} sx={{width:"200%"}} > */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 4 }}>
              <Typography variant="h5" gutterBottom>
                Enter Medical Details
              </Typography>
              <form>
                <Grid container spacing={2} alignItems="center">
    {/* Name Field */}
    <Grid item xs={12} md={4}>
      <TextField
        label="Name"
        name="name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={formData.name}
        onChange={handleChange}
      />
    </Grid>

    {/* Age Field */}
    <Grid item xs={12} md={4}>
      <TextField
        label="Age"
        name="age"
        variant="outlined"
        type="number"
        fullWidth
        margin="normal"
        value={formData.age}
        onChange={handleChange}
      />
    </Grid>

    {/* Gender Field */}
    <Grid item  size={{md:4,xs:12,xm:6}}>
    <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Gender</InputLabel>
  <Select
    label="Gender"
    onChange={handleChange}
  >
    <MenuItem value={10}>Male</MenuItem>
    <MenuItem value={20}>Female</MenuItem>
    <MenuItem value={30}>Other</MenuItem>
  </Select>
</FormControl>
    </Grid>
  </Grid>
                  
                <TextField
                  label="Symptoms"
                  name="symptoms"
                  variant="outlined"
                  fullWidth
                  multiline
                  minRows={4}
                  margin="normal"
                  value={formData.symptoms}
                  onChange={handleChange}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={AskAI}
                  sx={{ marginTop: 2,backgroundColor:"#ff4d6d",'&:hover': {
                    backgroundColor: '#ffccd5', // Button background color on hover
                    color: '#590d22', // Text color on hover
                  },}}
                >
                  Ask to AI docter
                </Button>
                <TextField
                  label="Diagnosis"
                  name="diagnosis"
                  variant="outlined"
                  fullWidth
                  multiline
                  minRows={4}
                  margin="normal"
                  value={formData.diagnosis}
                  Input={{ readOnly: true }}
                />
                {/* <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={fetchPrescription}
                  sx={{ marginTop: 2 }}
                >
                  Get Prescription
                </Button> */}
                <TextField
                  label="Prescription"
                  name="prescription"
                  variant="outlined"
                  fullWidth
                  multiline
                  minRows={4}
                  margin="normal"
                  value={formData.prescription}
                  Input={{ readOnly: true }}
                />
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  onClick={handleSave}
                  sx={{ marginTop: 2,backgroundColor:"#ff758f",'&:hover': {
                    backgroundColor: '#ffccd5', // Button background color on hover
                    color: '#590d22', // Text color on hover
                  }, }}
                >
                  Save
                </Button>
              </form>
            </Paper>
          </Grid>
        {/* </Grid> */}
      </Box>
    </>
  );
};

export default Details;
