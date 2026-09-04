import {
  ArrowLeft,
  Dumbbell,
  Flame,
  HeartPulse,
  Target,
} from "lucide-react";

import "../Product/ProductPages.css";

function WorkoutPlans({ onBack }) {
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
          Workout <span>Plans</span>
        </h1>


        <p className="product-page-description">
          Find workout plans designed for different fitness goals
          and build a training routine that works for you.
        </p>


        <div className="product-feature-grid">

          <div className="product-feature-card">

            <Dumbbell size={28} />

            <h3>
              Strength Training
            </h3>

            <p>
              Build strength with structured resistance
              and muscle-building workouts.
            </p>

          </div>


          <div className="product-feature-card">

            <Flame size={28} />

            <h3>
              Weight Loss
            </h3>

            <p>
              Follow active workout routines designed to
              support your fitness and weight-loss goals.
            </p>

          </div>


          <div className="product-feature-card">

            <HeartPulse size={28} />

            <h3>
              Cardio
            </h3>

            <p>
              Improve endurance and cardiovascular fitness
              with focused cardio workouts.
            </p>

          </div>


          <div className="product-feature-card">

            <Target size={28} />

            <h3>
              Custom Goals
            </h3>

            <p>
              Choose workouts based on your personal
              fitness goals and training needs.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default WorkoutPlans;