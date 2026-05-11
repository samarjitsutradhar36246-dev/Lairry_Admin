import { useLocation } from "react-router-dom";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { tourSteps } from "./tourSteps";
import NotificationService from "../components/common/services/NotificationService";

/**
 * Detects if any modal that supports tour is currently open.
 * Modal must have: data-tour-key="some-key"
 */
const getActiveModalTourKey = () => {
  const modal = document.querySelector("[data-tour-key]");
  return modal?.getAttribute("data-tour-key") || null;
};

export const useTour = () => {
  const location = useLocation();

  const startTour = () => {
    // 1. Check if a modal tour should be used
    const modalTourKey = getActiveModalTourKey();

    // 2. Decide which tour key to use
    const stepsKey = modalTourKey
      ? modalTourKey
      : location.pathname.replace(/\/$/, "") || "/admin";

    const steps = tourSteps[stepsKey];

    // 3. No tour defined
    if (!steps || steps.length === 0) {
      NotificationService.error(
        modalTourKey
          ? "No guided tour is available for this dialog."
          : "No guided tour is available for this page."
      );
      return;
    }

    // 4. Filter only existing elements
    const validSteps = steps.filter(
      (step) =>
        !step.element || document.querySelector(step.element) !== null
    );

    if (validSteps.length === 0) {
      NotificationService.error(
        "Tour items are not ready yet. Please try again in a moment."
      );
      return;
    }

    // 5. Detect dark mode
    const isDark = document.documentElement.classList.contains("dark");

    const driverObj = driver({
      showProgress: true,
      animate: true,
      smoothScroll: true,
      allowClose: true,
      nextBtnText: "Next →",
      prevBtnText: "← Back",
      doneBtnText: "✓ Done",
      popoverClass: isDark ? "tour-dark" : "tour-light",
      steps: validSteps,
    });

    driverObj.drive();
  };

  return { startTour };
};