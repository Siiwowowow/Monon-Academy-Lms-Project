"use client";
import { useEffect, useState } from "react";
import useAuth from "./useAuth";

export default function useRole() {
  const { user } = useAuth();
  const [role, setRole] = useState("user"); // default role
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/users/role?email=${user.email}`);
        if (!res.ok) throw new Error("Failed to fetch role");
        const data = await res.json();
        setRole(data.role || "user"); // fallback user
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [user?.email]);

  return { role, loading };
}
