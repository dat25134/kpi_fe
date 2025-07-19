import useSWR from "swr";
import { changePassword, fetchUserInfo, fetchUserProfile } from "@/services/user";
import { useState, useCallback } from "react";
import { getErrorMessage } from "@/services/errorHandler";

export function useUser() {
  const { data, error, isLoading } = useSWR("user-info", fetchUserInfo);
  return {
    user: data,
    isLoading,
    isError: error,
  };
}

export function useUserProfile() {
  const { data, error, isLoading } = useSWR("user-profile", fetchUserProfile);
  return {
    userProfile: data,
    isLoading,
    isError: error,
  };
}

export function useChangePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const doChangePassword = useCallback(async (payload: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const data = await changePassword(payload);
      if (data.success) {
        setSuccess(data.message || "Đổi mật khẩu thành công!");
      } else {
        setError(data.message || "Đã xảy ra lỗi.");
      }
      return data;
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { doChangePassword, loading, error, success };
}