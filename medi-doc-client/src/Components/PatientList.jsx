import React, { useEffect, useState } from 'react';
import { 
    Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Typography, 
    Alert, 
    CircularProgress 
} from '@mui/material';
import Navbar from './NavBar';

function PatientList() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Capture error

    useEffect(() => {
        fetch('http://localhost:8000/list_patients/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setPatients(data); // Update state with data
            })
            .catch((error) => {
                console.error('Error fetching patient data:', error);
                setError(error.message); // Set error message
            })
            .finally(() => setLoading(false)); // Stop loading
    }, []);

    const handleViewPDF = (patientId) => {
        window.open(`http://localhost:8000/view_pdf/${patientId}/`, '_blank');
    };
    
    const handleDelete = (patientId) => {
        // Send DELETE request to remove the patient
        fetch(`http://localhost:8000/delete_patient/${patientId}/`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // Remove the patient from the state list
            setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== patientId));
        })
        .catch((error) => {
            console.error('Error deleting patient:', error);
            setError(error.message); // Set error message
        });
    };


    return (
        <>
        <Navbar/>
        <div style={{ padding: '20px' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Patient Details given
            </Typography>

            {/* Display error if exists */}
            {error && <Alert severity="error">{error}</Alert>}

            {/* Show loading spinner */}
            {loading && <CircularProgress />}

            {/* Show table only if no loading and no error */}
            {!loading && !error && (
                <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Typography variant="h6">Name</Typography></TableCell>
                                <TableCell align="center"><Typography variant="h6">Actions</Typography></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {patients.length > 0 ? (
                                patients.map((patient) => (
                                    <TableRow key={patient.id}>
                                        <TableCell>{patient.name}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleViewPDF(patient.id)}
                                                sx={{backgroundColor:"#ff4d6d",'&:hover': {
                                                    backgroundColor: '#ffccd5', // Button background color on hover
                                                    color: '#590d22', // Text color on hover
                                                  },}}
                                            >
                                                View PDF
                                                
                                            </Button>

                                            {/* Delete Button */}
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => handleDelete(patient.id)}
                                                sx={{ marginLeft: 1, backgroundColor:"#ff4d6d",'&:hover': {
                                                    backgroundColor: '#ffccd5', // Button background color on hover
                                                    color: '#590d22', // Text color on hover
                                                  }, }}
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                
                                                sx={{ marginLeft: 1, backgroundColor:"#ff4d6d",'&:hover': {
                                                    backgroundColor: '#ffccd5', // Button background color on hover
                                                    color: '#590d22', // Text color on hover
                                                  }, }}
                                            >
                                                Update
                                            </Button>
                                          
                                                
                
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} align="center">
                                        <Typography>No patients available</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
        </>
    );
}

export default PatientList;

