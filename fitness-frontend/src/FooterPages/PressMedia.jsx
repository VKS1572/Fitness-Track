import { ArrowLeft, Newspaper, Mail } from "lucide-react";
import "./FooterPages.css";

function PressMedia({ onBack }) {
  return (
    <div className="footer-page">
      <div className="footer-page-container">

        <button className="footer-page-back" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="footer-page-header">
          <p className="footer-page-eyebrow">COMPANY</p>

          <h1>Press & Media</h1>

          <p>
            Get the latest FitTrack news, product updates and media
            information.
          </p>
        </div>

        <div className="footer-page-content">

          <div className="footer-info-grid">

            <div className="footer-info-card">
              <Newspaper size={24} />

              <h2>FitTrack News</h2>

              <p>
                Stay updated with new FitTrack features, product improvements
                and important announcements.
              </p>
            </div>

            <div className="footer-info-card">
              <Mail size={24} />

              <h2>Media Inquiries</h2>

              <p>
                For press and media-related questions, please contact the
                FitTrack team.
              </p>

              <a href="mailto:media@fittrack.com">
                media@fittrack.com
              </a>
            </div>

          </div>

          <section>
            <h2>About FitTrack</h2>

            <p>
              FitTrack is a fitness platform designed to help people track
              their activities, understand their progress and build better
              fitness habits through technology.
            </p>
          </section>

          <section>
            <h2>Media Resources</h2>

            <p>
              Additional press materials, brand resources and company
              information will be made available here as FitTrack grows.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}

export default PressMedia;