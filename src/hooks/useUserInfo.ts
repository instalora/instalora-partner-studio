import { useEffect, useState } from "react";

export type UserInfo = {
  first_name: string;
  email: string;
};

export function useUserInfo() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setIsLoadingUser(false);
      return;
    }

    const controller = new AbortController();

    const fetchUserInfo = async () => {
      try {
        setIsLoadingUser(true);
        const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined
          ?? "https://api.epictwin.co").replace(/\/$/, "");
        const response = await fetch(`${apiBaseUrl}/v1.0/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await response.json();
        setUserInfo({ first_name: data.first_name, email: data.email });
      } catch (error) {
        setUserInfo(null);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserInfo();

    return () => controller.abort();
  }, []);

  return { userInfo, isLoadingUser };
}
