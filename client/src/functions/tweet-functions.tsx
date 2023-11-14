/** @format */

import axios from "axios";
import { Image } from "../components/ui/TweetBox";
import { API_BASE_URL } from "../constants";
import { Tweet } from "../interfaces/interface";
import { fetcherClient, showToast } from "../utils";

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

const handleImageUpload = async (image: Image | undefined) => {
  let formData = new FormData();
  formData.append("file", image?.data);

  const response = await axios.post(`${API_BASE_URL}/upload-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

export const createTweet = async ({
  content,
  image,
}: {
  content: string;
  image?: Image | undefined;
}) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const headers = {
      "Content-Type": "application/json",
      "x-auth-token": `Bearer ${accessToken}`,
    };

    if (image?.data !== "") {
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
    } else showToast("Something went wrong!", "error");
  }
};

export const deleteTweet = async (tweet_id: Tweet) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const headers = {
      "Content-Type": "application/json",
      "x-auth-token": `Bearer ${accessToken}`,
    };

    fetcherClient.delete(`/tweet/${tweet_id}`, { headers });
  } catch (error) {
    showToast("Can't delete the Tweet!", "error", 3000);
  }
};
