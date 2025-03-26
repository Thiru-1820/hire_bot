import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button, ListGroup, Alert } from "react-bootstrap";

const CollegeAdmin = () => {
  const [emails, setEmails] = useState("");
  const [company, setCompany] = useState("");
  const [assignedCredentials, setAssignedCredentials] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You must be logged in as an admin to access this page.");
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!company.trim()) {
      setErrorMessage("Company name is required.");
      return;
    }

    const emailList = emails.split(",").map((email) => email.trim());

    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        "http://localhost:5000/api/admin/assign-credentials",
        { emails: emailList, company },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAssignedCredentials(response.data.credentials);
      setEmails("");
      setCompany("");
    } catch (error) {
      if (error.response && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Container className="mt-5">
      <h2>Assign Credentials to Candidates</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Enter Company Name</Form.Label>
          <Form.Control
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Enter your company name"
            required
          />
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Enter Candidate Emails (comma separated)</Form.Label>
          <Form.Control
            type="text"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="e.g., candidate1@example.com, candidate2@example.com"
            required
          />
        </Form.Group>

        <Button type="submit" className="mt-2">
          Assign Credentials
        </Button>
      </Form>

      {assignedCredentials.length > 0 && (
        <div className="mt-4">
          <h4>Assigned Credentials</h4>
          <ListGroup>
            {assignedCredentials.map(({ email, password, company }) => (
              <ListGroup.Item key={email}>
                {email} - <strong>{password}</strong> (Company: {company})
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
      <a href="/generate-mcq"><button className="mt-4 button">Generate MCQ Questions</button></a>
    </Container>
  );
};

export default CollegeAdmin;
