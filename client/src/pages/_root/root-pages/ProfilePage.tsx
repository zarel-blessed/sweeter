/** @format */

import { useSelector } from "react-redux";
import { RootState } from "../../../context/store";
import { FaArrowLeft, FaLocationDot, FaPencil } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../../../functions/user-functions";
import { useParams } from "react-router-dom";
import { FaCalendar, FaEnvelope } from "react-icons/fa";

const ProfilePage = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserData(id),
  });

  return (
    <main>
      <header className='flex justify-between items-center bg-pure_soul py-4 px-6'>
        <div className='flex gap-6'>
          <FaArrowLeft />
          <div className='flex flex-col'>
            <span className='leading-[1] font-bold text-dark_soul'>
              {auth?.user?.name}
            </span>
            <span className='text-sm font-medium text-slate-700'>
              {data?.followers?.length} Followers
            </span>
          </div>
        </div>
      </header>

      <div className='relative h-[180px] bg-neutral-900'>
        <img
          src={data?.profilePicture}
          className='absolute left-[20px] top-[100px] w-[120px] h-[120px] rounded-full border-4 border-pure_soul'
        />
        <div className='absolute bottom-4 right-4 p-3 rounded-full bg-pure_soul'>
          <FaPencil className='text-slate-900' />
        </div>
        <div className='absolute flex gap-4 top-[108%] right-4'>
          <div className='grid place-items-center border-2 border-essence02 w-[40px] h-[40px] rounded-full'>
            <FaEnvelope className='text-essence02' />
          </div>
          <button className='primary-button px-6'>Edit details</button>
        </div>
      </div>

      <div className='flex flex-col mt-8 py-4 px-6'>
        <span className='leading-[1.1] font-bold text-dark_soul'>{data?.name}</span>
        <span className='text-sm font-medium text-slate-700'>{data?.username}</span>
      </div>

      <p className='py-4 px-6 font-medium text-dark_soul'>
        {data?.bio !== "" && data?.bio
          ? data?.bio
          : "This is a dummy bio for your profile. If you want to update this bio,  click on the edit profile button and write a custom bio."}
      </p>

      <div className='flex gap-8 py-2 px-6'>
        {data?.location && (
          <div className='flex gap-2 items-center'>
            <FaLocationDot className='text-slate-700' />
            <span className='font-medium text-slate-700 text-sm'>{data?.location}</span>
          </div>
        )}
        <div className='flex gap-2 items-center'>
          <FaCalendar className='text-slate-700' />
          <span className='font-medium text-slate-700 text-sm'>
            Joined {data?.createdAt.slice(8, 10)} {data?.createdAt.slice(0, 4)}
          </span>
        </div>
      </div>

      <div className='flex gap-8 py-4 px-6'>
        <span>
          <span className='font-bold text-dark_soul'>{data?.following?.length}</span>{" "}
          <span className='text-slate-800 font-medium'>following</span>
        </span>
        <span>
          <span className='font-bold text-dark_soul'>{data?.followers?.length}</span>{" "}
          <span className='text-slate-800 font-medium'>followers</span>
        </span>
      </div>
    </main>
  );
};

export default ProfilePage;
