"use client";

import { useCallback, useEffect, useRef } from "react";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";

import { completeOnboarding } from "@/server/server-actions";

interface OnboardingTourProps {
  readonly showTour: boolean;
}

const TOUR_STEPS = [
  {
    element: "[data-tour='quick-create']",
    popover: {
      title: "Get started",
      description: "Step 1: Create your first project to start tracking milestones.",
      side: "right" as const,
      align: "start" as const,
    },
  },
  {
    element: "[data-tour='nav-dashboard']",
    popover: {
      title: "Your overview",
      description: "Step 2: View your project stats and recent activity here.",
      side: "right" as const,
      align: "start" as const,
    },
  },
  {
    element: "[data-tour='search']",
    popover: {
      title: "Find anything",
      description: "Step 3: Use the search bar to quickly find projects, settings, and more.",
      side: "bottom" as const,
      align: "start" as const,
    },
  },
  {
    element: "[data-tour='nav-settings']",
    popover: {
      title: "Make it yours",
      description: "Step 4: Customize your dashboard appearance and account settings.",
      side: "right" as const,
      align: "start" as const,
    },
  },
];

export function OnboardingTour({ showTour }: OnboardingTourProps) {
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);

  const handleComplete = useCallback(async () => {
    await completeOnboarding();
  }, []);

  useEffect(() => {
    if (!showTour) {
      return;
    }

    const tour = driver({
      showProgress: true,
      allowClose: true,
      overlayClickBehavior: "close",
      stagePadding: 4,
      stageRadius: 8,
      popoverOffset: 8,
      showButtons: ["next", "previous", "close"],
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Finish",
      progressText: "{{current}} of {{total}}",
      onDestroyed: () => {
        void handleComplete();
      },
      steps: TOUR_STEPS,
    });

    driverRef.current = tour;

    const timer = setTimeout(() => {
      tour.drive();
    }, 500);

    return () => {
      clearTimeout(timer);
      if (driverRef.current?.isActive()) {
        driverRef.current.destroy();
      }
    };
  }, [showTour, handleComplete]);

  return null;
}
