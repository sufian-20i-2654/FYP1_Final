import React, { useState } from 'react';
import axios from 'axios';
import './EditableText.css';
import videoBG from './video2.mp4';



const EditableText = ({ initialText }) => {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const sendEditedText = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/edited-text', {
        editedText: text,
      });
    } catch (error) {
      console.error('Error sending edited text:', error);
    }
  };

  const handleSaveClick = () => {
    sendEditedText(text);
    setIsEditing(false);
  };

  return (
    <div className="editable-text container my-4">
      <div className="video-container">
              <video autoPlay loop muted className="background-video">
                <source src={videoBG} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
      </div>
      <h2 className="mb-3">Edit Text</h2>
      <div className="box"onDoubleClick={handleDoubleClick}>
        {isEditing ? (
          <div>
            <textarea
              className="form-control"
              value={text}
              onChange={handleChange}
              style={{ height: 'auto' }} // Adjust height based on content
              autoFocus
            />
            <button
              className="btn btn-primary mt-2"
              onClick={handleSaveClick}
            >
              Save
            </button>
          </div>
        ) : (
          <div className="editable-content border p-2 cursor-pointer mb-2">
            {text}
          </div>
        )}
      </div>
    </div>
  );
};


export default EditableText;
