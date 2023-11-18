/** @format */

import axios from "axios";
import { API_BASE_URL } from "../constants";
import { fetcherClient, showToast } from "../utils";
// import { RootState } from "../context/store";
// import { useDispatch, useSelector } from "react-redux";
// import { updateProfilePic } from "../context/slices/AuthSlice";

export interface Image {
  preview: string;
  data: File | null;
}

export const handleFileSelect = (
  event: React.ChangeEvent<HTMLInputElement>,
  setterFunction: React.Dispatch<React.SetStateAction<Image | null>>
) => {
  if (event.target.files && event.target.files.length) {
    const img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    };

    setterFunction(img);
  }
};

export const handleImageUpload = async (image: any) => {
  let formData = new FormData();
  formData.append("file", image?.data);

  const response = await axios.post(`${API_BASE_URL}/upload-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

export const updateImage = async (
  image: Image,
  user_id: string,
  endpoint: string,
  setSidebarProfile?: React.Dispatch<React.SetStateAction<string>> | null
) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    const headers = {
      "Content-Type": "application/json",
      "x-auth-token": `Bearer ${accessToken}`,
    };

    const ImageResponse = await handleImageUpload(image);
    const filepath = `${API_BASE_URL}/storage/${ImageResponse.data.filename}`;

    await fetcherClient.post(
      `/user/${user_id}/${endpoint}`,
      JSON.stringify({
        filepath,
      }),
      {
        headers,
      }
    );

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (endpoint === "uploadProfilePic") {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          profilePicture: filepath,
        })
      );
    }

    if (endpoint === "uploadBannerImage") {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          bannerImage: filepath,
        })
      );
    }

    if (setSidebarProfile) setTimeout(() => setSidebarProfile(filepath), 500);
  } catch (error) {
    console.error(error);
    showToast("Sorry, unable to upload image", "error");
  }
};
