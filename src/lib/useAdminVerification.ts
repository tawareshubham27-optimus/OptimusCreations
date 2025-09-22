import { useState } from "react";
import { verifyAdmin } from "@/lib/adminUtils";

export function useAdminVerification() {
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");

  function handleVerify(password: string) {
    if (verifyAdmin(password)) {
      setIsVerified(true);
      setError("");
    } else {
      setError("Invalid admin password");
    }
  }

  return { isVerified, error, handleVerify };
}
