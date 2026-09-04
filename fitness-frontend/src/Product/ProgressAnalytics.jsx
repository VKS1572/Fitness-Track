import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Flame,
  Trophy,
} from "lucide-react";

import "./ProductPages.css";

function ProgressAnalytics({ onBack }) {
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
          FITTRACK PRODUCT
        </span>


        <h1>
          Progress <span>Analytics</span>
        </h1>


        <p className="product-page-description">
          Understand your fitness performance with clear insights
          into workouts, calories, consistency, and progress over time.
        </p>


        <div className="product-feature-grid">

          <div className="product-feature-card">

            <BarChart3 size={28} />

            <h3>
              Workout Statistics
            </h3>

            <p>
              See your workout activity and understand
              how consistently you are training.
            </p>

          </div>


          <div className="product-feature-card">

            <TrendingUp size={28} />

            <h3>
              Progress Tracking
            </h3>

            <p>
              Follow your fitness progress and identify
              improvements over time.
            </p>

          </div>


          <div className="product-feature-card">

            <Flame size={28} />

            <h3>
              Calories Analysis
            </h3>

            <p>
              Review your calorie activity and understand
              your overall workout performance.
            </p>

          </div>


          <div className="product-feature-card">

            <Trophy size={28} />

            <h3>
              Achievements
            </h3>

            <p>
              Stay motivated by tracking milestones
              and reaching your fitness goals.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProgressAnalytics;