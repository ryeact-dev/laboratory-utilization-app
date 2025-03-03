import { toast } from 'sonner';

export const ToastNotification = (toastType, message) => {
  return toast[toastType](message, { duration: 3000 });

  // switch (toastType) {
  //   case 'success':
  //     return toast.success(message, { toastId, duration: 3000 });
  //   case 'error':
  //     return toast.error(message, { toastId, duration: 3000 });
  //   case 'info':
  //     return toast.info(message, { toastId, duration: 3000 });
  //   case 'warning':
  //     return toast.warning(message, { toastId, duration: 3000 });
  //   default:
  //     return;
  // }
};
