'use client';

import toast from 'react-hot-toast';

export { toast };

export function showToast({ title, description, variant = 'default' }) {
  const toastConfig = {
    duration: 3000,
    position: 'top-right',
  };

  if (variant === 'destructive') {
    toast.error(description || title, toastConfig);
  } else {
    toast.success(description || title, toastConfig);
  }
}