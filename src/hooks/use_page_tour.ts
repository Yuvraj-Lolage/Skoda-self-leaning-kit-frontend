import { useEffect, useRef } from "react";
import { startTour } from "../utils/start_tour";
import { useTours } from "../context/tour_context";

export const usePageTour = (
  tourKey: string,
  steps: any[],
  ready: boolean = false
) => {
  const { tours, loading, markTourComplete } = useTours();
  const hasStarted = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (!ready) return;
    if (!tours) return;
    if (hasStarted.current) return;

    // ✅ SAFE ACCESS (moved inside)
    const isCompleted = tours?.[tourKey];

    if (isCompleted === false || isCompleted === undefined) {
      hasStarted.current = true;

      startTour(steps, () => {
        markTourComplete(tourKey);
      });
    }

  }, [loading, ready, tours, tourKey]);
};