import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  MenuItem,
} from "@mui/material";
import NavBar from "./NavBar";
import Grid from "@mui/material/Grid2";

const Details = () => {
  const { id } = useParams(); // Get the patient ID from the URL (if present)
  const navigate = useNavigate(); // For navigation
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    symptoms: "",
    diagnosis: "",
    prescription: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      // Fetch patient details in "Edit" mode
      setIsLoading(true);
      axios
        .get(`http://127.0.0.1:8000/get_patient/${id}/`)
        .then((response) => {
          setFormData(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch patient data:", error);
          setIsLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (id) {
        // Edit mode: Update patient
        await axios.put(`http://127.0.0.1:8000/update_patient/${id}/`, formData);
        alert("Patient details updated successfully.");
      } else {
        // Add mode: Create new patient
        await axios.post("http://127.0.0.1:8000/save/", formData);
        alert("Patient added successfully.");
      }
      navigate("/"); // Redirect to patient list after save
    } catch (error) {
      console.error("Failed to save details:", error);
      alert("Failed to save details.");
    }
  };

  const AskAI = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/ai_analysis/", {
        symptoms: formData.symptoms,
      });

      const data = response.data;
      if (data.diagnosis && data.prescription) {
        setFormData((prev) => ({
          ...prev,
          diagnosis: data.diagnosis,
          prescription: data.prescription,
        }));
      } else {
        console.error("Incomplete data received from backend:", data);
      }
    } catch (error) {
      console.error("Error fetching AI analysis:", error);
    }
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <NavBar />
      <Box sx={{ marginRight: 0, marginLeft: 0, padding: 4 }}>
        <Typography variant="h3" gutterBottom align="center">
          {id ? "Edit Patient Details" : "Add Patient Details"}
        </Typography>
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
                <Grid item size={{ md: 4, xs: 12, xm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                    <Select
                      label="Gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
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
                sx={{
                  marginTop: 2,
                  backgroundColor: "#ff4d6d",
                  "&:hover": {
                    backgroundColor: "#ffccd5",
                    color: "#590d22",
                  },
                }}
              >
                Ask AI Doctor
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
                onClick={handleSubmit}
                sx={{
                  marginTop: 2,
                  backgroundColor: "#ff758f",
                  "&:hover": {
                    backgroundColor: "#ffccd5",
                    color: "#590d22",
                  },
                }}
              >
                {id ? "Update" : "Save"}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Box>
    </>
  );
};

export default Details;
