import { toast } from 'sonner';

export const showToast = (message, type = 'success') => {
  toast[type](message);
};
