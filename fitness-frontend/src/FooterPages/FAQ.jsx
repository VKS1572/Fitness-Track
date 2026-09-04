import { ArrowLeft, ChevronDown } from "lucide-react";
import "./FooterPages.css";

function FAQ({ onBack }) {
  const faqs = [
    {
      question: "What is FitTrack?",
      answer:
        "FitTrack is a fitness tracking platform that helps you record workouts, monitor your activities, analyze your progress and receive personalized fitness recommendations.",
    },
    {
      question: "How do I create a FitTrack account?",
      answer:
        "Click the Get Started button on the FitTrack home page and complete the registration form. Once your account is created, you can sign in and start tracking your fitness activities.",
    },
    {
      question: "Can I track my workouts?",
      answer:
        "Yes. FitTrack allows you to record your fitness activities and keep a history of your workouts, including activity type, duration and other relevant information.",
    },
    {
      question: "Can I see my fitness progress?",
      answer:
        "Yes. Your activity history can be used to view progress and understand your fitness patterns through the analytics features.",
    },
    {
      question: "Does FitTrack provide fitness recommendations?",
      answer:
        "Yes. FitTrack can provide fitness recommendations based on your recorded activities and available fitness information.",
    },
    {
      question: "Can I update my profile information?",
      answer:
        "Yes. After signing in, you can access your profile and update the available account information.",
    },
    {
      question: "Is my account information secure?",
      answer:
        "FitTrack uses authentication and security measures to help protect your account. You should also keep your login credentials private and secure.",
    },
    {
      question: "Is FitTrack medical advice?",
      answer:
        "No. FitTrack is designed for general fitness tracking and recommendations. Information provided by the platform should not be treated as professional medical advice.",
    },
    {
      question: "How can I contact FitTrack support?",
      answer:
        "You can use the Contact Us page to send your question or message to the FitTrack support team.",
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

          <h1>Frequently Asked Questions</h1>

          <p>
            Find answers to common questions about FitTrack and its features.
          </p>
        </div>

        <div className="footer-page-content">

          <div className="footer-faq-list">
            {faqs.map((faq, index) => (
              <details className="footer-faq-item" key={index}>
                <summary>
                  <span>{faq.question}</span>
                  <ChevronDown size={20} />
                </summary>

                <p>{faq.answer}</p>
              </details>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}

export default FAQ;