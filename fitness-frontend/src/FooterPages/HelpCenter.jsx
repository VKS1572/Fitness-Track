import {
  ArrowLeft,
  BookOpen,
  Dumbbell,
  BarChart3,
  User,
  Settings,
} from "lucide-react";
import "./FooterPages.css";

function HelpCenter({ onBack }) {
  const helpTopics = [
    {
      icon: <BookOpen size={24} />,
      title: "Getting Started",
      description:
        "Learn how to create your account, sign in and start using FitTrack.",
    },
    {
      icon: <Dumbbell size={24} />,
      title: "Fitness Tracking",
      description:
        "Learn how to record workouts and manage your fitness activities.",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Progress & Analytics",
      description:
        "Understand your activity history and track your fitness progress.",
    },
    {
      icon: <User size={24} />,
      title: "Profile",
      description:
        "Manage your profile information and keep your account details up to date.",
    },
    {
      icon: <Settings size={24} />,
      title: "Account Settings",
      description:
        "Manage your application preferences and account settings.",
    },
  ];

  return (
    <div className="footer-page">
      <div className="footer-page-container">

        <button className="footer-page-back" onClick={onBack}>
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="footer-page-header">
          <p className="footer-page-eyebrow">SUPPORT</p>

          <h1>Help Center</h1>

          <p>
            Find useful information and guidance to help you get the most out
            of FitTrack.
          </p>
        </div>

        <div className="footer-page-content">

          <div className="footer-info-grid">
            {helpTopics.map((topic, index) => (
              <div className="footer-info-card" key={index}>
                <div>{topic.icon}</div>

                <h2>{topic.title}</h2>

                <p>{topic.description}</p>
              </div>
            ))}
          </div>

          <section>
            <h2>Still Need Help?</h2>

            <p>
              If you cannot find the information you are looking for, visit
              the Contact Us page and send a message to the FitTrack support
              team.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}

export default HelpCenter;