import { useState, useRef, useCallback, useEffect, useMemo } from 'react';

type TimerReturnType = [number, boolean, () => void, () => void, () => void];

export const useTimer = (): TimerReturnType => {
  const [time, setTime] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);

  const animate = useCallback((currentTime: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = currentTime;
    }

    const elapsedTime = currentTime - startTimeRef.current;
    setTime(elapsedTime);

    requestRef.current = requestAnimationFrame(animate);
  }, []);

  const start = useCallback(() => {
    if (!running) {
      setRunning(true);
      startTimeRef.current = null;
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [animate, running]);

  const stop = useCallback(() => {
    if (running) {
      setRunning(false);
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }

      // Save the current time when stopping the timer
      startTimeRef.current = performance.now();
    }
  }, [running, time]);

  const reset = useCallback(() => {
    setTime(0);
    setRunning(false);
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
    }
    startTimeRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup function
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return [time, running, start, stop, reset];
};
