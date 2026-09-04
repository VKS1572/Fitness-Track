import "./FooterPages.css";
import {
  ArrowLeft,
  ArrowUpRight,
  Code2,
  Dumbbell,
  Brain,
  Target,
  MapPin,
  Mail,
  Globe,
} from "lucide-react";


const AboutUs = ({ onBack }) => {
  return (
    <div className="footer-page about-page">
      {/* Background */}
      <div className="footer-page-glow"></div>

      {/* Back */}
      <button className="footer-page-back" onClick={onBack}>
        <ArrowLeft size={18} />
        Back to FitTrack
      </button>

      <main className="about-page-content">

        {/* HERO */}
        <section className="about-hero">
          <span className="footer-page-label">ABOUT US</span>

          <h1>
            Built with purpose.
            <br />
            <span>Designed for progress.</span>
          </h1>

          <p>
            FitTrack is a fitness platform built around a simple idea:
            technology should make fitness easier to understand, easier to
            track, and more motivating to improve.
          </p>
        </section>

        {/* WHY I BUILT IT */}
        <section className="about-story">
          <div className="about-story-text">
            <span className="footer-page-label">WHY I BUILT FITTRACK</span>

            <h2>
              Turning an idea into
              <span> something real.</span>
            </h2>

            <p>
              I built FitTrack to combine my interest in software development,
              backend engineering, modern web applications and AI into one
              meaningful product.
            </p>

            <p>
              Instead of creating just another workout tracker, the goal was
              to build an experience where users can record their activities,
              understand their progress and receive personalized guidance.
            </p>

            <p>
              FitTrack is also a practical representation of my journey as a
              developer — from designing the user experience to building APIs,
              services, authentication and data-driven features behind it.
            </p>
          </div>

          <div className="about-story-card">
            <div className="about-story-icon">
              <Target size={26} />
            </div>

            <span className="about-story-number"></span>

            <h3>My Goal</h3>

            <p>
              Make fitness progress simple, measurable and motivating through
              technology.
            </p>
          </div>
        </section>

        {/* DEVELOPER */}
        <section className="about-developer">
          <div className="about-developer-image">
            <img src="/dev.png" alt="Vikas Pradhan" />
          </div>

          <div className="about-developer-info">
            <span className="footer-page-label">MEET THE DEVELOPER</span>

            <h2>
              Vikas <span>Pradhan.</span>
            </h2>

            <h3>Developer & Creator of FitTrack</h3>

            <p className="about-developer-description">
              I enjoy building software that solves real problems and turning
              ideas into useful digital experiences. FitTrack is one of those
              projects where development, design and technology come together.
            </p>

            <div className="about-contact-info">
              <div>
                <MapPin size={17} />
                <span>Bangalore, India</span>
              </div>

              <div>
                <Mail size={17} />
                <span>vikaspradhan622@gmail.com</span>
              </div>
            </div>

            <div className="about-social-links">
              <a
                href="https://vikaspradhan.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe size={17} />
                Portfolio
                <ArrowUpRight size={14} />
              </a>

              <a
                href="https://www.linkedin.com/in/vikas-pradhan-14225021b/"
                target="_blank"
                rel="noopener noreferrer"
              >
               <span>in</span>
                LinkedIn
                <ArrowUpRight size={14} />
              </a>

              <a
                href="https://github.com/VKS1572"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>GH</span>
                GitHub
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </section>

        {/* VISION */}
        <section className="about-vision">
          <span className="footer-page-label">THE VISION</span>

          <h2>
            Technology should help you
            <br />
            <span>move forward.</span>
          </h2>

          <p>
            Fitness is not about one perfect workout. It is about consistency,
            understanding your progress and continuing to improve. FitTrack is
            designed around that mindset.
          </p>
        </section>

        {/* WHAT FITTRACK DOES */}
        <section className="about-values">
          <div className="about-value-card">
            <div className="about-value-icon">
              <Dumbbell size={23} />
            </div>
            <span>01</span>
            <h3>Track</h3>
            <p>
              Keep workouts and activities organized so every session becomes
              part of your journey.
            </p>
          </div>

          <div className="about-value-card">
            <div className="about-value-icon">
              <Code2 size={23} />
            </div>
            <span>02</span>
            <h3>Understand</h3>
            <p>
              Turn activity data into useful insights that help you understand
              your performance.
            </p>
          </div>

          <div className="about-value-card">
            <div className="about-value-icon">
              <Brain size={23} />
            </div>
            <span>03</span>
            <h3>Improve</h3>
            <p>
              Use personalized recommendations and technology to keep moving
              toward your goals.
            </p>
          </div>
        </section>

        {/* TECHNOLOGY */}
        <section className="about-tech">
          <span className="footer-page-label">BUILT WITH TECHNOLOGY</span>

          <h2>
            From backend
            <span> to experience.</span>
          </h2>

          <div className="about-tech-list">
            <span>Java</span>
            <span>Spring Boot</span>
            <span>Microservices</span>
            <span>React</span>
            <span>MySQL</span>
            <span>REST APIs</span>
            <span>JWT</span>
            <span>AI</span>
          </div>
        </section>

        {/* CTA */}
        <section className="about-final">
          <span className="footer-page-label">KEEP BUILDING</span>

          <h2>
            Train smarter.
            <br />
            <span>Live stronger.</span>
          </h2>

          <button onClick={onBack}>
            Explore FitTrack
            <ArrowUpRight size={18} />
          </button>
        </section>

      </main>
    </div>
  );
};

export default AboutUs;