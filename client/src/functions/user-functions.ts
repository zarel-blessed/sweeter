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
    return data;
  } catch (error) {
    showToast("Something went wrong!", "error");
  }
};

export const updateUser = async (
  id: string | undefined,
  name: string,
  dateOfBirth: Date | string,
  location: string,
  bio: string
) => {
  const accessToken = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    "x-auth-token": `Bearer ${accessToken}`,
  };

  try {
    await fetcherClient.put(
      `/user/${id}`,
      JSON.stringify({
        name,
        dateOfBirth,
        location,
        bio,
      }),
      {
        headers,
      }
    );
  } catch (error) {
    showToast("Can't update user", "error");
  }
};

export const followUnfollow = async (
  id: string | undefined,
  user_id: string,
  isFollowing: boolean,
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
  username: string
) => {
  setDisabled(true);
  const accessToken = localStorage.getItem("accessToken");

  const headers = {
    "Content-Type": "application/json",
    "x-auth-token": `Bearer ${accessToken}`,
  };

  try {
    if (!isFollowing) {
      await fetcherClient.post(
        `/user/${id}/follow`,
        JSON.stringify({
          user_id,
        }),
        {
          headers,
        }
      );

      showToast(`Now you are following ${username}`);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          following: [...user.following, user_id],
        })
      );
    } else {
      await fetcherClient.post(
        `/user/${id}/unfollow`,
        JSON.stringify({
          user_id,
        }),
        {
          headers,
        }
      );

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          following: [
            ...user.following.filter((follower: any) => follower._id != user_id),
          ],
        })
      );
    }
  } catch (error) {
    showToast("Can't follow", "error");
  } finally {
    setDisabled(false);
  }
};
