import { useAuth } from "../context/auth-context";
import axios from "axios";
import { useEffect, useState } from "react";

function Protected() {
  const { user, loading } = useAuth();
  const [data, setData] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);

  useEffect(() => {
    if (!user) return;
    setIsPending(true);
    user.getIdToken().then(token => {
      axios.get("http://localhost:5173/protected", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setData(res.data.message || "Protected data fetched successfully.");
        setError(null);
      })
      .catch(() => setError("Failed to fetch protected data."))
      .finally(() => setIsPending(false));
    });
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in.</div>;
  if (isPending) return <div>Loading protected data...</div>;
  if (error) return <div className="text-wrong-500">{error}</div>;

  return <div>{data}</div>;
}

export default Protected;