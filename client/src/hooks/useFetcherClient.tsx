/** @format */

import { useState, useEffect } from "react";
import { fetcherClient } from "../utils";
import { Tweet } from "../interfaces/interface";

const useFetcherClient = (id: string | undefined) => {
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

        const response = await fetcherClient.get(`/user/${id}/tweets`, {
          headers,
        });

        setData(response?.data?.tweets);
      } catch (error) {
        console.log(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTweets();
  }, [id]);

  return { data, isLoading, isError, setData };
};

export default useFetcherClient;
