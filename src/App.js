import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import './App.css'

const App = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        recaptchaToken: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          if (!formData.recaptchaToken) {
              alert('Please complete the reCAPTCHA challenge.');
              return;
          }
  
          // Submit form data to the correct endpoint
          await axios.post('http://localhost:5000/submit-form', formData); // Corrected URL
          alert('Form submitted successfully!');
      } catch (error) {
          console.error('Error submitting form:', error);
          alert('Error submitting form. Please try again later.');
      }
  };
  

    return (
        <div className="container mt-5">
            <h1>Aryan ko Mail Bhejo</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                </Form.Group>
                <Form.Group controlId="formMessage">
                    <Form.Label>Message</Form.Label>
                    <Form.Control as="textarea" rows={3} name="message" value={formData.message} onChange={handleChange} required />
                </Form.Group>
                <ReCAPTCHA
                    sitekey="6Lfyn6cpAAAAALJp5-Bzg1NXYGBEQ4PokDZ9hyIx"
                    onChange={(token) => setFormData({ ...formData, recaptchaToken: token })}
                />
                <Button variant="primary" type="submit" className="mt-3">
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default App;
