import React from "react";

interface IdleTimeOutOptions {
  action: () => void;
  waitTime: number;
}

export function useIdleTimeOut({ action, waitTime }: IdleTimeOutOptions) {
  React.useEffect(() => {
    const events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
    ];

    let timer = setTimeout(action, waitTime * 1000 * 60)

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(action, waitTime * 1000 * 60);
    };

    [...events].forEach((item) => {
      window.addEventListener(item, resetTimer);
    });

    return () => {
      [...events].forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
    }

  }, [action, waitTime]);
}