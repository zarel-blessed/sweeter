import { Navigate, Outlet, useLocation } from "react-router-dom";
import { BottomBar, LeftSidebar, RightSidebar } from "../../components";

import { useSelector } from "react-redux/es/exports";
import { RootState } from "../../context/store";
import { useState } from "react";
import TweetBox from "../../components/ui/TweetBox";
import Overlay from "../../components/Overlay";

const RootLayout = () => {
    const auth = useSelector((state: RootState) => state.auth);
    const { pathname } = useLocation();

    const [isToggled, setIsToggled] = useState(false);

    return (
        <main className="flex justify-center bg-dark_soul h-screen overflow-hidden">
            {auth.isAuth ? (
                <main className="flex w-[100%] max-w-[1400px]">
                    <LeftSidebar setIsToggled={setIsToggled} />
                    <section className="relative bg-pure_soul h-screen flex-1">
                        <div className="top-left-curve">
                            <h2 className="uppercase text-pure_soul">
                                {pathname === "/"
                                    ? "Home"
                                    : pathname === "/profile/:id"
                                    ? "Profile"
                                    : "News"}
                            </h2>
                        </div>

                        <Outlet />
                    </section>
                    <RightSidebar />
                    <BottomBar />
                    {isToggled && <Overlay setIsToggled={setIsToggled} />}
                    {isToggled && <TweetBox setIsToggled={setIsToggled} />}
                </main>
            ) : (
                <Navigate to="/log-in" />
            )}
        </main>
    );
};

export default RootLayout;