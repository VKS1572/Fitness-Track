import {
  ArrowLeft,
  Activity,
  Flame,
  Clock,
  Target,
} from "lucide-react";

import "./ProductPages.css";

function FitnessTracking({ onBack }) {
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
          Fitness <span>Tracking</span>
        </h1>


        <p className="product-page-description">
          Track every workout, monitor your activity, and keep your
          fitness journey organized in one place.
        </p>


        <div className="product-feature-grid">

          <div className="product-feature-card">

            <Activity size={28} />

            <h3>
              Workout Tracking
            </h3>

            <p>
              Record your workouts and keep your complete
              activity history organized.
            </p>

          </div>


          <div className="product-feature-card">

            <Flame size={28} />

            <h3>
              Calories
            </h3>

            <p>
              Monitor calories burned during your
              fitness activities.
            </p>

          </div>


          <div className="product-feature-card">

            <Clock size={28} />

            <h3>
              Workout Duration
            </h3>

            <p>
              Track how much time you spend training
              and stay consistent.
            </p>

          </div>


          <div className="product-feature-card">

            <Target size={28} />

            <h3>
              Fitness Goals
            </h3>

            <p>
              Set goals and stay focused on your
              fitness progress.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default FitnessTracking;