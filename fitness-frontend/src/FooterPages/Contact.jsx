import { ArrowLeft, Mail, MessageCircle } from "lucide-react";
import "./FooterPages.css";

function Contact({ onBack }) {
  const handleSubmit = (event) => {
    event.preventDefault();

    alert("Thanks for contacting FitTrack. We’ll get back to you soon!");
  };

  return (
    <div className="footer-page">
      <div className="footer-page-container">

        <button className="footer-page-back" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="footer-page-header">
          <p className="footer-page-eyebrow">SUPPORT</p>

          <h1>Contact Us</h1>

          <p>
            Have a question or need help? Send us a message and our support
            team will get back to you.
          </p>
        </div>

        <div className="footer-page-content">

          <div className="footer-info-grid">

            <div className="footer-info-card">
              <Mail size={24} />

              <h2>Email Support</h2>

              <p>
                For general questions and support requests, reach out to our
                support team.
              </p>

              <a href="mailto:support@fittrack.com">
                support@fittrack.com
              </a>
            </div>

            <div className="footer-info-card">
              <MessageCircle size={24} />

              <h2>Need Help?</h2>

              <p>
                Check our FAQ and Help Center for quick answers to common
                questions about FitTrack.
              </p>
            </div>

          </div>

          <form className="footer-contact-form" onSubmit={handleSubmit}>

            <div>
              <label htmlFor="name">Name</label>

              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="subject">Subject</label>

              <input
                id="subject"
                type="text"
                placeholder="What can we help you with?"
                required
              />
            </div>

            <div>
              <label htmlFor="message">Message</label>

              <textarea
                id="message"
                rows="6"
                placeholder="Write your message..."
                required
              ></textarea>
            </div>

            <button type="submit">
              Send Message
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

export default Contact;