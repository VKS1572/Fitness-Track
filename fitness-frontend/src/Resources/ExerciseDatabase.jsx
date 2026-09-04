import {
  ArrowLeft,
  Search,
  Dumbbell,
  HeartPulse,
  Zap,
} from "lucide-react";

import "../Product/ProductPages.css";

function ExerciseDatabase({ onBack }) {
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
          Exercise <span>Database</span>
        </h1>


        <p className="product-page-description">
          Explore exercises based on muscle groups, workout goals,
          and training difficulty to build better workouts.
        </p>


        <div className="product-feature-grid">

          <div className="product-feature-card">

            <Search size={28} />

            <h3>
              Find Exercises
            </h3>

            <p>
              Quickly discover exercises and find the right
              movements for your workout.
            </p>

          </div>


          <div className="product-feature-card">

            <Dumbbell size={28} />

            <h3>
              Muscle Groups
            </h3>

            <p>
              Explore exercises for different muscle groups
              and create balanced training sessions.
            </p>

          </div>


          <div className="product-feature-card">

            <HeartPulse size={28} />

            <h3>
              Fitness Goals
            </h3>

            <p>
              Choose exercises according to your strength,
              endurance, cardio, or general fitness goals.
            </p>

          </div>


          <div className="product-feature-card">

            <Zap size={28} />

            <h3>
              Difficulty Levels
            </h3>

            <p>
              Find exercises suitable for beginner,
              intermediate, and advanced training levels.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ExerciseDatabase;