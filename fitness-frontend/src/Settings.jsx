import { useState } from "react";
import { Bell, LogOut, Moon, Sun } from "lucide-react";

function Settings({ onLogout }) {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const [notifications, setNotifications] = useState(
    () => localStorage.getItem("notifications") !== "false"
  );

  const handleDarkMode = (enabled) => {
    setDarkMode(enabled);
    localStorage.setItem("darkMode", enabled);

    document.body.classList.toggle(
      "dark-mode",
      enabled
    );
  };

  const handleNotifications = (enabled) => {
    setNotifications(enabled);
    localStorage.setItem(
      "notifications",
      enabled
    );
  };

  return (
    <div className="settings-page">

      {/* HEADER */}

      <div className="settings-header">

        <div>
          <p className="eyebrow">
            PREFERENCES
          </p>

          <h1>
            Settings
          </h1>

          <p className="subtitle">
            Customize your FitTrack experience.
          </p>
        </div>

      </div>


      {/* PREFERENCES */}

      <div className="settings-card">

        <div className="settings-section-title">
          <h2>
            Preferences
          </h2>

          <p>
            Manage how FitTrack looks and
            behaves.
          </p>
        </div>


        {/* DARK MODE */}

        <div className="setting-row">

          <div className="setting-info">

            <div className="setting-icon">
              {darkMode ? (
                <Moon size={20} />
              ) : (
                <Sun size={20} />
              )}
            </div>

            <div>
              <h3>
                Dark Mode
              </h3>

              <p>
                Use a darker appearance
                throughout the application.
              </p>
            </div>

          </div>

          <button
            type="button"
            className={`toggle ${
              darkMode ? "active" : ""
            }`}
            onClick={() =>
              handleDarkMode(!darkMode)
            }
            aria-label="Toggle dark mode"
          >
            <span></span>
          </button>

        </div>


        {/* NOTIFICATIONS */}

        <div className="setting-row">

          <div className="setting-info">

            <div className="setting-icon">
              <Bell size={20} />
            </div>

            <div>
              <h3>
                Notifications
              </h3>

              <p>
                Receive fitness reminders and
                activity updates.
              </p>
            </div>

          </div>

          <button
            type="button"
            className={`toggle ${
              notifications ? "active" : ""
            }`}
            onClick={() =>
              handleNotifications(!notifications)
            }
            aria-label="Toggle notifications"
          >
            <span></span>
          </button>

        </div>

      </div>


      {/* ACCOUNT */}

      <div className="settings-card">

        <div className="settings-section-title">
          <h2>
            Account
          </h2>

          <p>
            Manage your FitTrack account.
          </p>
        </div>


        {/* LOGOUT */}

        <div className="setting-row">

          <div className="setting-info">

            <div className="setting-icon">
              <LogOut size={20} />
            </div>

            <div>
              <h3>
                Sign out
              </h3>

              <p>
                Sign out from your FitTrack
                account on this device.
              </p>
            </div>

          </div>

          <button
            type="button"
            className="settings-logout-button"
            onClick={onLogout}
          >
            <LogOut size={17} />
            Sign out
          </button>

        </div>

      </div>

    </div>
  );
}

export default Settings;