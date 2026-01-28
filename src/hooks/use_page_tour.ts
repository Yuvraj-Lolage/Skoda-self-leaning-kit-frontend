import { useEffect, useRef } from "react";
import { startTour } from "../utils/start_tour";
import { useTours } from "../context/tour_context";

export const usePageTour = (
  tourKey: string,
  steps: any[],
  ready: boolean = true
) => {
  const { tours, loading, markTourComplete } = useTours();
  const hasStarted = useRef(false);

  useEffect(() => {
    if (loading || !ready || !tours) return;
    if (hasStarted.current) return;

    if (!tours[tourKey]) {
      hasStarted.current = true;

      startTour(steps, () => {
        markTourComplete(tourKey);
      });
    }
  }, [loading, ready, tours, tourKey]);
};
