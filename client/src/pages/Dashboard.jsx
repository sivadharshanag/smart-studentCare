// Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "./styles/Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [attendance, setAttendance] = useState([]);
  const [scrollTarget, setScrollTarget] = useState(null);

  const userName = localStorage.getItem("name");

  useEffect(() => {
    if (!userName) return;
    axios
      .get(`http://127.0.0.1:5001/attendance/${userName}`)
      .then((res) => {
        setAttendance(res.data || []);
      })
      .catch((err) => console.error("Error fetching attendance:", err));
  }, [userName]);

  useEffect(() => {
    if (scrollTarget) {
      const el = document.getElementById(scrollTarget);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [scrollTarget]);

  const groupedByDate = attendance.reduce((acc, entry) => {
    const date = new Date(entry.timestamp).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(groupedByDate),
    datasets: [
      {
        label: "Attendance Count",
        data: Object.values(groupedByDate),
        fill: false,
        borderColor: "#2f6846",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dash-hero">
        <div className="hero-text">
          <h1 className="hero-title">Attendance Dashboard 📊</h1>
          <p className="hero-subtitle">Track your log-ins and emotion data</p>
        </div>
        <div className="dash-gif">
          <img src="./gif1.gif" alt="Dashboard Visual" />
        </div>
      </header>

      <nav className="dashboard-nav">
        <button onClick={() => setScrollTarget("summary")} className="nav-btn">Summary</button>
        <button onClick={() => setScrollTarget("graph")} className="nav-btn">Graph</button>
        <button onClick={() => setScrollTarget("calendar")} className="nav-btn">Calendar</button>
      </nav>

      <section id="summary" className="summary-section">
        <div className="summary-card">
          <h2>Total Entries</h2>
          <p>{attendance.length}</p>
        </div>
        {attendance.length > 0 && (
          <div className="summary-card">
            <h2>Latest Emotion</h2>
            <p>{attendance[attendance.length - 1].emotion}</p>
          </div>
        )}
      </section>

      <section id="graph" className="graph-section">
        <h2>📈 Weekly Attendance Chart</h2>
        <Line data={chartData} />
      </section>

      <section id="calendar" className="calendar-section">
        <h2>📅 Calendar</h2>
        <Calendar
          tileClassName={({ date }) => {
            const formatted = date.toLocaleDateString();
            return groupedByDate[formatted] ? "highlight" : null;
          }}
          onClickDay={(value) => {
            const clicked = new Date(value).toLocaleDateString();
            const logs = attendance.filter(
              (a) => new Date(a.timestamp).toLocaleDateString() === clicked
            );
            const emotes = logs.map((e) => e.emotion).join(", ");
            alert(`Attendance: ${logs.length} record(s)\nEmotions: ${emotes}`);
          }}
        />
      </section>
    </div>
  );
}