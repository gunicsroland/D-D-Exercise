import { useState, useEffect } from "react";

const getUtcNow = () => {
  const now = new Date();
  return now.getTime() + now.getTimezoneOffset() * 60000;
};

export const useActiveTimer = (intervalMs = 1000) => {
  const [now, setNow] = useState(getUtcNow());

  useEffect(() => {
    const interval = setInterval(() => setNow(getUtcNow()), intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  return now;
};