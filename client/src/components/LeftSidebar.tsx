import { FaHome, FaPlus, FaUser, FaNewspaper } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "../context/store";
import { logout } from "../context/slices/AuthSlice";
import { showToast } from "../utils";

const LeftSidebar = ({
    setIsToggled,
}: {
    setIsToggled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const auth = useSelector((state: RootState) => state.auth);

    const dispatch: AppDispatch = useDispatch();
    const { pathname } = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        showToast("Logout successfull!", "default", 2000);
        dispatch(logout());
    };

    return (
        <section className="bg-dark_soul h-screen relative w-[360px] border-l-2 border-slate-900">
            <div className="p-4 grid place-items-center mb-8">
                <img
                    src="/assets/sweeter-logo.png"
                    alt="Sweeter"
                    className="w-[130px]"
                />
            </div>

            <nav>
                <ul className="flex flex-col items-center">
                    <li className="w-[70%]">
                        <Link
                            to="/"
                            className="flex gap-10 items-center justify-start px-4 py-2 rounded-md transition duration-300 hover:bg-neutral-900"
                        >
                            <div
                                className="p-3 rounded-full transition duration-300"
                                style={{
                                    backgroundColor:
                                        pathname === "/"
                                            ? "var(--clr-essence--01)"
                                            : "#333",
                                }}
                            >
                                <FaHome className="text-lg text-pure_soul" />
                            </div>
                            <p
                                className="uppercase text-sm"
                                style={{
                                    color:
                                        pathname === "/"
                                            ? "var(--clr-essence--02)"
                                            : "var(--clr-pure--soul)",
                                }}
                            >
                                Home
                            </p>
                        </Link>
                    </li>
                    <li className="w-[70%]">
                        <Link
                            to="/profile/:id"
                            className="flex gap-10 items-center justify-start px-4 py-2 rounded-md transition duration-300 hover:bg-neutral-900"
                        >
                            <div
                                className="p-3 rounded-full transition duration-300"
                                style={{
                                    backgroundColor:
                                        pathname === "/profile/:id"
                                            ? "var(--clr-essence--01)"
                                            : "#333",
                                }}
                            >
                                <FaUser className="text-lg text-pure_soul" />
                            </div>
                            <p
                                className="uppercase text-sm"
                                style={{
                                    color:
                                        pathname === "/profile/:id"
                                            ? "var(--clr-essence--02)"
                                            : "var(--clr-pure--soul)",
                                }}
                            >
                                Profile
                            </p>
                        </Link>
                    </li>
                    <li
                        className="flex gap-10 items-center justify-start w-[70%] cursor-pointer px-4 py-2 rounded-md transition duration-300 hover:bg-neutral-900"
                        onClick={() => setIsToggled((prev) => !prev)}
                    >
                        <div className="p-3 rounded-full bg-[#333]">
                            <FaPlus className="text-lg text-pure_soul" />
                        </div>
                        <p className="text-pure_soul uppercase text-sm">
                            Add tweet
                        </p>
                    </li>
                    <li className="w-[70%]">
                        <Link
                            to="/news"
                            className="flex gap-10 items-center justify-start px-4 py-2 rounded-md transition duration-300 hover:bg-neutral-900"
                        >
                            <div
                                className="p-3 rounded-full transition duration-300"
                                style={{
                                    backgroundColor:
                                        pathname === "/news"
                                            ? "var(--clr-essence--01)"
                                            : "#333",
                                }}
                            >
                                <FaNewspaper className="text-lg text-pure_soul" />
                            </div>
                            <p
                                className="uppercase text-sm"
                                style={{
                                    color:
                                        pathname === "/news"
                                            ? "var(--clr-essence--02)"
                                            : "var(--clr-pure--soul)",
                                }}
                            >
                                News
                            </p>
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="absolute bottom-0 left-0 right-0">
                <div className="flex items-center justify-center gap-6 p-6 border-b-2 border-b-essence01">
                    <img
                        src={
                            auth?.user?.profilePicture ||
                            "/assets/profile-fallback.png"
                        }
                        className="w-[45px] h-[45px] object-cover rounded-full"
                    />
                    <div>
                        <p className="text-pure_soul uppercase">
                            {auth?.user?.name}
                        </p>
                        <p className="text-slate-600 text-sm">
                            @{auth?.user?.username}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-center p-6">
                    <button
                        className="text-pure_soul font-semibold uppercase"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </section>
    );
};

export default LeftSidebar;
