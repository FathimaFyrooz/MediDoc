import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/Details.css'

const Details = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    symptoms: '',
    diagnosis: '',
    prescription: ''
  });
  const [documents, setDocuments] = useState('');
 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/save/', formData);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert('Failed to save details.');
    }
  };

  const handleView = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/view/');
      
      setDocuments(response.data.documents);
      console.log(documents)
      
    } catch (error) {
      console.error(error);
      alert('Failed to load document.');
    }
  };

  const fetchDiagnosis = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/get_diagnosis/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptoms: formData.symptoms }),
        });
        const data = await response.json();
        setFormData((prev) => ({ ...prev, diagnosis: data.diagnosis }));
    } catch (error) {
        console.error('Error fetching diagnosis:', error);
    }
};

  return (
    <div>
      <h1>Med <img src="/images\syringe1-removebg-preview.png" style={{ width: '53px', height: '130px', margin: '-26px 8px' }} /> Doc</h1>
      <div>
      <h2>Enter Medical Details</h2>
            <form>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input id="name" name="name" placeholder="Name" onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="age">Age:</label>
                    <input id="age" name="age" type="number" placeholder="Age" onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="symptoms">Symptoms:</label>
                    <textarea
                        id="symptoms"
                        name="symptoms"
                        placeholder="Symptoms"
                        onChange={handleChange}
                    ></textarea>
                    <button type="button" onClick={fetchDiagnosis}>
                        Get Diagnosis
                    </button>
                </div>
                <div>
                    <label htmlFor="diagnosis">Diagnosis:</label>
                    <textarea
                        id="diagnosis"
                        name="diagnosis"
                        placeholder="Diagnosis"
                        value={formData.diagnosis}
                        readOnly
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="prescription">Prescription:</label>
                    <textarea
                        id="prescription"
                        name="prescription"
                        placeholder="Prescription"
                        onChange={handleChange}
                    ></textarea>
                </div>
      
            </form>
        <button onClick={handleSave}>Save</button>
      </div>
      <div>
      <h2>View MediDoc</h2>
        <button onClick={handleView}>View MediDoc</button>
        {documents.length > 0 && (
          <div>
            <h3>Documents</h3>
            {documents.map((doc, index) => (
              <div key={index} style={{ margin: '20px 0' }}>
                <h4>{doc}</h4>
                <iframe
                  src={`http://127.0.0.1:8000/documents/pdf/${doc}`}
                  width="100%"
                  height="500px"
                  style={{ border: '1px solid #ccc' }}
                >
                  This browser does not support PDFs. Please download the document
                  <a 
                    href={`http://127.0.0.1:8000/documents/pdf/${doc}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    here
                  </a>.
                </iframe>
              </div>
            ))}
          </div>
        )}
        {documents.length === 0 && <p>No documents available.</p>}
      </div>
    </div>
  );
};
export default Details;
