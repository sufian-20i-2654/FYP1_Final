import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import videoBG from './video6.mp4';
import OverlayVideos from './video3.mp4';
import OverlayVideos1 from './video5.mp4';


const Home = ({ articleData, setArticleData }) => {
  const navigate = useNavigate();
  const imageNames = ['iris','sam'];
  const backNames = ['Background1', 'Background2','Background3','Background4'];
  const langNames=['English-Male','English-Female','Urdu-Male','Urdu-Female','Portuguese-Male','Portuguese-Female','Russian-Male','Russian-Female'];
  const [selectedImageName, setSelectedImageName] = useState(imageNames[0]);
  const [selectedBackName, setSelectedBackName] = useState(backNames[0]);
  const [selectedlangName, setSelectedlangName] = useState(langNames[0]);
  const [showImage, setShowImage] = useState(true); // New state to track display
  const [userText, setUserText] = useState("");
  const [URLText, setURLText] = useState("");
  const [overlayVideoSource, setOverlayVideoSource] = useState('');
  const overlayVideoSources = {
    'iris': OverlayVideos1,
    'sam': OverlayVideos,
  };

  const handleImageDropdownChange = (event) => {
    const selectedName = event.target.value;
    setSelectedImageName(selectedName);
    setShowImage(true);
    if (overlayVideoSources[selectedName]) {
      setOverlayVideoSource(overlayVideoSources[selectedName]);
    } else {
      setOverlayVideoSource(''); // Reset or keep the current video if no mapping found
    }
  };
  const handleBackDropdownChange = (event) => {
    setSelectedBackName(event.target.value);
    setShowImage(false);
  };

  const handleLangDropdownChange = (event) => {
    setSelectedlangName(event.target.value);
  };
  const handleTextInputChange = (event) => {
    setUserText(event.target.value);
  };
  const handleTextInputChange1 = (event) => {
    setURLText(event.target.value);
  };
  const sendDataToFlaskApi = async () => {
    try {
      const response = await fetch('http://localhost:5000/submit-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedImageName,
          selectedBackName,
          userText,
          URLText,
          selectedlangName,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Response from Flask API:', data);
      console.log('Article titles:', data.articles.map(article => article.title));
  
      if (Array.isArray(data.articles)) {
        console.log('Received data is an array');
        setArticleData({ titles: data.articles.map(article => article.title), links: data.articles.map(article => article.link),source: data.articles.map(article => article.source) });
        console.log('Article Data Set',articleData)
      } else {
        console.error('Invalid data structure received from Flask API:', data);
      }
    } catch (error) {
      console.error('Error sending data to Flask API:', error);
    }
  };
  const goToArticleList = () => {
    navigate('/article-list');
  };
  return (
          
    <Container fluid className="app-container">
        <div className="video-container">
          <video autoPlay loop muted className="background-video">
            <source src={videoBG} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {overlayVideoSource && (
            <video autoPlay loop muted className="overlay-video" key={overlayVideoSource}>
            <source src={overlayVideoSource} type="video/mp4" />
        </video>
        
          )}
        </div>

            
          {/* Main content row */}
          <Row>
        <Col md={4} className="side-panel">
          {/* Image Dropdown */}
          <Form.Group controlId="imageSelectDropdown" className="form-group-spacing">
            <Form.Label>Select the Avatar</Form.Label>
            <Form.Control as="select" onChange={handleImageDropdownChange} value={selectedImageName}>
              {imageNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          
          {/* Background Dropdown */}
          <Form.Group controlId="backSelectDropdown" className="form-group-spacing">
            <Form.Label>Select the Background</Form.Label>
            <Form.Control as="select" onChange={handleBackDropdownChange} value={selectedBackName}>
              {backNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="langSelectDropdown" className="form-group-spacing">
            <Form.Label>Select the Language</Form.Label>
            <Form.Control as="select" onChange={handleLangDropdownChange} value={selectedlangName}>
              {langNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </Form.Control>
          </Form.Group>
          {/* Text Input */}
          <Form.Group controlId="userTextInput">
            <Form.Label className="userText">User Text</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter text" 
              value={userText} 
              onChange={handleTextInputChange} 
            />
          </Form.Group>
          <Form.Group controlId="userTextInput">
            <Form.Label className="urltext">URL</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter URL" 
              value={URLText} 
              onChange={handleTextInputChange1} 
            />
          </Form.Group>
          
          {/* Image Preview */}
          <div className="image-preview">
            <img 
              src={`${process.env.PUBLIC_URL}/images/${selectedImageName}.png`} 
              alt={selectedImageName} 
              className="img-fluid" 
            />
          </div>

          {/* Background Preview */}
          <div className="background-preview">
            <img 
              src={`${process.env.PUBLIC_URL}/images/${selectedBackName}.jpg`} 
              alt={selectedBackName} 
              className="img-fluid" 
            />
          </div>

          <div className="button-group">
            <Button variant="primary" onClick={sendDataToFlaskApi}>Send Data to Flask API</Button>
            <Button variant="secondary" onClick={goToArticleList} className="ml-2">Go to Article List</Button>
          </div>
        </Col>

        
      </Row>
    </Container>
      );
    };

export default Home;
