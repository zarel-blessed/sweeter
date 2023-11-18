/** @format */

import { API_BASE_URL } from "../constants";
import { Tweet } from "../interfaces/interface";
import { fetcherClient, showToast } from "../utils";
import { handleImageUpload } from "./image-functions";

export const fetchAllTweets = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const headers = {
      "Content-Type": "application/json",
      "x-auth-token": `Bearer ${accessToken}`,
    };

    const response = await fetcherClient.get("/tweet", {
      headers,
    });

    return response.data;
  } catch (error: any) {
    console.error(error);
    showToast(error.message, "error");
    throw error;
  }
};

export const createTweet = async (content: string, image?: any) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const headers = {
      "Content-Type": "application/json",
      "x-auth-token": `Bearer ${accessToken}`,
    };

    if (image) {
      const ImageResponse = await handleImageUpload(image);

      await fetcherClient.post(
        "/tweet",
        JSON.stringify({
          content,
          image: `${API_BASE_URL}/storage/${ImageResponse.data.filename}`,
        }),
        {
          headers,
        }
      );
    } else {
      await fetcherClient.post(
        "/tweet",
        JSON.stringify({
          content,
        }),
        {
          headers,
        }
      );
    }
  } catch (error: any) {
    if (error?.response?.status === 400) {
      showToast("You can't tweet that", "error");
    } else showToast(`${error.message}`, "error");
  }
};

export const replyTweet = async (content: string, id: Tweet) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const headers = {
      "Content-Type": "application/json",
      "x-auth-token": `Bearer ${accessToken}`,
    };

    await fetcherClient.post(
      `/tweet/${id}/reply`,
      JSON.stringify({
        content,
      }),
      {
        headers,
      }
    );
  } catch (error: any) {
    if (error?.response?.status === 400) {
      showToast("You can't reply that", "error");
    } else showToast("Something went wrong!", "error");
  }
};

export const deleteTweet = async (
  tweet_id: Tweet,
  setTweets?: React.Dispatch<React.SetStateAction<Tweet[]>>
) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const headers = {
      "Content-Type": "application/json",
      "x-auth-token": `Bearer ${accessToken}`,
    };

    if (setTweets)
      setTweets((prev) => [...prev.filter((tweet: Tweet) => tweet._id != tweet_id)]);

    await fetcherClient.delete(`/tweet/${tweet_id}`, { headers });
  } catch (error) {
    showToast("Can't delete the Tweet!", "error", 3000);
  }
};

export const getUserTweets = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const headers = {
      "Content-Type": "application/json",
      "x-auth-token": `Bearer ${accessToken}`,
    };

    const response = await fetcherClient.get(`/tweet/getUserTweets`, { headers });
    console.log(response.data);
    return response.data.tweets;
  } catch (error) {
    console.error(error);
    showToast("Can't get user's Tweet!", "error", 3000);
  }
};
