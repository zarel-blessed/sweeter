/** @format */

import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaNewspaper, FaPlus, FaSearch } from "react-icons/fa";
import { RootState } from "../context/store";

const BottomBar = ({
  setIsToggled,
}: {
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const auth = useSelector((state: RootState) => state.auth);
  const { pathname } = useLocation();

  return (
    <section className='sm:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/80 z-10 backdrop-blur-[2px]'>
      <nav>
        <ul className='flex items-center justify-between py-3 px-4'>
          <li>
            <Link to='/'>
              <div
                className='p-3 rounded-full transition duration-300'
                style={{
                  backgroundColor: pathname === "/" ? "var(--clr-essence--01)" : "#333",
                }}
              >
                <FaHome className='text-lg text-pure_soul' />
              </div>
            </Link>
          </li>

          <li>
            <div
              className='p-3 rounded-full transition duration-300'
              style={{
                backgroundColor:
                  pathname === "/profile/:id" ? "var(--clr-essence--01)" : "#333",
              }}
            >
              <FaSearch className='text-lg text-pure_soul' />
            </div>
          </li>

          <li className='cursor-pointer' onClick={() => setIsToggled((prev) => !prev)}>
            <div className='p-3 rounded-full bg-[#333]'>
              <FaPlus className='text-lg text-pure_soul' />
            </div>
          </li>

          <li>
            <div
              className='p-3 rounded-full transition duration-300'
              style={{
                backgroundColor: pathname === "/news" ? "var(--clr-essence--01)" : "#333",
              }}
            >
              <FaNewspaper className='text-lg text-pure_soul' />
            </div>
          </li>

          <li className='w-[50px] h-[50px]'>
            <Link to={`/profile/${auth?.user?.id}`}>
              <img
                src={auth?.user?.profilePicture || "/assets/profile-fallback.png"}
                className='w-[42px] h-[42px] object-cover rounded-full mt-[4px]'
              />
            </Link>
          </li>
        </ul>
      </nav>
    </section>
  );
};

export default BottomBar;
