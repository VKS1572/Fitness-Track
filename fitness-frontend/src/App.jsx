import { useEffect, useMemo, useState } from "react";
import api from "./api/axios";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import SettingsPage from "./Settings";
import Landing from "./Landing";
import Analytics from "./Analytics";

//pages
import Terms from "./FooterPages/Terms";
import Privacy from "./FooterPages/Privacy";
import CookiePolicy from "./FooterPages/CookiePolicy";
import FAQ from "./FooterPages/FAQ";
import Contact from "./FooterPages/Contact";
import HelpCenter from "./FooterPages/HelpCenter";
import PressMedia from "./FooterPages/PressMedia";
import AboutUs from "./FooterPages/AboutUs";

//Products + Resource
import FitnessTracking from "./Product/FitnessTracking";
import ProgressAnalytics from "./Product/ProgressAnalytics";

import WorkoutPlans from "./Resources/WorkoutPlans";
import ExerciseDatabase from "./Resources/ExerciseDatabase";
import AICoach from "./Resources/AICoach";
import Community from "./Resources/Community";

import {
  Activity,
  BarChart3,
  Bell,
  Bike,
  CalendarDays,
  Dumbbell,
  Flame,
  Footprints,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Settings,
  Timer,
  User,
  Waves,
  X,
} from "lucide-react";

import "./App.css";

const activityIcons = {
  RUNNING: Activity,
  WALKING: Footprints,
  CYCLING: Bike,
  SWIMMING: Waves,
  WORKOUT: Dumbbell,
};

