/** @format */

// import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
// import { AppDispatch, RootState } from "../context/store";
import { FaHome, FaNewspaper, FaPlus, FaUser } from "react-icons/fa";

const BottomBar = () => {
  // const auth = useSelector((state: RootState) => state.auth);

  // const dispatch: AppDispatch = useDispatch();
  const { pathname } = useLocation();

  return (
    <section className='sm:hidden fixed bottom-0 left-0 right-0 bg-dark_soul'>
      <nav>
        <ul className='flex items-center justify-between p-2'>
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
              <p
                className='hidden md:block uppercase text-sm'
                style={{
                  color:
                    pathname === "/" ? "var(--clr-essence--02)" : "var(--clr-pure--soul)",
                }}
              >
                Home
              </p>
            </Link>
          </li>
          <li className='w-[80%] xl:w-[70%]'>
            <Link to='/profile/:id' className='left-sidebar-page-link'>
              <div
                className='p-3 rounded-full transition duration-300'
                style={{
                  backgroundColor:
                    pathname === "/profile/:id" ? "var(--clr-essence--01)" : "#333",
                }}
              >
                <FaUser className='text-lg text-pure_soul' />
              </div>
              <p
                className='hidden md:block uppercase text-sm'
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
            className='w-[80%] xl:w-[70%] cursor-pointer left-sidebar-page-link'
            // onClick={() => setIsToggled((prev) => !prev)}
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
              <p
                className='hidden md:block uppercase text-sm'
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
    </section>
  );
};

export default BottomBar;
