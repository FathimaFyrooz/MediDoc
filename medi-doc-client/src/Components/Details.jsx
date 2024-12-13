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

  return (
    <div>
      <h1>Med <img src="/images\syringe1-removebg-preview.png" style={{ width: '53px', height: '130px', margin: '-26px 8px' }} /> Doc<img src="/images\healthcare.png" style={{ width: '100px', height: '130px', margin: '0 8px' }} /> </h1>
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
