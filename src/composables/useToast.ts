import { reactive } from 'vue';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const toasts = reactive<Toast[]>([]);
let nextId = 0;

export function useToast() {
  const show = (message: string, type: Toast['type'] = 'success', duration = 2000) => {
    const id = nextId++;
    toasts.push({ id, message, type });
    setTimeout(() => {
      const index = toasts.findIndex(t => t.id === id);
      if (index > -1) toasts.splice(index, 1);
    }, duration);
  };

  const success = (message: string) => show(message, 'success');
  const error = (message: string) => show(message, 'error');
  const info = (message: string) => show(message, 'info');

  return { toasts, show, success, error, info };
}