function App() {
  // =========================================================
  // AUTHENTICATION
  // =========================================================

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token")
  );

  const [showRegister, setShowRegister] = useState(false);

  // =========================================================
  // USER
  // =========================================================

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Unable to read stored user:", error);
      localStorage.removeItem("user");
      return null;
    }
  });

  const USER_ID = user?.id;

  // =========================================================
  // DASHBOARD STATES
  // =========================================================

  const [activities, setActivities] = useState([]);
  const [recommendation, setRecommendation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // UI STATES
  // =========================================================
  const [showLanding, setShowLanding] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [publicPage, setPublicPage] = useState(null);

  // Activities page controls
  const [activitySearch, setActivitySearch] = useState("");
  const [activityTypeFilter, setActivityTypeFilter] = useState("ALL");
  const [activitySort, setActivitySort] = useState("NEWEST");

  // =========================================================
  // ACTIVITY FORM
  // =========================================================

  const [form, setForm] = useState({
    type: "RUNNING",
    duration: "",
    caloriesBurned: "",
    startTime: "",
  });

  // =========================================================
  // FETCH DASHBOARD
  // =========================================================

  const fetchDashboard = async () => {
    if (!USER_ID) {
      console.warn("No logged-in user ID found.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [userRes, activitiesRes, recommendationRes] =
        await Promise.all([
          api.get(`/api/users/${USER_ID}`),
          api.get(`/api/activities/user/${USER_ID}`),
          api.get(`/api/recommendations/user/${USER_ID}`),
        ]);

      setUser(userRes.data);

      localStorage.setItem(
        "user",
        JSON.stringify(userRes.data)
      );

      setActivities(
        Array.isArray(activitiesRes.data)
          ? activitiesRes.data
          : []
      );

      setRecommendation(recommendationRes.data);
    } catch (err) {
      console.error("Dashboard error:", err);

      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      setError("Unable to load fitness data.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD DASHBOARD AFTER LOGIN
  // =========================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      setShowLanding(true);
      setLoading(false);
      return;
    }

    setIsAuthenticated(true);
    setShowLanding(false);

    if (USER_ID) {
      fetchDashboard();
    } else {
      setLoading(false);
    }

    // USER_ID intentionally controls when dashboard data loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [USER_ID]);

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE LOGIN
  // =========================================================

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    setShowLanding(false);
    setShowRegister(false);
    setActivePage("dashboard");
    setError("");
  };

  const handleGetStarted = () => {
    setShowLanding(false);
    setShowRegister(true);
  };

  const handleSignIn = () => {
    setShowLanding(false);
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsAuthenticated(false);
    setUser(null);
    setShowLanding(true);
    setShowRegister(false);
    setActivePage("dashboard");
    setActivities([]);
    setRecommendation(null);
    setError("");
  };
  const handleFooterPage = (page) => {
    setPublicPage(page);
    setShowLanding(false);
    setShowRegister(false);

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  const handleBackToLanding = () => {
    setPublicPage(null);
    setShowLanding(true);

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };
  // =========================================================
  // ADD / EDIT ACTIVITY
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!USER_ID) {
      setError("User session not found. Please login again.");
      return;
    }

    if (!form.duration || Number(form.duration) <= 0) {
      setError("Duration must be greater than 0.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const activityData = {
        userId: USER_ID,
        type: form.type,
        duration: Number(form.duration),
        caloriesBurned: form.caloriesBurned
          ? Number(form.caloriesBurned)
          : 0,
        startTime: form.startTime || null,
      };

      // EDIT
      if (editingActivity) {
        await api.put(
          `/api/activities/${editingActivity.id}`,
          activityData
        );
      }

      // ADD
      else {
        await api.post(
          "/api/activities",
          activityData
        );
      }

      // RESET FORM
      setForm({
        type: "RUNNING",
        duration: "",
        caloriesBurned: "",
        startTime: "",
      });

      setEditingActivity(null);
      setShowForm(false);

      await fetchDashboard();
    } catch (err) {
      console.error(
        editingActivity
          ? "Update activity error:"
          : "Save activity error:",
        err
      );

      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      setError(
        err.response?.data?.message ||
          (editingActivity
            ? "Unable to update activity."
            : "Unable to save activity.")
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // DELETE ACTIVITY
  // =========================================================

  const handleDeleteActivity = async (activityId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(
        `/api/activities/${activityId}`
      );

      await fetchDashboard();
    } catch (err) {
      console.error(
        "Delete activity error:",
        err
      );

      if (err.response?.status === 401) {
        handleLogout();
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to delete activity."
      );
    }
  };

  // =========================================================
  // EDIT ACTIVITY
  // =========================================================

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);

    setForm({
      type: activity.type || "RUNNING",
      duration: activity.duration || "",
      caloriesBurned:
        activity.caloriesBurned || "",
      startTime: activity.startTime
        ? activity.startTime.slice(0, 16)
        : "",
    });

    setError("");
    setShowForm(true);
  };

  // =========================================================
  // USER UPDATED
  // =========================================================

  const handleUserUpdated = (updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );
  };

  // =========================================================
  // OPEN ADD ACTIVITY
  // =========================================================

  const handleAddActivity = () => {
    setEditingActivity(null);

    setForm({
      type: "RUNNING",
      duration: "",
      caloriesBurned: "",
      startTime: "",
    });

    setError("");
    setShowForm(true);
  };

  // =========================================================
  // CLOSE ACTIVITY MODAL
  // =========================================================

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingActivity(null);

    setForm({
      type: "RUNNING",
      duration: "",
      caloriesBurned: "",
      startTime: "",
    });
  };

  // =========================================================
  // TOTALS
  // =========================================================

  const totalMinutes = activities.reduce(
    (sum, activity) =>
      sum + Number(activity.duration || 0),
    0
  );

  const totalCalories = activities.reduce(
    (sum, activity) =>
      sum + Number(activity.caloriesBurned || 0),
    0
  );

  const averageDuration =
    activities.length > 0
      ? Math.round(
          totalMinutes / activities.length
        )
      : 0;

  // =========================================================
  // WEEKLY STATS
  // =========================================================

  const weeklyStats = useMemo(() => {
    const now = new Date();

    const startOfWeek = new Date(now);

    const day = startOfWeek.getDay();

    // Monday = first day of week
    const daysFromMonday =
      day === 0 ? 6 : day - 1;

    startOfWeek.setDate(
      startOfWeek.getDate() - daysFromMonday
    );

    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyActivities = activities.filter(
      (activity) => {
        const dateValue =
          activity.startTime ||
          activity.createdAt;

        if (!dateValue) {
          return false;
        }

        const activityDate =
          new Date(dateValue);

        if (Number.isNaN(activityDate.getTime())) {
          return false;
        }

        return (
          activityDate >= startOfWeek &&
          activityDate <= now
        );
      }
    );

    const workouts =
      weeklyActivities.length;

    const minutes =
      weeklyActivities.reduce(
        (sum, activity) =>
          sum +
          Number(activity.duration || 0),
        0
      );

    const calories =
      weeklyActivities.reduce(
        (sum, activity) =>
          sum +
          Number(
            activity.caloriesBurned || 0
          ),
        0
      );

    return {
      workouts,
      minutes,
      calories,
    };
  }, [activities]);

  // =========================================================
  // WEEKLY PROGRESS
  // =========================================================

  const weeklyWorkoutProgress = Math.min(
    Math.round(
      (weeklyStats.workouts / 5) * 100
    ),
    100
  );

  const weeklyMinutesProgress = Math.min(
    Math.round(
      (weeklyStats.minutes / 150) * 100
    ),
    100
  );

  const weeklyCaloriesProgress = Math.min(
    Math.round(
      (weeklyStats.calories / 2500) * 100
    ),
    100
  );

  // =========================================================
  // ACTIVITY TIMESTAMP
  // =========================================================

  const getActivityTimestamp = (activity) => {
    const value =
      activity.startTime ||
      activity.createdAt;

    if (!value) {
      return 0;
    }

    const timestamp =
      new Date(value).getTime();

    return Number.isNaN(timestamp)
      ? 0
      : timestamp;
  };

  // =========================================================
  // FILTERED ACTIVITIES
  // =========================================================

  const filteredActivities = useMemo(() => {
    let result = [...activities];

    const search =
      activitySearch.trim().toLowerCase();

    // Search
    if (search) {
      result = result.filter(
        (activity) => {
          const type =
            activity.type?.toLowerCase() || "";

          const date =
            activity.startTime
              ? new Date(
                  activity.startTime
                )
                  .toLocaleDateString()
                  .toLowerCase()
              : "";

          return (
            type.includes(search) ||
            date.includes(search)
          );
        }
      );
    }

    // Type filter
    if (
      activityTypeFilter !== "ALL"
    ) {
      result = result.filter(
        (activity) =>
          activity.type ===
          activityTypeFilter
      );
    }

    // Sort
    result.sort((a, b) => {
      if (activitySort === "NEWEST") {
        return (
          getActivityTimestamp(b) -
          getActivityTimestamp(a)
        );
      }

      if (activitySort === "OLDEST") {
        return (
          getActivityTimestamp(a) -
          getActivityTimestamp(b)
        );
      }

      if (activitySort === "DURATION") {
        return (
          Number(b.duration || 0) -
          Number(a.duration || 0)
        );
      }

      if (activitySort === "CALORIES") {
        return (
          Number(b.caloriesBurned || 0) -
          Number(a.caloriesBurned || 0)
        );
      }

      return 0;
    });

    return result;
  }, [
    activities,
    activitySearch,
    activityTypeFilter,
    activitySort,
  ]);

  // =========================================================
  // USER NAME
  // =========================================================

  const userName =
    user?.name ||
    user?.username ||
    user?.firstName ||
    "Fitness User";

  // =========================================================
  // LOGIN / REGISTER
  // =========================================================
    //footer wala...0
    if (!isAuthenticated && publicPage) {
      switch (publicPage) {
        case "terms":
          return <Terms onBack={handleBackToLanding} />;

        case "privacy":
          return <Privacy onBack={handleBackToLanding} />;

        case "cookies":
          return <CookiePolicy onBack={handleBackToLanding} />;

        case "faq":
          return <FAQ onBack={handleBackToLanding} />;

        case "contact":
          return <Contact onBack={handleBackToLanding} />;

        case "help":
          return <HelpCenter onBack={handleBackToLanding} />;

        case "press":
              return <PressMedia onBack={handleBackToLanding} />;

        case "about":
          return <AboutUs onBack={handleBackToLanding} />;

        case "fitness":
          return (
            <FitnessTracking onBack={handleBackToLanding} />
          );

        case "analytics":
          return (
            <ProgressAnalytics onBack={handleBackToLanding} />
          );

        case "workouts":
          return (
            <WorkoutPlans onBack={handleBackToLanding} />
          );

        case "exercises":
          return (
            <ExerciseDatabase onBack={handleBackToLanding} />
          );

        case "ai-coach":
          return (
            <AICoach onBack={handleBackToLanding} />
          );

        case "community":
          return (
            <Community onBack={handleBackToLanding} />
          );

        default:
          break;
      }
    }
  // 1. Landing page first
  if (!isAuthenticated && showLanding) {
    return (
      <Landing
        onGetStarted={handleGetStarted}
        onSignIn={handleSignIn}
        onOpenFooterPage={handleFooterPage}
      />
    );
  }

  // 2. Login / Register
  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <Register
          onRegisterSuccess={() =>
            setShowRegister(false)
          }
          onBackToLogin={() =>
            setShowRegister(false)
          }
          onBackToLanding={() => {
            setShowRegister(false);
            setShowLanding(true);
          }}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onRegister={() => setShowRegister(true)}
        onBack={() => {
          setShowLanding(true);
        }}
      />
    );
  }

  // 3. Dashboard loading
  if (loading) {
    return (
      <div className="fittrack-loader">
        <div className="loader-ring">
          <div className="loader-logo">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="loader-text">FITTRACK</div>
        <div className="loader-subtext">Preparing your dashboard...</div>
      </div>
    );
  }



  // =========================================================
  // MAIN APP
  // =========================================================

  return (
    <div className="app">

      {/* =====================================================
          MOBILE HEADER
      ===================================================== */}

      <header className="mobile-header">

        <div className="brand">

          <div className="brand-icon">
            <Activity size={20} />
          </div>

          <span>
            FitTrack
          </span>

        </div>

        <button
          className="icon-button"
          onClick={() =>
            setMobileMenu(!mobileMenu)
          }
        >
          {mobileMenu ? (
            <X />
          ) : (
            <Menu />
          )}
        </button>

      </header>

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`sidebar ${
          mobileMenu
            ? "mobile-open"
            : ""
        }`}
      >

        <div className="brand desktop-brand">

          <div className="brand-icon">
            <Activity size={20} />
          </div>

          <span>
            FitTrack
          </span>

        </div>

        <nav className="navigation">

          {/* Dashboard */}

          <button
            className={`nav-item ${
              activePage === "dashboard"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActivePage(
                "dashboard"
              );
              setMobileMenu(false);
            }}
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          {/* Activities */}

          <button
            className={`nav-item ${
              activePage === "activities"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActivePage(
                "activities"
              );
              setMobileMenu(false);
            }}
          >
            <Activity size={19} />
            Activities
          </button>

          {/* Analytics */}

          <button
            className={`nav-item ${
              activePage === "analytics"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActivePage(
                "analytics"
              );
              setMobileMenu(false);
            }}
          >
            <BarChart3 size={19} />
            Analytics
          </button>

          {/* Profile */}

          <button
            className={`nav-item ${
              activePage === "profile"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActivePage(
                "profile"
              );
              setMobileMenu(false);
            }}
          >
            <User size={19} />
            Profile
          </button>

          {/* Settings */}

          <button
            className={`nav-item ${
              activePage === "settings"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActivePage(
                "settings"
              );
              setMobileMenu(false);
            }}
          >
            <Settings size={19} />
            Settings
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="user-mini">

            <div className="avatar">
              <User size={18} />
            </div>

            <div>

              <strong>
                {userName}
              </strong>

              <small>
                Fitness member
              </small>

            </div>

          </div>

          <button
            className="logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Sign out
          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="main-content">

        {/* ===================================================
            PROFILE
        =================================================== */}

        {activePage === "profile" ? (

          <Profile
            user={user}
            onUserUpdated={
              handleUserUpdated
            }
          />

        ) : activePage === "settings" ? (

          /* =================================================
             SETTINGS
          ================================================= */

          <SettingsPage
            onLogout={handleLogout}
          />

        ) : activePage === "analytics" ? (

          /* =================================================
             ANALYTICS
          ================================================= */

          <Analytics user={user} />

        ) : activePage === "activities" ? (

          /* =================================================
             ACTIVITIES PAGE
          ================================================= */

          <div className="activities-page">

            {/* PAGE HEADER */}

            <div className="activities-page-header">

              <div>

                <div className="page-eyebrow">
                  WORKOUT LIBRARY
                </div>

                <h1>
                  My Activities
                </h1>

                <p>
                  Track, search and manage
                  all your workouts.
                </p>

              </div>

              <button
                className="primary-button activities-add-button"
                onClick={
                  handleAddActivity
                }
              >
                <Plus size={18} />
                Add Activity
              </button>

            </div>

            {/* =================================================
                ACTIVITY OVERVIEW
            ================================================= */}

            <div className="activity-overview-grid">

              {/* Total Workouts */}

              <div className="activity-overview-card">

                <div className="activity-overview-icon">
                  <Activity size={21} />
                </div>

                <div>

                  <span>
                    Total Workouts
                  </span>

                  <strong>
                    {activities.length}
                  </strong>

                </div>

              </div>

              {/* This Week */}

              <div className="activity-overview-card">

                <div className="activity-overview-icon">
                  <CalendarDays size={21} />
                </div>

                <div>

                  <span>
                    This Week
                  </span>

                  <strong>
                    {weeklyStats.workouts}
                  </strong>

                </div>

              </div>

              {/* Total Time */}

              <div className="activity-overview-card">

                <div className="activity-overview-icon">
                  <Timer size={21} />
                </div>

                <div>

                  <span>
                    Total Time
                  </span>

                  <strong>
                    {Math.floor(
                      totalMinutes / 60
                    )}
                    h{" "}
                    {totalMinutes % 60}
                    m
                  </strong>

                </div>

              </div>

              {/* Calories */}

              <div className="activity-overview-card">

                <div className="activity-overview-icon">
                  <Flame size={21} />
                </div>

                <div>

                  <span>
                    Calories
                  </span>

                  <strong>
                    {totalCalories}
                  </strong>

                </div>

              </div>

            </div>

            {/* =================================================
                SEARCH / FILTERS
            ================================================= */}

            <div className="activity-toolbar">

              {/* Search */}

              <div className="activity-search">

                <Activity size={18} />

                <input
                  type="text"
                  placeholder="Search workouts..."
                  value={
                    activitySearch
                  }
                  onChange={(e) =>
                    setActivitySearch(
                      e.target.value
                    )
                  }
                />

                {activitySearch && (
                  <button
                    className="activity-search-clear"
                    onClick={() =>
                      setActivitySearch("")
                    }
                    type="button"
                  >
                    <X size={16} />
                  </button>
                )}

              </div>

              {/* Filters */}

              <div className="activity-filter-group">

                <select
                  value={
                    activityTypeFilter
                  }
                  onChange={(e) =>
                    setActivityTypeFilter(
                      e.target.value
                    )
                  }
                >

                  <option value="ALL">
                    All Types
                  </option>

                  <option value="RUNNING">
                    Running
                  </option>

                  <option value="WALKING">
                    Walking
                  </option>

                  <option value="CYCLING">
                    Cycling
                  </option>

                  <option value="SWIMMING">
                    Swimming
                  </option>

                  <option value="WORKOUT">
                    Workout
                  </option>

                </select>

                <select
                  value={activitySort}
                  onChange={(e) =>
                    setActivitySort(
                      e.target.value
                    )
                  }
                >

                  <option value="NEWEST">
                    Newest First
                  </option>

                  <option value="OLDEST">
                    Oldest First
                  </option>

                  <option value="DURATION">
                    Longest Duration
                  </option>

                  <option value="CALORIES">
                    Most Calories
                  </option>

                </select>

              </div>

            </div>

            {/* =================================================
                ACTIVITY HISTORY
            ================================================= */}

            <section className="activity-history-card">

              <div className="activity-history-header">

                <div>

                  <div className="section-eyebrow">
                    ACTIVITY HISTORY
                  </div>

                  <h2>
                    Your Workouts
                  </h2>

                </div>

                <div className="activity-count">

                  {filteredActivities.length}{" "}

                  {filteredActivities.length === 1
                    ? "workout"
                    : "workouts"}

                </div>

              </div>

              {/* ERROR */}

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {/* EMPTY / FILTERED EMPTY */}

              {filteredActivities.length === 0 ? (

                <div className="activity-empty-state">

                  <div className="activity-empty-icon">
                    <Activity size={30} />
                  </div>

                  {activities.length === 0 ? (

                    <>
                      <h3>
                        No workouts yet
                      </h3>

                      <p>
                        Start tracking your
                        fitness journey by
                        adding your first
                        workout.
                      </p>

                      <button
                        className="primary-button"
                        onClick={
                          handleAddActivity
                        }
                      >
                        <Plus size={18} />
                        Add Your First Activity
                      </button>
                    </>

                  ) : (

                    <>
                      <h3>
                        No matching workouts
                      </h3>

                      <p>
                        Try changing your
                        search or filters.
                      </p>

                      <button
                        className="secondary-button"
                        onClick={() => {
                          setActivitySearch("");
                          setActivityTypeFilter(
                            "ALL"
                          );
                          setActivitySort(
                            "NEWEST"
                          );
                        }}
                      >
                        Clear Filters
                      </button>
                    </>

                  )}

                </div>

              ) : (

                /* =================================================
                   ACTIVITY LIST
                ================================================= */

                <div className="activity-history-list">

                  {filteredActivities.map(
                    (activity) => {

                      const Icon =
                        activityIcons[
                          activity.type
                        ] || Activity;

                      const activityDate =
                        activity.startTime ||
                        activity.createdAt;

                      return (
                        <div
                          className="activity-management-row"
                          key={
                            activity.id
                          }
                        >

                          {/* MAIN */}

                          <div className="activity-management-main">

                            <div className="activity-management-icon">
                              <Icon size={22} />
                            </div>

                            <div className="activity-management-info">

                              <div className="activity-management-title">
                                {activity.type
                                  ? activity.type
                                      .charAt(0)
                                      .toUpperCase() +
                                    activity.type
                                      .slice(1)
                                      .toLowerCase()
                                  : "Workout"}
                              </div>

                              <div className="activity-management-date">

                                {activityDate
                                  ? new Date(
                                      activityDate
                                    ).toLocaleDateString(
                                      "en-IN",
                                      {
                                        weekday:
                                          "short",
                                        day: "numeric",
                                        month:
                                          "short",
                                        year:
                                          "numeric",
                                      }
                                    )
                                  : "Date unavailable"}

                                {activity.startTime && (
                                  <>
                                    {" • "}

                                    {new Date(
                                      activity.startTime
                                    ).toLocaleTimeString(
                                      "en-IN",
                                      {
                                        hour:
                                          "2-digit",
                                        minute:
                                          "2-digit",
                                      }
                                    )}
                                  </>
                                )}

                              </div>

                            </div>

                          </div>

                          {/* METRICS */}

                          <div className="activity-management-metrics">

                            <div className="management-metric">

                              <span>
                                Duration
                              </span>

                              <strong>
                                {Number(
                                  activity.duration ||
                                    0
                                )}{" "}
                                min
                              </strong>

                            </div>

                            <div className="management-metric">

                              <span>
                                Calories
                              </span>

                              <strong>
                                {Number(
                                  activity.caloriesBurned ||
                                    0
                                )}{" "}
                                kcal
                              </strong>

                            </div>

                          </div>

                          {/* ACTIONS */}

                          <div className="activity-management-actions">

                            <button
                              className="edit-button"
                              onClick={() =>
                                handleEditActivity(
                                  activity
                                )
                              }
                              title="Edit activity"
                              type="button"
                            >
                              <Settings
                                size={16}
                              />
                              Edit
                            </button>

                            <button
                              className="delete-button"
                              onClick={() =>
                                handleDeleteActivity(
                                  activity.id
                                )
                              }
                              title="Delete activity"
                              type="button"
                            >
                              <X size={16} />
                              Delete
                            </button>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              )}

            </section>

          </div>

        ) : (

          /* =================================================
             DASHBOARD
          ================================================= */

          <>

            {/* TOPBAR */}

            <div className="topbar">

              <div>

                <div className="dashboard-welcome">

                  <p className="eyebrow">
                    FITNESS DASHBOARD
                  </p>

                  <h1>
                    Good morning,{" "}
                    {userName}{" "}
                    <span>👋</span>
                  </h1>

                  <p className="subtitle">
                    Stay consistent.
                    Every workout counts.
                  </p>

                </div>

              </div>

              <div className="topbar-actions">

                <button
                  className="notification"
                  type="button"
                >
                  <Bell size={19} />
                </button>

                <div className="top-avatar">
                  <User size={18} />
                </div>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="error-banner">

                <span>
                  {error}
                </span>

                <button
                  onClick={() =>
                    setError("")
                  }
                  type="button"
                >
                  <X size={17} />
                </button>

              </div>
            )}

            {/* =================================================
                DASHBOARD STATS
            ================================================= */}

            <section className="stats-grid">

              {/* Total Activities */}

              <div className="stat-card">

                <div className="stat-top">

                  <span>
                    Total Activities
                  </span>

                  <div className="stat-icon blue">
                    <Activity size={20} />
                  </div>

                </div>

                <strong>
                  {activities.length}
                </strong>

                <p>
                  <span className="positive">
                    ↑ Active
                  </span>{" "}
                  workouts tracked
                </p>

              </div>

              {/* Total Minutes */}

              <div className="stat-card">

                <div className="stat-top">

                  <span>
                    Total Minutes
                  </span>

                  <div className="stat-icon purple">
                    <Timer size={20} />
                  </div>

                </div>

                <strong>
                  {totalMinutes}
                </strong>

                <p>
                  minutes completed
                </p>

              </div>

              {/* Calories */}

              <div className="stat-card">

                <div className="stat-top">

                  <span>
                    Calories Burned
                  </span>

                  <div className="stat-icon orange">
                    <Flame size={20} />
                  </div>

                </div>

                <strong>
                  {totalCalories}
                </strong>

                <p>
                  kcal burned
                </p>

              </div>

              {/* Average */}

              <div className="stat-card">

                <div className="stat-top">

                  <span>
                    Avg. Workout
                  </span>

                  <div className="stat-icon green">
                    <Timer size={20} />
                  </div>

                </div>

                <strong>
                  {averageDuration}
                </strong>

                <p>
                  average minutes
                  per workout
                </p>

              </div>

            </section>

            {/* =================================================
                WEEKLY PROGRESS
            ================================================= */}

            <section className="weekly-progress-section">

              <div className="section-heading">

                <div>

                  <p className="eyebrow">
                    THIS WEEK
                  </p>

                  <h2>
                    Weekly Progress
                  </h2>

                </div>

                <span className="weekly-target">
                  Weekly targets
                </span>

              </div>

              <div className="weekly-progress-grid">

                {/* WORKOUTS */}

                <div className="progress-card">

                  <div className="progress-card-top">

                    <div className="progress-icon blue">
                      <Activity size={19} />
                    </div>

                    <span>
                      Workouts
                    </span>

                  </div>

                  <div className="progress-value">

                    <strong>
                      {weeklyStats.workouts}
                    </strong>

                    <span>
                      / 5
                    </span>

                  </div>

                  <div className="progress-track">

                    <div
                      className="progress-fill blue-fill"
                      style={{
                        width: `${weeklyWorkoutProgress}%`,
                      }}
                    />

                  </div>

                  <p>
                    {weeklyWorkoutProgress}%
                    {" "}
                    of weekly goal
                  </p>

                </div>

                {/* MINUTES */}

                <div className="progress-card">

                  <div className="progress-card-top">

                    <div className="progress-icon purple">
                      <Timer size={19} />
                    </div>

                    <span>
                      Active Minutes
                    </span>

                  </div>

                  <div className="progress-value">

                    <strong>
                      {weeklyStats.minutes}
                    </strong>

                    <span>
                      / 150 min
                    </span>

                  </div>

                  <div className="progress-track">

                    <div
                      className="progress-fill purple-fill"
                      style={{
                        width: `${weeklyMinutesProgress}%`,
                      }}
                    />

                  </div>

                  <p>
                    {weeklyMinutesProgress}%
                    {" "}
                    of weekly goal
                  </p>

                </div>

                {/* CALORIES */}

                <div className="progress-card">

                  <div className="progress-card-top">

                    <div className="progress-icon orange">
                      <Flame size={19} />
                    </div>

                    <span>
                      Calories
                    </span>

                  </div>

                  <div className="progress-value">

                    <strong>
                      {weeklyStats.calories}
                    </strong>

                    <span>
                      / 2500 kcal
                    </span>

                  </div>

                  <div className="progress-track">

                    <div
                      className="progress-fill orange-fill"
                      style={{
                        width: `${weeklyCaloriesProgress}%`,
                      }}
                    />

                  </div>

                  <p>
                    {weeklyCaloriesProgress}%
                    {" "}
                    of weekly goal
                  </p>

                </div>

              </div>

            </section>

            {/* =================================================
                AI RECOMMENDATION
            ================================================= */}

            {recommendation && (
              <section className="coach-card">

                <div className="coach-content">

                  <div className="coach-badge">

                    <span>
                      ✦
                    </span>

                    AI FITNESS COACH

                  </div>

                  <h2>
                    {
                      recommendation.recommendation
                    }
                  </h2>

                  <p>
                    {
                      recommendation.reason
                    }
                  </p>

                  <div className="coach-suggestion">

                    <span>
                      Recommended next
                    </span>

                    <strong>
                      {
                        recommendation.suggestedActivity
                      }
                    </strong>

                  </div>

                </div>

                <div className="coach-decoration">

                  <Activity
                    size={100}
                    strokeWidth={1}
                  />

                </div>

              </section>
            )}

            {/* =================================================
                RECENT ACTIVITIES
            ================================================= */}

            <section className="activities-section">

              <div className="section-heading">

                <div>

                  <p className="eyebrow">
                    YOUR WORKOUTS
                  </p>

                  <h2>
                    Recent Activities
                  </h2>

                </div>

                <button
                  className="primary-button"
                  onClick={
                    handleAddActivity
                  }
                  type="button"
                >
                  <Plus size={19} />
                  Add Activity
                </button>

              </div>

              {/* EMPTY STATE */}

              {activities.length === 0 ? (

                <div className="empty-state">

                  <Activity size={40} />

                  <h3>
                    No activities yet
                  </h3>

                  <p>
                    Start your fitness
                    journey by adding
                    your first workout.
                  </p>

                  <button
                    className="primary-button"
                    onClick={
                      handleAddActivity
                    }
                    type="button"
                  >
                    <Plus size={18} />
                    Add Activity
                  </button>

                </div>

              ) : (

                <div className="activity-list">

                  {activities.map(
                    (activity) => {

                      const Icon =
                        activityIcons[
                          activity.type
                        ] || Activity;

                      return (
                        <div
                          className="activity-row"
                          key={
                            activity.id
                          }
                        >

                          {/* ACTIVITY MAIN */}

                          <div className="activity-main">

                            <div className="activity-icon">
                              <Icon size={21} />
                            </div>

                            <div>

                              <h3>
                                {activity.type
                                  ? activity.type
                                      .charAt(0)
                                      .toUpperCase() +
                                    activity.type
                                      .slice(1)
                                      .toLowerCase()
                                  : "Workout"}
                              </h3>

                              <p>

                                {activity.startTime
                                  ? new Date(
                                      activity.startTime
                                    ).toLocaleString(
                                      "en-IN",
                                      {
                                        day:
                                          "2-digit",
                                        month:
                                          "short",
                                        year:
                                          "numeric",
                                        hour:
                                          "2-digit",
                                        minute:
                                          "2-digit",
                                      }
                                    )
                                  : "No start time"}

                              </p>

                            </div>

                          </div>

                          {/* METRICS */}

                          <div className="activity-metrics">

                            <div>

                              <span>
                                Duration
                              </span>

                              <strong>
                                {
                                  activity.duration
                                }{" "}
                                min
                              </strong>

                            </div>

                            <div>

                              <span>
                                Calories
                              </span>

                              <strong>
                                {
                                  activity.caloriesBurned ||
                                  0
                                }{" "}
                                kcal
                              </strong>

                            </div>

                            {/* EDIT */}

                            <button
                              className="edit-button"
                              onClick={() =>
                                handleEditActivity(
                                  activity
                                )
                              }
                              title="Edit activity"
                              type="button"
                            >
                              <span>
                                ✎
                              </span>
                            </button>

                            {/* DELETE */}

                            <button
                              className="delete-button"
                              onClick={() =>
                                handleDeleteActivity(
                                  activity.id
                                )
                              }
                              title="Delete activity"
                              type="button"
                            >
                              <X size={18} />
                            </button>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              )}

            </section>

          </>

        )}

      </main>

      {/* =====================================================
          ADD / EDIT ACTIVITY MODAL
      ===================================================== */}

      {showForm && (

        <div
          className="modal-overlay"
          onMouseDown={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {
              handleCloseForm();
            }

          }}
        >

          <div className="modal">

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <p className="eyebrow">

                  {editingActivity
                    ? "EDIT WORKOUT"
                    : "NEW WORKOUT"}

                </p>

                <h2>

                  {editingActivity
                    ? "Edit Activity"
                    : "Add Activity"}

                </h2>

              </div>

              <button
                className="close-button"
                onClick={
                  handleCloseForm
                }
                type="button"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
            >

              <div className="form-grid">

                {/* ACTIVITY TYPE */}

                <div className="form-field full">

                  <label>
                    Activity Type
                  </label>

                  <select
                    name="type"
                    value={form.type}
                    onChange={
                      handleChange
                    }
                  >

                    <option value="RUNNING">
                      Running
                    </option>

                    <option value="WALKING">
                      Walking
                    </option>

                    <option value="CYCLING">
                      Cycling
                    </option>

                    <option value="SWIMMING">
                      Swimming
                    </option>

                    <option value="WORKOUT">
                      Workout
                    </option>

                  </select>

                </div>

                {/* DURATION */}

                <div className="form-field">

                  <label>
                    Duration
                  </label>

                  <div className="input-with-unit">

                    <input
                      type="number"
                      name="duration"
                      value={
                        form.duration
                      }
                      onChange={
                        handleChange
                      }
                      min="1"
                      max="1440"
                      required
                      placeholder="30"
                    />

                    <span>
                      min
                    </span>

                  </div>

                </div>

                {/* CALORIES */}

                <div className="form-field">

                  <label>
                    Calories Burned
                  </label>

                  <div className="input-with-unit">

                    <input
                      type="number"
                      name="caloriesBurned"
                      value={
                        form.caloriesBurned
                      }
                      onChange={
                        handleChange
                      }
                      min="0"
                      max="50000"
                      placeholder="250"
                    />

                    <span>
                      kcal
                    </span>

                  </div>

                </div>

                {/* START TIME */}

                <div className="form-field full">

                  <label>
                    Start Time
                  </label>

                  <input
                    type="datetime-local"
                    name="startTime"
                    value={
                      form.startTime
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <small>
                    Select the date and
                    time using the
                    calendar picker.
                  </small>

                </div>

              </div>

              {/* MODAL BUTTONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={
                    handleCloseForm
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >

                  {saving ? (

                    editingActivity
                      ? "Updating..."
                      : "Saving..."

                  ) : (

                    <>
                      <Plus size={18} />

                      {editingActivity
                        ? "Update Activity"
                        : "Save Activity"}
                    </>

                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;