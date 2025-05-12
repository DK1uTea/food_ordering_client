import { toast } from 'react-toastify';

// Success toast
export const showSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000
  });
};

// Error toast
export const showError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000
  });
};

// Info toast
export const showInfo = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000
  });
};

// Warning toast
export const showWarning = (message) => {
  toast.warning(message, {
    position: "top-right",
    autoClose: 4000
  });
};