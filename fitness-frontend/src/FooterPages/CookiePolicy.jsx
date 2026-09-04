import { ArrowLeft } from "lucide-react";
import "./FooterPages.css";

function CookiePolicy({ onBack }) {
  return (
    <div className="footer-page">
      <div className="footer-page-container">

        <button className="footer-page-back" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="footer-page-header">
          <p className="footer-page-eyebrow">LEGAL</p>

          <h1>Cookie Policy</h1>

          <p>
            Learn how FitTrack uses cookies and similar technologies.
          </p>
        </div>

        <div className="footer-page-content">

          <section>
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small pieces of information stored on your device
              when you visit or use a website. They help applications remember
              information and provide a better user experience.
            </p>
          </section>

          <section>
            <h2>2. How FitTrack Uses Cookies</h2>
            <p>
              FitTrack may use cookies and similar technologies to support
              authentication, application functionality, security and user
              preferences.
            </p>
          </section>

          <section>
            <h2>3. Essential Cookies</h2>
            <p>
              Some cookies may be necessary for the application to function
              properly. These technologies can help maintain secure sessions
              and provide essential features.
            </p>
          </section>

          <section>
            <h2>4. Preference Cookies</h2>
            <p>
              Preference-related technologies may help remember settings such
              as application preferences and other choices you make while
              using FitTrack.
            </p>
          </section>

          <section>
            <h2>5. Managing Cookies</h2>
            <p>
              Most web browsers allow you to control or delete cookies through
              their settings. Disabling certain cookies may affect some
              functionality of the application.
            </p>
          </section>

          <section>
            <h2>6. Third-Party Technologies</h2>
            <p>
              Certain third-party services used by the application may use
              their own cookies or similar technologies. Their use is subject
              to the respective provider's policies.
            </p>
          </section>

          <section>
            <h2>7. Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Any changes
              will be published on this page.
            </p>
          </section>

          <section>
            <h2>8. Contact</h2>
            <p>
              If you have questions about our use of cookies, please contact
              the FitTrack support team.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}

export default CookiePolicy;