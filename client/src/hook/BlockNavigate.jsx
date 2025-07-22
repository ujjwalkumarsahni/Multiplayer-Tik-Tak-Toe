// src/hooks/useGameProtection.js
import { useEffect } from "react";
import { toast } from "react-toastify";

export const useNavigationBlocker = (gameStarted) => {
  useEffect(() => {
    if (!gameStarted) return;

    // Prevent F5 and Ctrl+R
    const blockRefreshKeys = (e) => {
      if (e.key === "F5" || (e.ctrlKey && e.key.toLowerCase() === "r")) {
        e.preventDefault();
        toast.error("Refresh is disabled during the game!");
      }
    };

    // Prevent back navigation
    const preventBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    // Silent exit hook
    const handleUnload = () => {
      // No confirmation box shown
      console.log("User tried to refresh/leave.");
    };

    // Apply protection
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventBack);
    window.addEventListener("keydown", blockRefreshKeys);
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("keydown", blockRefreshKeys);
      window.removeEventListener("popstate", preventBack);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [gameStarted]);
};
