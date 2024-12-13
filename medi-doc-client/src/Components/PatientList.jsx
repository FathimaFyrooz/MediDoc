import { useEffect, useState } from 'react';

function PatientList() {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        fetch('/list_patients/')
            .then((response) => response.json())
            .then((data) => setPatients(data));
    }, []);

    const handleViewPDF = (patientId) => {
        window.open(`/view_pdf/${patientId}/`, '_blank');
    };

    return (
        <div>
            <h1>Patient Details</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient) => (
                        <tr key={patient.id}>
                            <td>{patient.name}</td>
                            <td>
                                <button onClick={() => handleViewPDF(patient.id)}>View PDF</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PatientList;
