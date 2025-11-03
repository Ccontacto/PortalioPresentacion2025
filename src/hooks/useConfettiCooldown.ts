import { useCallback, useEffect, useRef, useState } from 'react';
import { launchConfetti } from '../utils/confetti';

type Options = {
  cooldownMs?: number;
  tickMs?: number;
};

type LaunchResult = {
  launched: boolean;
  remaining: number;
};

export function useConfettiCooldown({ cooldownMs = 5000, tickMs = 200 }: Options = {}) {
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef<number | null>(null);
  const lastLaunchRef = useRef(0);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null && typeof window !== 'undefined') {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const updateRemaining = useCallback(() => {
    const now = Date.now();
    const next = Math.max(0, lastLaunchRef.current + cooldownMs - now);
    setRemaining(next);
    if (next === 0) {
      stopTimer();
    }
  }, [cooldownMs, stopTimer]);

  const startTimer = useCallback(() => {
    if (timerRef.current !== null || typeof window === 'undefined') {
      return;
    }
    timerRef.current = window.setInterval(() => {
      updateRemaining();
    }, tickMs);
  }, [tickMs, updateRemaining]);

  const tryLaunch = useCallback((): LaunchResult => {
    if (typeof window === 'undefined') {
      return { launched: false, remaining: 0 };
    }

    const now = Date.now();
    const timeLeft = Math.max(0, lastLaunchRef.current + cooldownMs - now);

    if (timeLeft > 0) {
      setRemaining(timeLeft);
      startTimer();
      return { launched: false, remaining: timeLeft };
    }

    launchConfetti();
    lastLaunchRef.current = now;
    setRemaining(cooldownMs);
    startTimer();
    return { launched: true, remaining: cooldownMs };
  }, [cooldownMs, startTimer]);

  const reset = useCallback(() => {
    lastLaunchRef.current = 0;
    stopTimer();
    setRemaining(0);
  }, [stopTimer]);

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  return {
    remaining,
    isOnCooldown: remaining > 0,
    tryLaunch,
    reset
  };
}
