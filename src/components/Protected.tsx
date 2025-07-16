import { useAuth } from "../context/auth-context";
import axios from "axios";
import { useEffect, useState } from "react";

function Protected() {
  const { user, loading } = useAuth();
  const [data, setData] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    user.getIdToken().then(token => {
      axios.get("http://localhost:5173/protected", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setData(res.data.message || "Protected data fetched successfully."))
      .catch(() => setError("Failed to fetch protected data."));
    });
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in.</div>;
  if (error) return <div>{error}</div>;

  return <div>{data}</div>;
}

export default Protected;