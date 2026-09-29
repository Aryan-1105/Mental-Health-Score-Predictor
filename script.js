const API_URL = "http://127.0.0.1:8000/predict";

const form = document.getElementById("predictForm");
const submitBtn = document.getElementById("submitBtn");
const errorMsg = document.getElementById("errorMsg");
const ring = document.getElementById("ring");
const scoreNum = document.getElementById("scoreNum");
const verdict = document.getElementById("verdict");

const CIRCUMFERENCE = 534; // 2 * PI * 85
const MAX_SCORE = 10;

// ---- Live slider values ----
const sliders = [
  ["avg_daily_usage_hours", "v_usage"],
  ["study_hours", "v_study"],
  ["physical_activity_hours", "v_activity"],
  ["sleep_hours_per_night", "v_sleep"],
];

sliders.forEach(([inputId, labelId]) => {
  const input = document.getElementById(inputId);
  const label = document.getElementById(labelId);
  const update = () => {
    label.textContent = `${input.value} h`;
    const pct = (input.value / input.max) * 100;
    input.style.background = `linear-gradient(90deg, #7c5cff ${pct}%, rgba(255,255,255,0.12) ${pct}%)`;
  };
  input.addEventListener("input", update);
  update();
});

// ---- Submit ----
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorMsg.textContent = "";

  const payload = {
    age: parseInt(document.getElementById("age").value),
    gender: document.getElementById("gender").value,
    country: document.getElementById("country").value,
    academic_level: document.getElementById("academic_level").value,
    most_used_platform: document.getElementById("most_used_platform").value,
    purpose_of_use: document.getElementById("purpose_of_use").value,
    avg_daily_usage_hours: parseFloat(document.getElementById("avg_daily_usage_hours").value),
    daily_unlocks: parseInt(document.getElementById("daily_unlocks").value),
    study_hours: parseFloat(document.getElementById("study_hours").value),
    physical_activity_hours: parseFloat(document.getElementById("physical_activity_hours").value),
    sleep_hours_per_night: parseFloat(document.getElementById("sleep_hours_per_night").value),
    stress_level: (document.querySelector('input[name="stress"]:checked') || {}).value || "",
  };

  const selects = [payload.gender, payload.country, payload.academic_level, payload.most_used_platform, payload.purpose_of_use, payload.stress_level];
  if (isNaN(payload.age) || isNaN(payload.daily_unlocks) || selects.some((v) => !v)) {
    errorMsg.textContent = "Please fill in all the fields.";
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const detail = Array.isArray(err.detail)
        ? err.detail.map((d) => `${d.loc.slice(-1)}: ${d.msg}`).join(", ")
        : err.detail || "Something went wrong.";
      throw new Error(detail);
    }

    const data = await res.json();
    showResult(data.predicted_mental_health_score);
  } catch (err) {
    errorMsg.textContent =
      err.message === "Failed to fetch"
        ? "Cannot reach the server. Is FastAPI running on 127.0.0.1:8000?"
        : err.message;
  } finally {
    setLoading(false);
  }
});

function setLoading(state) {
  submitBtn.disabled = state;
  submitBtn.classList.toggle("loading", state);
  submitBtn.querySelector(".btn-text").textContent = state ? "Predicting..." : "Predict Score";
}

function showResult(score) {
  // Animate ring
  const ratio = Math.min(Math.max(score / MAX_SCORE, 0), 1);
  ring.style.strokeDashoffset = CIRCUMFERENCE * (1 - ratio);

  // Animate number
  animateNumber(scoreNum, score);

  // Verdict
  verdict.className = "verdict";
  if (score >= 7) {
    verdict.textContent = "😊 Looking healthy";
    verdict.classList.add("good");
  } else if (score >= 5) {
    verdict.textContent = "😐 Moderate — room to improve";
    verdict.classList.add("mid");
  } else {
    verdict.textContent = "😟 Needs attention";
    verdict.classList.add("low");
  }
}

function animateNumber(el, target) {
  const duration = 1200;
  const start = performance.now();
  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (target * eased).toFixed(2);
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}