/** @format */

import { Navigate, Outlet } from "react-router-dom";
import { TopBar, BottomBar, LeftSidebar, RightSidebar } from "../../components";

import { useSelector } from "react-redux/es/exports";
import { RootState } from "../../context/store";
import { useState } from "react";
import TweetBox from "../../components/poppup-box/TweetBox";
import Overlay from "../../components/Overlay";

const RootLayout = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [sidebarProfile, setSidebarProfile] = useState(auth?.user?.profilePicture || "");

  const [isToggled, setIsToggled] = useState(false);

  return (
    <main className='flex justify-center bg-dark_soul h-screen overflow-hidden'>
      {auth.isAuth ? (
        <main className='flex w-[100%] max-w-[1280px]'>
          <TopBar />

          <LeftSidebar sidebarProfile={sidebarProfile} setIsToggled={setIsToggled} />

          <section className='relative bg-dark_soul h-[100lvh] flex-1'>
            <Outlet context={[setSidebarProfile]} />
          </section>

          <RightSidebar />

          <BottomBar setIsToggled={setIsToggled} />

          {isToggled && <Overlay setIsToggled={setIsToggled} />}
          {isToggled && <TweetBox setIsToggled={setIsToggled} />}
        </main>
      ) : (
        <Navigate to='/log-in' />
      )}
    </main>
  );
};

export default RootLayout;
