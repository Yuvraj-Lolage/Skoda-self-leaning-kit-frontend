import { driver } from "driver.js";
import "driver.js/dist/driver.css";

interface DriverPopover {
    title?: string;
    description?: string;
    position?: string;
    [key: string]: any;
}

export interface DriverStep {
    element?: string | Element | (() => Element);
    popover?: DriverPopover;
    [key: string]: any;
}

let driverInstance: any = null;

export const startTour = (steps: any[], onFinish?: () => void) => {
  // 🔥 DESTROY previous tour if exists
  if (driverInstance) {
    driverInstance.destroy();
    driverInstance = null;
  }

  driverInstance = driver({
    showProgress: true,
    allowClose: false,
    nextBtnText: "Next",
    prevBtnText: "Previous",
    doneBtnText: "Finish",
    popoverClass: 'driverjs-theme',
    onDestroyed: () => {
      driverInstance = null;
      onFinish?.();
    },
  });

  driverInstance.setSteps(steps);
  driverInstance.drive();
};

