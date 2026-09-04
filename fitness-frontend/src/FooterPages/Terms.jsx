import { ArrowLeft } from "lucide-react";
import "./FooterPages.css";

function Terms({ onBack }) {
  return (
    <div className="footer-page">
      <div className="footer-page-container">

        <button className="footer-page-back" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="footer-page-header">
          <p className="footer-page-eyebrow">LEGAL</p>
          <h1>Terms of Use</h1>
          <p>
            Please read these terms carefully before using FitTrack.
          </p>
        </div>

        <div className="footer-page-content">

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using FitTrack, you agree to be bound by
              these Terms of Use. If you do not agree with these terms,
              please do not use the service.
            </p>
          </section>

          <section>
            <h2>2. Use of FitTrack</h2>
            <p>
              FitTrack provides tools for tracking workouts, monitoring
              fitness activity, viewing progress and receiving fitness
              recommendations.
            </p>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <p>
              You are responsible for maintaining the accuracy of your
              account information and for keeping your account secure.
            </p>
          </section>

          <section>
            <h2>4. Fitness Information</h2>
            <p>
              Information and recommendations provided by FitTrack are
              intended for general fitness purposes and should not be
              considered professional medical advice.
            </p>
          </section>

          <section>
            <h2>5. Acceptable Use</h2>
            <p>
              You agree not to misuse the service, attempt unauthorized
              access, interfere with the application or use FitTrack
              for unlawful purposes.
            </p>
          </section>

          <section>
            <h2>6. Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. Updated terms
              will be published on this page.
            </p>
          </section>

          <section>
            <h2>7. Contact</h2>
            <p>
              If you have questions about these Terms of Use, please
              contact the FitTrack support team.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}

export default Terms;