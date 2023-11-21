/** @format */

import { useDispatch } from "react-redux";
import { logout } from "../context/slices/AuthSlice";
import { AppDispatch } from "../context/store";
import { showToast } from "../utils";

const TopBar = () => {
  const dispatch: AppDispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    showToast("Logout successfull!", "default", 2000);
    dispatch(logout());
  };

  return (
    <header className='flex justify-between items-center sm:hidden fixed top-0 left-0 right-0 bg-zinc-950/80 z-10 py-3 px-4 backdrop-blur-[2px]'>
      <img src='/assets/sweeter-logo.png' className='w-[150px]' />
      <p className='text-slate-200 font-medium' onClick={handleLogout}>
        Logout
      </p>
    </header>
  );
};

export default TopBar;
