import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function WelcomeModal({ isOpen, onStartTour, onSkip }) {
  const modalRef = useRef();

  useEffect(() => {
    if (isOpen) {
      const modal = new window.bootstrap.Modal(modalRef.current);
      modal.show();

      // Close callback
      modalRef.current.addEventListener("hidden.bs.modal", onSkip);
    }
  }, [isOpen, onSkip]);

  return (
    <div
      className="modal fade"
      tabIndex="-1"
      ref={modalRef}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ backdropFilter: "blur(4px)" }}>
          <div className="modal-header">
            <h5 className="modal-title">Welcome!</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onSkip}
            ></button>
          </div>
          <div className="modal-body">
            <p>We’re glad to have you. Let’s take a quick tour of the dashboard.</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onSkip}
            >
              Skip
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onStartTour}
            >
              Start Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
