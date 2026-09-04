import { ArrowLeft } from "lucide-react";
import "./FooterPages.css";

function Privacy({ onBack }) {
  return (
    <div className="footer-page">
      <div className="footer-page-container">

        <button className="footer-page-back" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="footer-page-header">
          <p className="footer-page-eyebrow">LEGAL</p>

          <h1>Privacy Policy</h1>

          <p>
            Learn how FitTrack collects, uses and protects your information.
          </p>
        </div>

        <div className="footer-page-content">

          <section>
            <h2>1. Information We Collect</h2>
            <p>
              FitTrack may collect information that you provide when creating
              an account, managing your profile, recording fitness activities
              or interacting with the application.
            </p>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>
              We use your information to provide fitness tracking features,
              maintain your account, display activity history, calculate
              progress and provide personalized fitness recommendations.
            </p>
          </section>

          <section>
            <h2>3. Fitness Activity Data</h2>
            <p>
              Information such as workout activities, duration, calories,
              activity type and progress may be stored to provide the core
              FitTrack experience.
            </p>
          </section>

          <section>
            <h2>4. Account Security</h2>
            <p>
              We take reasonable measures to protect your account information.
              You are responsible for keeping your login credentials secure
              and should notify us if you believe your account has been
              accessed without authorization.
            </p>
          </section>

          <section>
            <h2>5. Data Sharing</h2>
            <p>
              FitTrack does not sell your personal information. Information
              may be processed or shared with service providers when necessary
              to operate and maintain the application.
            </p>
          </section>

          <section>
            <h2>6. Cookies and Similar Technologies</h2>
            <p>
              FitTrack may use cookies or similar technologies to support
              application functionality, security and user preferences.
            </p>
          </section>

          <section>
            <h2>7. Your Choices</h2>
            <p>
              You may review and update certain account information through
              your FitTrack profile and application settings.
            </p>
          </section>

          <section>
            <h2>8. Changes to This Policy</h2>
            <p>
              This Privacy Policy may be updated periodically. Any changes
              will be reflected on this page.
            </p>
          </section>

          <section>
            <h2>9. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please contact
              the FitTrack support team.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}

export default Privacy;