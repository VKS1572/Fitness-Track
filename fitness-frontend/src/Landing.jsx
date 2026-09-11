import {
  ArrowUpRight,
  Brain,
  Flame,
  Play,
  Activity,
  BarChart3,
} from "lucide-react";

import "./Landing.css";

function Landing({ onGetStarted, onSignIn,onOpenFooterPage }) {

  /* =====================================================
     EXPLORE FITTRACK
  ===================================================== */

  const handleExplore = () => {
    document
      .getElementById("features")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };


  /* =====================================================
     ABOUT
  ===================================================== */

  const handleAbout = () => {
    document
      .getElementById("about")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };


  /* =====================================================
     HOME
  ===================================================== */

  const handleHome = () => {
    document
      .getElementById("home")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };


  return (
    <div className="landing-page">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="landing-background">

        <div className="landing-overlay"></div>

        <div className="landing-glow landing-glow-one"></div>

        <div className="landing-glow landing-glow-two"></div>

      </div>


      {/* =================================================
          NAVBAR
      ================================================= */}

      <header className="landing-navbar">

        {/* LOGO */}

        <div
          className="landing-logo"
          onClick={handleHome}
        >

          <img
            src="/logo.png"
            alt="FitTrack"
            className="landing-logo-image"
          />


          <span className="landing-logo-text">
            Fit<span>Track</span>
          </span>

        </div>


        {/* NAVIGATION */}

        <nav className="landing-nav">

          <a
            href="#home"
            onClick={handleHome}
          >
            Home
          </a>

          <a
            href="#features"
            onClick={handleExplore}
          >
            Features
          </a>

          <a
            href="#about"
            onClick={handleAbout}
          >
            About
          </a>

        </nav>


        {/* NAV ACTIONS */}

        <div className="landing-nav-actions">

          <button
            className="landing-signin"
            onClick={onSignIn}
          >
            Sign In
          </button>


          <button
            className="landing-get-started"
            onClick={onGetStarted}
          >

            Get Started

            <ArrowUpRight size={16} />

          </button>

        </div>

      </header>


      {/* =================================================
          HERO
      ================================================= */}

      <main
        className="landing-hero"
        id="home"
      >

        {/* =================================================
            LEFT HERO CONTENT
        ================================================= */}

        <section className="landing-content">

          {/* EYEBROW */}

          <div className="landing-eyebrow">

            <span className="eyebrow-dot"></span>

            YOUR PERSONAL FITNESS COMPANION

          </div>


          {/* HEADING */}

          <h1>

            Train Smarter.

            <br />

            <span>
              Live Stronger.
            </span>

          </h1>


          {/* DESCRIPTION */}

          <p className="landing-description">

            Track your workouts, understand your progress,
            and build healthier habits with a fitness experience
            designed around you.

          </p>


          {/* CTA */}

          <div className="landing-cta-row">

            {/* START TRAINING */}

            <button
              className="primary-cta"
              onClick={onGetStarted}
            >

              Start Training

              <ArrowUpRight size={19} />

            </button>


            {/* EXPLORE */}

            <button
              className="secondary-cta"
              onClick={handleExplore}
            >

              <span className="play-icon">

                <Play
                  size={14}
                  fill="currentColor"
                />

              </span>

              Explore FitTrack

            </button>

          </div>


          {/* =================================================
              SOCIAL PROOF
          ================================================= */}

          <div className="landing-proof">

            <div className="landing-avatar-stack">

              <div className="landing-avatar landing-avatar-one">
                A
              </div>

              <div className="landing-avatar landing-avatar-two">
                R
              </div>

              <div className="landing-avatar landing-avatar-three">
                S
              </div>

              <div className="landing-avatar landing-avatar-four">
                +
              </div>

            </div>


            <div className="proof-text">

              <strong>
                12K+
              </strong>

              <span>
                people tracking their fitness
              </span>

            </div>

          </div>

        </section>


        {/* =================================================
            RIGHT HERO VISUAL
        ================================================= */}

        <section className="landing-visual">


          {/* ATHLETE */}

          <div className="athlete-container">

            <div className="athlete-glow"></div>


            <img
              src="/fitness-athlete.png"
              alt="FitTrack athlete"
              className="athlete-image"
            />

          </div>


          {/* =================================================
              CALORIES CARD
          ================================================= */}

          <div className="floating-card calories-card">

            <div className="floating-icon">

              <Flame size={20} />

            </div>


            <div className="floating-card-content">

              <span>
                Calories
              </span>

              <strong>
                550
              </strong>

              <small>
                kcal burned
              </small>

            </div>

          </div>


          {/* =================================================
              WORKOUT CARD
          ================================================= */}

          <div className="floating-card workout-card">

            <div className="floating-icon">

              <Activity size={20} />

            </div>


            <div className="floating-card-content">

              <span>
                Workout
              </span>

              <strong>
                01:24
              </strong>

              <small>
                active today
              </small>

            </div>

          </div>


          {/* =================================================
              AI COACH CARD
          ================================================= */}

          <div className="floating-card ai-card">

            <div className="floating-icon ai-icon">

              <Brain size={19} />

            </div>


            <div className="floating-card-content">

              <span>
                AI Coach
              </span>

              <strong>
                Ready
              </strong>

              <small>
                personalized plan
              </small>

            </div>

          </div>


          {/* =================================================
              WEEKLY GOAL
          ================================================= */}

          <div className="floating-progress">

            <div className="progress-top">

              <div>

                <span>
                  Weekly Goal
                </span>

                <strong>
                  82%
                </strong>

              </div>


              <BarChart3 size={18} />

            </div>


            <div className="landing-progress-line">

              <div className="landing-progress-value"></div>

            </div>


            <div className="progress-bottom">

              <span>
                4 workouts
              </span>

              <span>
                5 goal
              </span>

            </div>

          </div>

        </section>

      </main>


      {/* =====================================================
          FEATURES SECTION
      ===================================================== */}

      <section
        className="landing-features"
        id="features"
      >

        {/* FEATURE 01 */}

        <div className="feature-item feature-track">

          <div className="feature-overlay"></div>

          <div className="feature-number">
            01
          </div>

          <div className="feature-content">
            <strong>
              Track Every Workout
            </strong>

            <span>
              Keep your activity history organized
              and always know how much you have trained.
            </span>
          </div>

        </div>


        {/* FEATURE 02 */}

        <div className="feature-item feature-progress">

          <div className="feature-overlay"></div>

          <div className="feature-number">
            02
          </div>

          <div className="feature-content">
            <strong>
              Understand Your Progress
            </strong>

            <span>
              Analyze your performance, calories,
              workouts and fitness progress over time.
            </span>
          </div>

        </div>


        {/* FEATURE 03 */}

        <div className="feature-item feature-ai">

          <div className="feature-overlay"></div>

          <div className="feature-number">
            03
          </div>

          <div className="feature-content">
            <strong>
              Train With AI
            </strong>

            <span>
              Get personalized recommendations
              based on your fitness activity.
            </span>
          </div>

        </div>

      </section>


        {/* =====================================================
            ABOUT SECTION
        ===================================================== */}

        <section
          className="landing-about"
          id="about"
        >

          {/* BACKGROUND GLOW */}

          <div className="about-glow"></div>


          {/* LEFT CONTENT */}

          <div className="about-content">

            <span className="landing-section-label">
              ABOUT FITTRACK
            </span>

            <h2>
              Your fitness.
              <br />
              <span>Your journey.</span>
            </h2>

            <p>
              FitTrack brings your workouts, progress, goals
              and personalized recommendations together in
              one simple fitness experience.
            </p>

            <button
              className="about-cta"
              onClick={onGetStarted}
            >
              Start Your Journey

              <ArrowUpRight size={18} />
            </button>

          </div>


          {/* RIGHT FEATURES */}

          <div className="about-features">

            {/* 01 */}

            <div className="about-feature-card">

              <div className="about-feature-top">

                <span className="about-feature-number">
                  01
                </span>

                <Activity size={22} />

              </div>

              <div className="about-feature-line"></div>

              <h3>
                Workout Tracking
              </h3>

              <p>
                Record your workouts, activities and daily
                training so every session stays organized.
              </p>

            </div>


            {/* 02 */}

            <div className="about-feature-card">

              <div className="about-feature-top">

                <span className="about-feature-number">
                  02
                </span>

                <BarChart3 size={22} />

              </div>

              <div className="about-feature-line"></div>

              <h3>
                Progress Analytics
              </h3>

              <p>
                Understand your performance through clear
                insights into workouts, calories and progress.
              </p>

            </div>


            {/* 03 */}

            <div className="about-feature-card">

              <div className="about-feature-top">

                <span className="about-feature-number">
                  03
                </span>

                <Brain size={22} />

              </div>

              <div className="about-feature-line"></div>

              <h3>
                AI Recommendations
              </h3>

              <p>
                Get personalized recommendations designed
                around your activity, goals and fitness journey.
              </p>

            </div>

          </div>

        </section>


      {/* =====================================================
          SCROLL INDICATOR
      ===================================================== */}

      <div
        className="landing-scroll"
        onClick={handleExplore}
      >

        <span>
          SCROLL TO EXPLORE
        </span>

        <div className="scroll-line"></div>

      </div>
            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer className="landing-footer">

              <div className="landing-footer-main">

                {/* BRAND */}

                <div className="landing-footer-brand">

                  <div
                    className="landing-logo footer-logo"
                    onClick={handleHome}
                  >

                    <img
                      src="/logo.png"
                      alt="FitTrack"
                      className="landing-logo-image"
                    />

                    <span className="landing-logo-text">
                      Fit<span>Track</span>
                    </span>

                  </div>


                  <p className="footer-tagline">
                    Train smarter. Live stronger.
                  </p>


                  {/* SOCIALS */}

                  <div className="footer-socials">

                    {/* FACEBOOK */}

                    <a href="#" aria-label="Facebook">
                      <img
                        src="/fb.png"
                        alt="Facebook"
                      />
                    </a>


                    {/* INSTAGRAM */}

                    <a
                      href="https://www.instagram.com/fit_trackk/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <img
                        src="/insta.jpg"
                        alt="Instagram"
                      />
                    </a>


                    {/* X - DUMMY */}

                     <a href="#" aria-label="X">
                        <img src="/x.png" alt="X" />
                      </a>



                    {/* REDDIT */}

                    <a href="#" aria-label="Reddit">
                      <img
                        src="/reddit.png"
                        alt="Reddit"
                      />
                    </a>

                  </div>




                </div>


                {/* PRODUCT */}

                <div className="footer-column">
                  <h3>Product</h3>

                  <a href="#features">
                    Features
                  </a>

                 <button onClick={() => onOpenFooterPage("fitness")}>
                   Fitness Tracking
                 </button>

                 <button onClick={() => onOpenFooterPage("analytics")}>
                   Progress Analytics
                 </button>

                  <button onClick={onGetStarted}>
                    Sign Up
                  </button>

                  <button onClick={onSignIn}>
                    Login
                  </button>
                </div>


                {/* RESOURCES */}

                <div className="footer-column">
                  <h3>Resources</h3>

                  <button onClick={() => onOpenFooterPage("workouts")}>
                    Workout Plans
                  </button>

                  <button onClick={() => onOpenFooterPage("exercises")}>
                    Exercise Database
                  </button>

                  <button onClick={() => onOpenFooterPage("ai-coach")}>
                    AI Coach
                  </button>

                  <button onClick={() => onOpenFooterPage("community")}>
                    Community
                  </button>
                </div>


                {/* LEGAL */}

               <div className="footer-column">
                 <h3>Legal</h3>

                 <button onClick={() => onOpenFooterPage("terms")}>
                   Terms of Use
                 </button>

                 <button onClick={() => onOpenFooterPage("privacy")}>
                   Privacy Policy
                 </button>

                 <button onClick={() => onOpenFooterPage("cookies")}>
                   Cookie Policy
                 </button>

                 <button onClick={() => onOpenFooterPage("press")}>
                   Press & Media
                 </button>
               </div>


                {/* SUPPORT */}

                <div className="footer-column">
                  <h3>Support</h3>

                  <button onClick={() => onOpenFooterPage("about")}>
                    About Us
                  </button>

                  <button onClick={() => onOpenFooterPage("contact")}>
                    Contact Us
                  </button>

                  <button onClick={() => onOpenFooterPage("faq")}>
                    FAQ
                  </button>

                  <button onClick={() => onOpenFooterPage("help")}>
                    Help Center
                  </button>
                </div>

              </div>


              {/* FOOTER BOTTOM */}

              <div className="landing-footer-bottom">

                <div className="footer-copyright">
                  © 2026 FitTrack Inc. All rights reserved.
                </div>


                {/* APP DOWNLOAD BADGES */}

               <div className="footer-apps">

                 {/* APP STORE */}

                 <div className="footer-apps">
                   <div className="app-download-card">
                     <div className="app-image-box">
                       <img src="/app-store.png" alt="App Store" />
                     </div>
                   </div>

                   <div className="app-download-card">
                     <div className="app-image-box">
                       <img src="/googleplay.webp" alt="Google Play" />
                     </div>
                   </div>

                   <span className="apps-coming-soon">Coming Soon</span>
                 </div>


               </div>



              </div>

            </footer>

    </div>
  );
}


export default Landing;