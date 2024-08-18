import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData(e.target);

    try {
      await fetch('http://localhost:5000/message', {
        method: 'POST',
        body: formData,
      });
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <section className="contact-us-section">
      <div className="container">
        <h2 className="contact-us-title">Contact Us</h2>
        <div className="contact-info">
          <p>Email: <a href="mailto:abdiwolih@gmail.com">abdiwolih@gmail.com</a></p>
          <p>WhatsApp: <a href="https://wa.me/97455675949" target="_blank" rel="noopener noreferrer">+974 5567 5949</a></p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>

        {submitted && (
          <div className="message-sent">
            <p>Your message has been sent successfully!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactUs;
