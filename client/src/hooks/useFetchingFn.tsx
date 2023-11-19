/** @format */

import { useState } from "react";

export const fetchingGETFn = async (URL: string) => {
  try {
    const response = await fetch(URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchingPOSTFn = async (URL: string, data: any) => {
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const fetchingPUTFn = async (URL: string, data: any) => {
  try {
    const response = await fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const useFetchingFn = (URL: string, method: string, dataObj: any = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (method === "GET") {
        const response = await fetchingGETFn(URL);
        setData(response);
      } else if (method === "POST") {
        const response = await fetchingPOSTFn(URL, dataObj);
        setData(response);
      } else if (method === "PUT") {
        const response = await fetchingPUTFn(URL, dataObj);
        setData(response);
      } else {
        setError("Method not supported");
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchData();

  return { data, loading, error };
};

export default useFetchingFn;
