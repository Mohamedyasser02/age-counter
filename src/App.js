import { useEffect, useState, useRef } from "react";
import "./App.css";

export default function App() {
  const birthday = new Date(2007, 9, 11); // 11 Oct 2007
  
  const today = new Date();
  const currentDay = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  const [age, setAge] = useState({ years: 0, months: 0, days: 0 });
  const [isBirthday, setIsBirthday] = useState(false);
  const [progress, setProgress] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [daysUntilNext, setDaysUntilNext] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const now = new Date();

    let years = now.getFullYear() - birthday.getFullYear();
    let months = now.getMonth() - birthday.getMonth();
    let days = now.getDate() - birthday.getDate();

    if (days < 0) {
      const lastMonthDayCount = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += lastMonthDayCount;
      months -= 1;
    }
    if (months < 0) {
      months += 12;
      years -= 1;
    }

    setAge({ years, months, days });

    const bdMonth = birthday.getMonth();
    const bdDate = birthday.getDate();

    let thisYearBirthday = new Date(now.getFullYear(), bdMonth, bdDate);
    let lastBirthday =
      now < thisYearBirthday
        ? new Date(now.getFullYear() - 1, bdMonth, bdDate)
        : new Date(thisYearBirthday);

    const nextBirthday = new Date(lastBirthday);
    nextBirthday.setFullYear(lastBirthday.getFullYear() + 1);

    const todayIsBirthday = now.getDate() === bdDate && now.getMonth() === bdMonth;
    setIsBirthday(todayIsBirthday);

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysUntil = Math.ceil((nextBirthday - now) / msPerDay);
    setDaysUntilNext(daysUntil >= 0 ? daysUntil : 0);

    const daysSinceLast = (now - lastBirthday) / msPerDay;
    const daysInYear = (nextBirthday - lastBirthday) / msPerDay;
    const unitsTotal = 48;
    const unitLengthInDays = daysInYear / unitsTotal;
    const unitsPassed = Math.floor(daysSinceLast / unitLengthInDays);
    let targetPercent = unitsPassed * (100 / unitsTotal);

    if (targetPercent < 0) targetPercent = 0;
    if (targetPercent > 100) targetPercent = 100;
    if (todayIsBirthday) targetPercent = 100;

    setProgress(targetPercent);
  }, [currentDay]);

  useEffect(() => {
    setAnimatedProgress(0);
    const target = Math.round(progress);
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= target) {
        setAnimatedProgress(target);
        clearInterval(interval);
      } else {
        setAnimatedProgress(current);
      }
    }, 12);
    return () => clearInterval(interval);
  }, [progress]);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  };

  return (
    <div className="container">
      <div className="box">
        {isBirthday && (
          <div className="birthday-msg">
            <h1>🎉 Happy Birthday Nour 🎉</h1>
            <p>Wish you all the best 🎂</p>
            <img
              src={`${process.env.PUBLIC_URL}/img1.gif`}
              alt="Happy Birthday"
              className="gif"
            />
            <audio ref={audioRef} src={`${process.env.PUBLIC_URL}/audio1.mp3`} />
            {!isPlaying && (
              <button onClick={handlePlay} className="play-btn">
                Play Birthday Sound
              </button>
            )}
          </div>
        )}

        {!isBirthday ? (
          <>
            <h1>Nour Age Counter</h1>
            <p>Nour is</p>
            <p className="age">
              {age.years} years, {age.months} months, {age.days} days
            </p>
            <p style={{ marginTop: 6, marginBottom: 0, color: "#444" }}>
              {daysUntilNext} day(s) until Nour's birthday
            </p>
          </>
        ) : (
          <p
            className="age"
            style={{ fontWeight: "bold", color: "#ff1493", fontSize: "1.5rem" }}
          >
            Nour is {age.years}
          </p>
        )}

        <div className="progress-bar" style={{ marginTop: 12 }}>
          <div
            className="progress-fill"
            style={{
              width: `${animatedProgress}%`,
              background: isBirthday
                ? "linear-gradient(90deg, #ff00cc, #3333ff)"
                : "linear-gradient(90deg, #ff8c00, #ff0080)",
            }}
          ></div>
        </div>

        <p className="progress-text">{animatedProgress.toFixed(0)}%</p>
      </div>
    </div>
  );
}
