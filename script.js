const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const revealItems = document.querySelectorAll("[data-reveal]");
const yearEl = document.getElementById("year");

const setHeaderState = () => {
  if (!header) {
    return;
  }
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (revealItems.length > 0) {
  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  }
}

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const feedbackForm = document.getElementById("portfolioFeedbackForm");
const feedbackFormStatus = document.getElementById("feedbackFormStatus");
const sharePageBtn = document.querySelector(".share-page-btn");

if (feedbackForm && feedbackFormStatus) {
  feedbackForm.addEventListener("submit", (event) => {
    const formAction = feedbackForm.getAttribute("action") || "";

    if (formAction.includes("REPLACE_WITH_FORM_ID")) {
      event.preventDefault();
      feedbackFormStatus.textContent =
        "Formular validat local. Pentru colectare online, înlocuiește endpointul Formspree din atributul action.";
      feedbackFormStatus.classList.add("is-success");
      feedbackForm.reset();
    }
  });
}

if (sharePageBtn) {
  sharePageBtn.addEventListener("click", async () => {
    const shareData = {
      title: document.title,
      text: "Portofoliu DigiProf-B: Digital Safety",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        sharePageBtn.textContent = "Link copiat";
      }
    } catch (error) {
      sharePageBtn.textContent = "Distribuie resursa";
    }
  });
}

const counterEls = document.querySelectorAll("[data-count]");

const formatCounterValue = (value, decimals, suffix) => {
  const formatted = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
  return `${formatted}${suffix}`;
};

const animateCounter = (counter) => {
  if (!counter || counter.dataset.animated === "true") {
    return;
  }

  counter.dataset.animated = "true";

  const target = Number.parseFloat(counter.dataset.count || "0");
  const decimals = Number.parseInt(counter.dataset.decimals || "0", 10);
  const suffix = counter.dataset.suffix || "";

  if (prefersReducedMotion) {
    counter.textContent = formatCounterValue(target, decimals, suffix);
    return;
  }

  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = formatCounterValue(target * eased, decimals, suffix);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

if (counterEls.length > 0) {
  if (prefersReducedMotion) {
    counterEls.forEach(animateCounter);
  } else {
    const counterObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.45 }
    );

    counterEls.forEach((counter) => counterObserver.observe(counter));
  }
}

const renderDoughnutLegend = (chart, containerId) => {
  const legendEl = document.getElementById(containerId);

  if (!legendEl) {
    return;
  }

  const dataset = chart.data.datasets[0];
  legendEl.innerHTML = chart.data.labels
    .map((label, index) => {
      const color = dataset.backgroundColor[index];
      const value = dataset.data[index];

      return `
        <span class="legend-pill">
          <span class="legend-dot" style="background:${color}"></span>
          ${label}: ${value}
        </span>
      `;
    })
    .join("");
};

// Chart.js setup for participation and progress visuals
const setupCharts = () => {
  if (typeof Chart === "undefined") {
    return;
  }

  const styles = getComputedStyle(document.documentElement);
  const blue600 = styles.getPropertyValue("--blue-600").trim() || "#2a6fdb";
  const blue400 = styles.getPropertyValue("--blue-400").trim() || "#6aa5ff";
  const teal600 = styles.getPropertyValue("--teal-600").trim() || "#0f9f9a";
  const teal300 = styles.getPropertyValue("--teal-300").trim() || "#7ee7df";
  const gold500 = styles.getPropertyValue("--gold-500").trim() || "#f2b84b";
  const coral500 = styles.getPropertyValue("--coral-500").trim() || "#ec6f66";
  const textColor = styles.getPropertyValue("--analytics-ink").trim() || "#102846";
  const textMuted = styles.getPropertyValue("--analytics-muted").trim() || "rgba(16, 40, 70, 0.68)";
  const gridMuted = "rgba(16, 40, 70, 0.08)";

  Chart.defaults.font.family =
    styles.getPropertyValue("--font-body").trim() ||
    "Plus Jakarta Sans, Trebuchet MS, sans-serif";
  Chart.defaults.color = textMuted;
  Chart.defaults.plugins.tooltip.backgroundColor = "rgba(16, 40, 70, 0.94)";
  Chart.defaults.plugins.tooltip.titleColor = "#ffffff";
  Chart.defaults.plugins.tooltip.bodyColor = "rgba(255, 255, 255, 0.86)";
  Chart.defaults.plugins.tooltip.borderColor = "rgba(255, 255, 255, 0.18)";
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.cornerRadius = 14;
  Chart.defaults.plugins.tooltip.padding = 13;
  Chart.defaults.plugins.tooltip.displayColors = true;
  Chart.defaults.plugins.tooltip.boxPadding = 6;

  const participationEl = document.getElementById("participationChart");
  if (participationEl) {
    const participationChart = new Chart(participationEl, {
      type: "doughnut",
      data: {
        labels: [
          "Participanți activi",
          "Activități finalizate",
          "Participanți inactivi",
        ],
        datasets: [
          {
            data: [19, 18, 1],
            backgroundColor: [teal600, blue600, gold500],
            borderColor: "rgba(255, 255, 255, 0.92)",
            borderRadius: 12,
            borderWidth: 6,
            hoverBorderColor: "#ffffff",
            hoverOffset: 10,
            spacing: 5,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "72%",
        layout: {
          padding: 4,
        },
        animation: {
          duration: prefersReducedMotion ? 0 : 1500,
          easing: "easeOutQuart",
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed}`,
            },
          },
        },
      },
    });

    renderDoughnutLegend(participationChart, "participationLegend");
  }

  const progressEl = document.getElementById("progressChart");
  if (progressEl) {
    const progressGradient = (context) => {
      const { chart } = context;
      const { ctx, chartArea } = chart;

      if (!chartArea) {
        return blue600;
      }

      const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient.addColorStop(0, blue400);
      gradient.addColorStop(0.52, teal300);
      gradient.addColorStop(1, teal600);
      return gradient;
    };

    const progressHoverGradient = (context) => {
      const { chart } = context;
      const { ctx, chartArea } = chart;

      if (!chartArea) {
        return teal600;
      }

      const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      gradient.addColorStop(0, blue600);
      gradient.addColorStop(1, coral500);
      return gradient;
    };

    new Chart(progressEl, {
      type: "bar",
      data: {
        labels: ["Modul 1", "Modul 2", "Modul 3", "Quiz final"],
        datasets: [
          {
            label: "Progres",
            data: [95, 90, 92, 89],
            backgroundColor: progressGradient,
            borderColor: "rgba(255, 255, 255, 0.75)",
            borderRadius: 18,
            borderSkipped: false,
            borderWidth: 1,
            hoverBackgroundColor: progressHoverGradient,
            maxBarThickness: 52,
            categoryPercentage: 0.64,
            barPercentage: 0.82,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: prefersReducedMotion ? 0 : 1500,
          easing: "easeOutQuart",
        },
        layout: {
          padding: {
            top: 12,
            right: 10,
            bottom: 0,
            left: 2,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.parsed.y}%`,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: textColor,
              font: {
                size: 12,
                weight: 700,
              },
            },
          },
          y: {
            beginAtZero: true,
            max: 100,
            border: {
              display: false,
            },
            grid: {
              color: gridMuted,
              drawTicks: false,
            },
            ticks: {
              color: textMuted,
              padding: 10,
              stepSize: 20,
              callback: (value) => `${value}%`,
              font: {
                size: 12,
                weight: 700,
              },
            },
          },
        },
      },
    });
  }
};

setupCharts();
