import React, { useState } from 'react';
import axios from 'axios';

const Details = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    symptoms: '',
    diagnosis: '',
    prescription: ''
  });
  const [document, setDocument] = useState('');
  const [nameToView, setNameToView] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/save/', formData);
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert('Failed to save details.');
    }
  };

  const handleView = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/view/${nameToView}/`);
      setDocument(response.data.document);
    } catch (error) {
      console.error(error);
      alert('Failed to load document.');
    }
  };

  return (
    <div>
      <h1>MediDoc</h1>
      <div>
        <h2>Enter Medical Details</h2>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="age" placeholder="Age" type="number" onChange={handleChange} />
        <textarea name="symptoms" placeholder="Symptoms" onChange={handleChange}></textarea>
        <textarea name="diagnosis" placeholder="Diagnosis" onChange={handleChange}></textarea>
        <textarea name="prescription" placeholder="Prescription" onChange={handleChange}></textarea>
        <button onClick={handleSave}>Save</button>
      </div>
      <div>
        <h2>View MediDoc</h2>
        <input placeholder="Enter Name" onChange={(e) => setNameToView(e.target.value)} />
        <button onClick={handleView}>View MediDoc</button>
        {document && (
          <div>
            <h3>Document Content</h3>
            <pre>{document}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
