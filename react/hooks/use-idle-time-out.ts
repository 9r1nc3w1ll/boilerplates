import { useEffect } from 'react';

interface UseTimeOutOptions {
  action: () => void;
  duration: number;
}

export function useIdleTimeOut({ action, duration }: UseTimeOutOptions) {
  useEffect(() => {
    const events = ['load', 'mousemove', 'click', 'scroll', 'keydown'];
    const storageKey = 'timeout';
    const currentTime = new Date();
    const timeout = localStorage.getItem(storageKey);

    if (!timeout) {
      localStorage.setItem(storageKey, String(currentTime.getTime() + (duration * 1000 * 60)));
    }

    const interval = setInterval(() => {
      const timeout = localStorage.getItem(storageKey);
      if (!!timeout && (new Date()).getTime() >= Number(timeout)) action();
    }, 1000 * 15);

    const resetTimer = () => {
      const currentTime = new Date();
      localStorage.setItem(storageKey, String(currentTime.getTime() + (duration * 1000 * 60)));
    }

    [...events].forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      clearInterval(interval);
      [...events].forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    }
  }, [action, duration]);