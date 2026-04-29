import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const INACTIVITY_LIMIT = 50 * 60 * 1000;

const useInactivity = (onLogout) => {
  const inactivityTimer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const logout = () => {
      if (typeof onLogout === "function") {
        onLogout();
      }
      sessionStorage.clear();
      navigate("/");
    };

    const resetTimer = () => {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(logout, INACTIVITY_LIMIT);
    };

    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [onLogout, navigate]);
};

export default useInactivity;
