import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Flame,
  Clock3,
  TrendingUp,
  Dumbbell,
  Award,
  CalendarDays,
  Target,
} from "lucide-react";
import api from "./api/axios";

const formatDateTime = (dateTime) => {
  if (!dateTime) {
    return "Recent workout";
  }

  const date = new Date(dateTime);

  if (isNaN(date.getTime())) {
    return dateTime;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

function Analytics({ user }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     FETCH ACTIVITIES
  ========================= */

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/api/activities/user/${user.id}`
        );

        setActivities(response.data || []);
      } catch (err) {
        console.error("Analytics error:", err);

        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
        } else {
          setError("Unable to load analytics.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (!user?.id) {
      setLoading(false);
      setError("User information not available.");
      return;
    }

    fetchActivities();
  }, [user]);

  /* =========================
     BASIC STATS
  ========================= */

  const stats = useMemo(() => {
    const totalActivities = activities.length;

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
      totalActivities > 0
        ? Math.round(totalMinutes / totalActivities)
        : 0;

    return {
      totalActivities,
      totalMinutes,
      totalCalories,
      averageDuration,
    };
  }, [activities]);

  /* =========================
     CURRENT WEEK STATS
     MONDAY -> SUNDAY
  ========================= */

  const weeklyStats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);

    const day = startOfWeek.getDay();

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

        if (isNaN(activityDate.getTime())) {
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
          sum + Number(activity.duration || 0),
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

  /* =========================
     WEEKLY GOAL PROGRESS
  ========================= */

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

  /* =========================
     WORKOUT BREAKDOWN
  ========================= */

  const workoutBreakdown = useMemo(() => {
    const breakdown = {};

    activities.forEach((activity) => {
      const type =
        activity.type ||
        activity.activityType ||
        "Other";

      breakdown[type] =
        (breakdown[type] || 0) + 1;
    });

    return Object.entries(breakdown);
  }, [activities]);

  /* =========================
     WEEKLY ACTIVITY
  ========================= */

  const weeklyActivity = useMemo(() => {
    const days = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ];

    const counts = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };

    activities.forEach((activity) => {
      const dateValue =
        activity.startTime ||
        activity.createdAt;

      if (!dateValue) {
        return;
      }

      const date = new Date(dateValue);

      if (isNaN(date.getTime())) {
        return;
      }

      const day =
        date.toLocaleDateString("en-US", {
          weekday: "short",
        });

      if (counts[day] !== undefined) {
        counts[day]++;
      }
    });

    return days.map((day) => ({
      day,
      count: counts[day],
    }));
  }, [activities]);

  /* =========================
     MAX WEEKLY COUNT
  ========================= */

  const maxWeeklyCount = useMemo(() => {
    return Math.max(
      ...weeklyActivity.map(
        (item) => item.count
      ),
      1
    );
  }, [weeklyActivity]);

  /* =========================
     BEST WORKOUT
  ========================= */

  const bestWorkout = useMemo(() => {
    if (activities.length === 0) {
      return null;
    }

    return activities.reduce(
      (best, activity) => {
        const calories =
          Number(
            activity.caloriesBurned || 0
          );

        const bestCalories =
          Number(
            best?.caloriesBurned || 0
          );

        return calories > bestCalories
          ? activity
          : best;
      },
      activities[0]
    );
  }, [activities]);

  /* =========================
     MOST ACTIVE DAY
  ========================= */

  const mostActiveDay = useMemo(() => {
    if (weeklyActivity.length === 0) {
      return {
        day: "—",
        count: 0,
      };
    }

    return weeklyActivity.reduce(
      (best, current) =>
        current.count > best.count
          ? current
          : best,
      weeklyActivity[0]
    );
  }, [weeklyActivity]);

  /* =========================
     LONGEST WORKOUT
  ========================= */

  const longestWorkout = useMemo(() => {
    if (activities.length === 0) {
      return null;
    }

    return activities.reduce(
      (longest, activity) => {
        const duration =
          Number(
            activity.duration || 0
          );

        const longestDuration =
          Number(
            longest?.duration || 0
          );

        return duration > longestDuration
          ? activity
          : longest;
      },
      activities[0]
    );
  }, [activities]);

  /* =========================
     FITNESS GOALS
     BASED ON CURRENT WEEK
  ========================= */

  const goals = useMemo(() => {
    return [
      {
        title: "Weekly Workouts",
        current: weeklyStats.workouts,
        target: 5,
        unit: "workouts",
      },
      {
        title: "Weekly Minutes",
        current: weeklyStats.minutes,
        target: 150,
        unit: "minutes",
      },
      {
        title: "Calories Burned",
        current: weeklyStats.calories,
        target: 2500,
        unit: "kcal",
      },
    ];
  }, [weeklyStats]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">
          Loading analytics...
        </div>
      </div>
    );
  }

  /* =========================
     MAIN UI
  ========================= */

  return (
    <div className="analytics-page">

      {/* HEADER */}

      <div className="analytics-header">
        <div>
          <p className="eyebrow">
            PERFORMANCE
          </p>

          <h1>
            Analytics
          </h1>

          <p className="subtitle">
            Track your fitness progress
            and workout performance.
          </p>
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="analytics-error">
          {error}
        </div>
      )}

      {/* =========================
          STATS
      ========================= */}

      <div className="analytics-stats">

        {/* TOTAL WORKOUTS */}

        <div className="analytics-stat-card">

          <div className="analytics-stat-icon blue">
            <Activity size={21} />
          </div>

          <div>
            <p>
              Total Workouts
            </p>

            <h2>
              {stats.totalActivities}
            </h2>
          </div>

        </div>

        {/* TOTAL MINUTES */}

        <div className="analytics-stat-card">

          <div className="analytics-stat-icon purple">
            <Clock3 size={21} />
          </div>

          <div>
            <p>
              Total Minutes
            </p>

            <h2>
              {stats.totalMinutes}
            </h2>
          </div>

        </div>

        {/* CALORIES */}

        <div className="analytics-stat-card">

          <div className="analytics-stat-icon orange">
            <Flame size={21} />
          </div>

          <div>
            <p>
              Calories Burned
            </p>

            <h2>
              {stats.totalCalories}
            </h2>
          </div>

        </div>

        {/* AVERAGE */}

        <div className="analytics-stat-card">

          <div className="analytics-stat-icon green">
            <TrendingUp size={21} />
          </div>

          <div>
            <p>
              Avg. Duration
            </p>

            <h2>
              {stats.averageDuration} min
            </h2>
          </div>

        </div>

      </div>

      {/* =========================
          PERFORMANCE INSIGHTS
      ========================= */}

      <div className="analytics-insights">

        {/* BEST WORKOUT */}

        <div className="insight-card">

          <div className="insight-icon">
            <Award size={23} />
          </div>

          <div>

            <p>
              Best Workout
            </p>

            <h3>
              {bestWorkout
                ? (
                    bestWorkout.type ||
                    bestWorkout.activityType ||
                    "Workout"
                  ).toUpperCase()
                : "—"}
            </h3>

            <span>
              {bestWorkout
                ? `${
                    bestWorkout.caloriesBurned ||
                    0
                  } kcal burned`
                : "No workout data"}
            </span>

          </div>

        </div>

        {/* MOST ACTIVE DAY */}

        <div className="insight-card">

          <div className="insight-icon">
            <CalendarDays size={23} />
          </div>

          <div>

            <p>
              Most Active Day
            </p>

            <h3>
              {mostActiveDay.day}
            </h3>

            <span>
              {mostActiveDay.count} workout
              {mostActiveDay.count !== 1
                ? "s"
                : ""}
            </span>

          </div>

        </div>

        {/* LONGEST WORKOUT */}

        <div className="insight-card">

          <div className="insight-icon">
            <Clock3 size={23} />
          </div>

          <div>

            <p>
              Longest Workout
            </p>

            <h3>
              {longestWorkout
                ? `${
                    longestWorkout.duration ||
                    0
                  } min`
                : "—"}
            </h3>

            <span>
              {longestWorkout
                ? (
                    longestWorkout.type ||
                    longestWorkout.activityType ||
                    "Workout"
                  ).toUpperCase()
                : "No workout data"}
            </span>

          </div>

        </div>

      </div>

      {/* =========================
          WORKOUT BREAKDOWN
      ========================= */}

      <div className="analytics-card">

        <div className="analytics-card-header">

          <div>

            <p className="eyebrow">
              WORKOUT TYPES
            </p>

            <h2>
              Workout Breakdown
            </h2>

            <p>
              See how your workouts are
              distributed.
            </p>

          </div>

          <Dumbbell size={22} />

        </div>

        {workoutBreakdown.length === 0 ? (

          <div className="analytics-empty">

            <Activity size={32} />

            <h3>
              No workouts yet
            </h3>

            <p>
              Add your first workout to
              see analytics.
            </p>

          </div>

        ) : (

          <div className="workout-breakdown">

            {workoutBreakdown.map(
              ([type, count]) => (

                <div
                  className="breakdown-row"
                  key={type}
                >

                  <div>

                    <span className="breakdown-name">
                      {type}
                    </span>

                    <div className="breakdown-bar">

                      <span
                        style={{
                          width: `${
                            (
                              count /
                              stats.totalActivities
                            ) * 100
                          }%`,
                        }}
                      />

                    </div>

                  </div>

                  <strong>
                    {count}
                  </strong>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* =========================
          WEEKLY ACTIVITY
      ========================= */}

      <div className="analytics-card weekly-chart-card">

        <div className="analytics-card-header">

          <div>

            <p className="eyebrow">
              WEEKLY PROGRESS
            </p>

            <h2>
              Weekly Activity
            </h2>

            <p>
              Your workout activity
              throughout the week.
            </p>

          </div>

        </div>

        <div className="weekly-chart">

          {weeklyActivity.map((item) => {

            const height =
              item.count === 0
                ? 5
                : Math.max(
                    (
                      item.count /
                      maxWeeklyCount
                    ) * 100,
                    15
                  );

            return (

              <div
                className="chart-column"
                key={item.day}
              >

                <div className="chart-value">
                  {item.count > 0
                    ? item.count
                    : ""}
                </div>

                <div className="chart-bar-wrapper">

                  <div
                    className="chart-bar"
                    style={{
                      height: `${height}%`,
                    }}
                  />

                </div>

                <span className="chart-day">
                  {item.day}
                </span>

              </div>

            );
          })}

        </div>

      </div>

      {/* =========================
          FITNESS GOALS
      ========================= */}

      <div className="analytics-card goals-card">

        <div className="analytics-card-header">

          <div>

            <p className="eyebrow">
              GOALS
            </p>

            <h2>
              Fitness Goals
            </h2>

            <p>
              Keep progressing toward your
              weekly targets.
            </p>

          </div>

          <Target size={22} />

        </div>

        <div className="goal-list">

          {goals.map((goal) => {

            const percentage =
              Math.min(
                Math.round(
                  (
                    goal.current /
                    goal.target
                  ) * 100
                ),
                100
              );

            return (

              <div
                className="goal-item"
                key={goal.title}
              >

                <div className="goal-top">

                  <div>

                    <h3>
                      {goal.title}
                    </h3>

                    <span>
                      {goal.current} /{" "}
                      {goal.target}{" "}
                      {goal.unit}
                    </span>

                  </div>

                  <strong>
                    {percentage}%
                  </strong>

                </div>

                <div className="goal-progress">

                  <span
                    style={{
                      width:
                        `${percentage}%`,
                    }}
                  />

                </div>

              </div>

            );
          })}

        </div>

      </div>

      {/* =========================
          WORKOUT HISTORY
      ========================= */}

      <div className="analytics-card">

        <div className="analytics-card-header">

          <div>

            <p className="eyebrow">
              RECENT ACTIVITY
            </p>

            <h2>
              Workout History
            </h2>

            <p>
              Your latest completed
              workouts.
            </p>

          </div>

        </div>

        {activities.length === 0 ? (

          <div className="analytics-empty">
            No workout history available.
          </div>

        ) : (

          <div className="analytics-history">

            {activities
              .slice()
              .reverse()
              .slice(0, 5)
              .map((activity) => (

                <div
                  className="history-row"
                  key={activity.id}
                >

                  <div className="history-icon">
                    <Activity size={19} />
                  </div>

                  <div className="history-info">

                    <h3>
                      {activity.type ||
                        activity.activityType ||
                        "Workout"}
                    </h3>

                    <p>
                      {formatDateTime(
                        activity.startTime ||
                          activity.createdAt
                      )}
                    </p>

                  </div>

                  <div className="history-value">

                    <strong>
                      {activity.duration || 0} min
                    </strong>

                    <span>
                      {activity.caloriesBurned ||
                        0}{" "}
                      kcal
                    </span>

                  </div>

                </div>

              ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Analytics;