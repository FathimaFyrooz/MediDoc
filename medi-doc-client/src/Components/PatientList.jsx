import { useEffect, useState } from 'react';
import "../Styles/PatientList.css";

function PatientList() {
    const [patients, setPatients] = useState([]);
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
                console.log("Fetched patient data:", data); // Debug log
                setPatients(data); // Update state with data
            })
            .catch((error) => {
                console.error('Error fetching patient data:', error);
                setError(error.message); // Set error message
            });
    }, []);

    const handleViewPDF = (patientId) => {
        window.open(`http://localhost:8000/view_pdf/${patientId}/`, '_blank');
    };

    return (
        <div>
            <h1>Patient Details</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.length > 0 ? (
                        patients.map((patient) => (
                            <tr key={patient.id}>
                                <td>{patient.name}</td>
                                <td>
                                    <button onClick={() => handleViewPDF(patient.id)}>
                                        View PDF
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2">No patients available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default PatientList;
