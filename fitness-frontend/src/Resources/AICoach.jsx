import {
  ArrowLeft,
  Brain,
  Target,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

import "../Product/ProductPages.css";

function AICoach({ onBack }) {
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
          AI <span>Coach</span>
        </h1>


        <p className="product-page-description">
          Get personalized fitness guidance based on your activity,
          goals, workout history, and progress.
        </p>


        <div className="product-feature-grid">

          <div className="product-feature-card">

            <Brain size={28} />

            <h3>
              Personalized Guidance
            </h3>

            <p>
              Receive fitness recommendations designed around
              your personal activity and goals.
            </p>

          </div>


          <div className="product-feature-card">

            <Target size={28} />

            <h3>
              Goal-Based Training
            </h3>

            <p>
              Get workout suggestions that align with your
              current fitness objectives.
            </p>

          </div>


          <div className="product-feature-card">

            <TrendingUp size={28} />

            <h3>
              Progress Insights
            </h3>

            <p>
              Understand your performance and discover areas
              where you can improve.
            </p>

          </div>


          <div className="product-feature-card">

            <Lightbulb size={28} />

            <h3>
              Smart Recommendations
            </h3>

            <p>
              Get useful training suggestions to help you stay
              consistent and make smarter fitness decisions.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AICoach;