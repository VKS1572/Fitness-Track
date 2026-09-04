import {
  ArrowLeft,
  Users,
  Trophy,
  MessageCircle,
  Activity,
} from "lucide-react";

import "../Product/ProductPages.css";

function Community({ onBack }) {
  return (
    <div className="product-page">

      <button
        className="product-page-back"
        onClick={onBack}
      >
        <ArrowLeft size={18} />
        Back to Home
      </button>


      <div className="product-page-content">

        <span className="product-page-label">
          FITTRACK RESOURCE
        </span>


        <h1>
          Fitness <span>Community</span>
        </h1>


        <p className="product-page-description">
          Stay motivated, share your fitness journey, and connect
          with people working toward their own fitness goals.
        </p>


        <div className="product-feature-grid">

          <div className="product-feature-card">

            <Users size={28} />

            <h3>
              Connect With Others
            </h3>

            <p>
              Discover a community of people who are working
              toward healthier and stronger lifestyles.
            </p>

          </div>


          <div className="product-feature-card">

            <Trophy size={28} />

            <h3>
              Fitness Challenges
            </h3>

            <p>
              Take part in challenges and stay motivated
              to maintain your training routine.
            </p>

          </div>


          <div className="product-feature-card">

            <MessageCircle size={28} />

            <h3>
              Share Your Journey
            </h3>

            <p>
              Share achievements, experiences, and fitness
              milestones with the community.
            </p>

          </div>


          <div className="product-feature-card">

            <Activity size={28} />

            <h3>
              Stay Motivated
            </h3>

            <p>
              Get inspiration from other members and keep
              moving toward your fitness goals.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Community;