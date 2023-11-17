/** @format */

import { useState, useEffect } from "react";
import { fetcherClient } from "../utils";
import { Tweet } from "../interfaces/interface";

const useFetcherClient = () => {
  const [data, setData] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchTweets = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const headers = {
          "Content-Type": "application/json",
          "x-auth-token": `Bearer ${accessToken}`,
        };

        const response = await fetcherClient.get("/tweet", {
          headers,
        });
        setIsLoading(false);
        setData(response?.data?.tweets);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setIsError(true);
      }
    };

    fetchTweets();
  }, []);

  return { data, isLoading, isError, setData };
};

export default useFetcherClient;
