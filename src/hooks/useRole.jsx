// hooks/useRole.js
"use client";
import { useEffect, useState } from "react";
import useAuth from "./useAuth";

export default function useRole() {
  const { user } = useAuth();
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(true);
  const [needsUpdate, setNeedsUpdate] = useState(false);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        // First, check if role needs update
        const checkRes = await fetch(`/api/check-role-update?email=${user.email}`);
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          
          if (checkData.needsRoleUpdate) {
            // Auto-update role
            const updateRes = await fetch('/api/check-role-update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: user.email })
            });
            
            if (updateRes.ok) {
              console.log('Role auto-updated to student');
              setNeedsUpdate(true);
            }
          }
        }

        // Then get current role
        const res = await fetch(`/api/users/role?email=${user.email}`);
        if (!res.ok) throw new Error("Failed to fetch role");
        const data = await res.json();
        setRole(data.role || "user");
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user?.email]);

  // Function to manually check for role update
  const checkAndUpdateRole = async () => {
    if (!user?.email) return;
    
    try {
      const res = await fetch('/api/check-role-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.previousRole !== data.newRole) {
          setRole(data.newRole);
          return true; // Role was updated
        }
      }
    } catch (error) {
      console.error("Error checking role update:", error);
    }
    return false; // No update
  };

  return { role, loading, needsUpdate, checkAndUpdateRole };
}