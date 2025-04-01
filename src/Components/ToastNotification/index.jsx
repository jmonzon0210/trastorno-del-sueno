// src/components/ToastNotification.jsx
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastNotification = () => {
  return <ToastContainer />;
};

// Función para mostrar toasts en cualquier parte de la app
export const showToast = (message, type = "success") => {
  toast[type](message, {
    position: "top-right",
    autoClose: 3000, // Desaparece después de 3 segundos
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export default ToastNotification;
