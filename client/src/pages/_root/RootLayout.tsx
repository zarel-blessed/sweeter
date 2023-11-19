/** @format */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { BottomBar, LeftSidebar, RightSidebar } from "../../components";

import { useSelector } from "react-redux/es/exports";
import { RootState } from "../../context/store";
import { useState } from "react";
import TweetBox from "../../components/poppup-box/TweetBox";
import Overlay from "../../components/Overlay";

const RootLayout = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const [sidebarProfile, setSidebarProfile] = useState(auth?.user?.profilePicture || "");
  const { pathname } = useLocation();

  const [isToggled, setIsToggled] = useState(false);

  return (
    <main className='flex justify-center bg-dark_soul h-screen overflow-hidden'>
      {auth.isAuth ? (
        <main className='flex w-[100%] max-w-[1400px]'>
          <LeftSidebar sidebarProfile={sidebarProfile} setIsToggled={setIsToggled} />
          <section className='relative bg-pure_soul h-screen flex-1'>
            <div
              className='top-left-curve top-0'
              style={{
                display: pathname === "/" ? "block" : "none",
              }}
            >
              <h2 className='uppercase text-pure_soul'>
                {pathname === "/" ? "Home" : pathname === "/news" ? `News` : "Other"}
              </h2>
            </div>

            <Outlet context={[setSidebarProfile]} />
          </section>
          <RightSidebar />
          <BottomBar />
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
