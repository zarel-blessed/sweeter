/** @format */

import { fetcherClient, showToast } from "../utils";

export const getUserData = async (id: string | undefined) => {
  const accessToken = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    "x-auth-token": `Bearer ${accessToken}`,
  };

  try {
    const response = await fetcherClient.get(`/user/${id}`, {
      headers,
    });

    const data = await response.data;
    return data?.user;
  } catch (error) {
    showToast("Something went wrong!", "error");
  }
};
