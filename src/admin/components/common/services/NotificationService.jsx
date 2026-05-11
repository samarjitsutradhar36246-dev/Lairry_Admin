import toast from "react-hot-toast";
import SuccessToast from "../toasts/SuccessToast";
import ErrorToast from "../toasts/ErrorToast";
import PayloadToast from "../toasts/PayloadToast";

/**
 * NotificationService
 * All app toasts should go through this service.
 */

const NotificationService = {
  /**
   * Show a success toast
   * @param {string} message
   */
  success(message) {
    toast.custom((t) => (
      <SuccessToast message={message} onClose={() => toast.dismiss(t.id)} />
    ));
  },

  /**
   * Show an error toast
   * @param {string} message
   */
  error(message) {
    toast.custom((t) => (
      <ErrorToast message={message} onClose={() => toast.dismiss(t.id)} />
    ));
  },

  /**
   * Show a payload toast (e.g., temp password)
   * @param {string} message
   * @param {string} payload
   */
  payload(message, payload) {
    toast.custom((t) => (
      <PayloadToast
        message={message}
        payload={payload}
        onClose={() => toast.dismiss(t.id)}
      />
    ));
  },
};

export default NotificationService;
