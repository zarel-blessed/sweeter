/** @format */

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "./slices/AuthSlice";
import { AppDispatch } from "./store";

const AuthInitializer = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (accessToken && storedUser) {
      dispatch(login(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return null;
};

export default AuthInitializer;
