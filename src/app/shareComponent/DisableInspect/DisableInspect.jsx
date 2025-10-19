// components/DisableInspect.jsx
"use client";
import { useEffect } from "react";

export default function DisableInspect() {
  useEffect(() => {
    // Disable right click
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // Disable common DevTools keyboard shortcuts
    const handleKeyDown = (e) => {
      // F12
      if (e.keyCode === 123) e.preventDefault();
      // Ctrl+Shift+I / Ctrl+Shift+J
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) e.preventDefault();
      // Ctrl+U (view source)
      if (e.ctrlKey && e.keyCode === 85) e.preventDefault();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return null;
}
