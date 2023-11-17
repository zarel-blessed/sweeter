/** @format */

import { useSelector } from "react-redux";
import { RootState } from "../../../context/store";
import { FaLocationDot, FaPencil } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import { getUserData } from "../../../functions/user-functions";
import { useOutletContext, useParams } from "react-router-dom";
import { FaCalendar, FaEnvelope } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Image } from "../../../functions/image-functions";
import ImageBox from "../../../components/ui/ImageBox";
import Overlay from "../../../components/Overlay";
import TweetCard from "../../../components/ui/TweetCard";
import { Tweet } from "../../../interfaces/interface";
import useFetcherClient from "../../../hooks/useFetcherClient";
import { ColorRing } from "react-loader-spinner";

const ProfilePage = () => {
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserData(id),
  });

  const { data: tweets, isLoading, setData: setTweets } = useFetcherClient();

  const auth = useSelector((state: RootState) => state.auth);

  const [setSidebarProfile]: any = useOutletContext();

  const [profileImage, setProfileImage] = useState<Image>({ preview: "", data: null });
  const [profileImageBoxToggled, setProfileImageBoxToggled] = useState(false);

  const [bannerImage, setBannerImage] = useState<Image>({ preview: "", data: null });
  const [bannerImageBoxToggled, setBannerImageBoxToggled] = useState(false);

  const [backgroundStyle, setBackgroundStyle] = useState({
    backgroundColor: "var(--clr-dark--soul)",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundImage: "",
  });

  useEffect(() => {
    if (data?.bannerImage) {
      setBackgroundStyle({
        ...backgroundStyle,
        backgroundImage:
          data?.bannerImage && data?.bannerImage != "" ? `url(${data.bannerImage})` : "",
      });
    }
  }, [data]);

  return (
    <main className='h-[100vh] overflow-y-auto custom-scrollbar'>
      <header className='flex justify-between items-center bg-pure_soul py-4 px-6'>
        <div className='flex flex-col'>
          <span className='leading-[1] font-bold text-dark_soul'>{auth?.user?.name}</span>
          <span className='text-sm font-medium text-slate-700'>
            {data?.followers?.length} Followers
          </span>
        </div>
      </header>

      <div className='overflow-y-auto'>
        <div className='relative h-[180px]' style={backgroundStyle}>
          <img
            src={
              data?.profilePicture ? data?.profilePicture : "/assets/profile-fallback.png"
            }
            className='absolute left-[20px] top-[100px] w-[120px] h-[120px] rounded-full border-4 border-pure_soul object-cover'
          />

          {auth?.user?.id === data?._id && (
            <div
              className='grid place-items-center absolute left-[20px] top-[100px] w-[120px] h-[120px] rounded-full bg-transparent hover:bg-neutral-200/30 group cursor-pointer'
              onClick={() => setProfileImageBoxToggled((prev) => !prev)}
            >
              <FaPencil className='hidden group-hover:inline-block' />
            </div>
          )}

          {auth?.user?.id === data?._id && (
            <div
              className='absolute bottom-4 right-4 p-3 rounded-full bg-pure_soul cursor-pointer'
              onClick={() => setBannerImageBoxToggled((prev) => !prev)}
            >
              <FaPencil className='text-slate-900' />
            </div>
          )}

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

        <p className='py-2 px-6 font-medium text-dark_soul text-sm'>
          {data?.bio !== "" && data?.bio
            ? data?.bio
            : "This is a dummy bio for your profile. If you want to update this bio, click on the edit profile button and write a custom bio."}
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
      </div>

      <h3 className='px-6 pt-4 pb-2 text-xl font-semibold'>Tweets</h3>

      {isLoading ? (
        <div className='flex justify-center'>
          <ColorRing
            visible={true}
            height='80'
            width='80'
            ariaLabel='blocks-loading'
            wrapperStyle={{}}
            wrapperClass='blocks-wrapper'
            colors={["pink", "skyblue", "pink", "skyblue", "pink"]}
          />
        </div>
      ) : (
        <div className='px-6 my-6 flex flex-col w-full mx-auto gap-6'>
          {tweets
            ?.filter((tweet: Tweet) => tweet?.tweetedBy?._id == data?._id)
            ?.map((tweet: Tweet, idx: number) => (
              <TweetCard key={idx} tweet={tweet} isQuery={false} setTweets={setTweets} />
            ))}
        </div>
      )}

      {profileImageBoxToggled && <Overlay setIsToggled={setProfileImageBoxToggled} />}

      {profileImageBoxToggled && (
        <ImageBox
          image={profileImage}
          setImage={setProfileImage}
          user_id={data?._id}
          endpoint='uploadProfilePic'
          setToggle={setProfileImageBoxToggled}
          setSidebarProfile={setSidebarProfile}
        />
      )}

      {bannerImageBoxToggled && <Overlay setIsToggled={setBannerImageBoxToggled} />}

      {bannerImageBoxToggled && (
        <ImageBox
          image={bannerImage}
          setImage={setBannerImage}
          user_id={data?._id}
          endpoint='uploadBannerImage'
          setToggle={setBannerImageBoxToggled}
          setSidebarProfile={null}
        />
      )}
    </main>
  );
};

export default ProfilePage;
