/** @format */

import { FaHome, FaPlus, FaUser, FaNewspaper } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "../context/store";
import { logout } from "../context/slices/AuthSlice";
import { showToast } from "../utils";

const LeftSidebar = ({
  sidebarProfile,
  setIsToggled,
}: {
  sidebarProfile: string;
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
    <section className='left-sidebar'>
      <div className='p-4 grid place-items-center mb-8'>
        <img src='/assets/sweeter-logo.png' alt='Sweeter' className='w-[130px]' />
      </div>

      <nav>
        <ul className='flex flex-col items-center'>
          <li className='w-[80%] xl:w-[70%]'>
            <Link to='/' className='left-sidebar-page-link'>
              <div
                className='p-3 rounded-full transition duration-300'
                style={{
                  backgroundColor: pathname === "/" ? "var(--clr-essence--01)" : "#333",
                }}
              >
                <FaHome className='text-lg text-pure_soul' />
              </div>
              <p className='hidden md:block uppercase text-sm text-pure_soul'>Home</p>
            </Link>
          </li>
          <li className='w-[80%] xl:w-[70%]'>
            <Link to={`/profile/${auth?.user?.id}`} className='left-sidebar-page-link'>
              <div
                className='p-3 rounded-full transition duration-300'
                style={{
                  backgroundColor: pathname.split("/").includes("profile")
                    ? "var(--clr-essence--01)"
                    : "#333",
                }}
              >
                <FaUser className='text-lg text-pure_soul' />
              </div>
              <p className='hidden md:block uppercase text-sm text-pure_soul'>Profile</p>
            </Link>
          </li>
          <li
            className='w-[80%] xl:w-[70%] cursor-pointer left-sidebar-page-link'
            onClick={() => setIsToggled((prev) => !prev)}
          >
            <div className='p-3 rounded-full bg-[#333]'>
              <FaPlus className='text-lg text-pure_soul' />
            </div>
            <p className='hidden md:block text-pure_soul uppercase text-sm'>Add tweet</p>
          </li>
          <li className='w-[80%] xl:w-[70%]'>
            <Link to='/news' className='left-sidebar-page-link'>
              <div
                className='p-3 rounded-full transition duration-300'
                style={{
                  backgroundColor:
                    pathname === "/news" ? "var(--clr-essence--01)" : "#333",
                }}
              >
                <FaNewspaper className='text-lg text-pure_soul' />
              </div>
              <p className='hidden md:block uppercase text-sm text-pure_soul'>News</p>
            </Link>
          </li>
        </ul>
      </nav>

      <div className='absolute bottom-0 left-0 right-0'>
        <div className='left-sidebar-profile-container'>
          <img
            src={sidebarProfile || "/assets/profile-fallback.png"}
            className='w-[45px] h-[45px] object-cover rounded-full'
          />
          <div>
            <p className='text-pure_soul uppercase'>{auth?.user?.name}</p>
            <p className='text-slate-600 text-sm'>@{auth?.user?.username}</p>
          </div>
        </div>

        <div className='flex items-center justify-center p-6'>
          <button
            className='text-pure_soul font-semibold uppercase'
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
