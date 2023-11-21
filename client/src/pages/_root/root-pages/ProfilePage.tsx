/** @format */

import { useDispatch, useSelector } from "react-redux";
import { FaLocationDot, FaPencil } from "react-icons/fa6";
import {
  useQueryClient,
  useMutation,
  useQuery,
  InvalidateQueryFilters,
} from "@tanstack/react-query";
import { useOutletContext, useParams } from "react-router-dom";
import { FaBaby, FaCalendar, FaEnvelope } from "react-icons/fa";
import { useState, useEffect } from "react";
/* ----------------------------------------------------------------------------- */
import { followUnfollow, getUserData } from "../../../functions/user-functions";
import { RootState } from "../../../context/store";
import { Image } from "../../../functions/image-functions";
import ImageBox from "../../../components/poppup-box/ImageBox";
import Overlay from "../../../components/Overlay";
import TweetCard from "../../../components/ui/TweetCard";
import { Tweet } from "../../../interfaces/interface";
import useFetcherClient from "../../../hooks/useFetcherClient";
import { ColorRing } from "react-loader-spinner";
import UpdateBox from "../../../components/poppup-box/UpdateBox";
import formatDate from "../../../utils/formatDate";
import { login } from "../../../context/slices/AuthSlice";

const ProfilePage = () => {
  const { id } = useParams();
  const QueryClient = useQueryClient(); // QueryClient will invalidate all the stale data
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  // Initializing the states
  const [bannerImageBoxToggled, setBannerImageBoxToggled] = useState(false);
  const [updateBoxToggled, setUpdateBoxToggled] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [bannerImage, setBannerImage] = useState<Image | null>({
    preview: "",
    data: null,
  });
  const [profileImage, setProfileImage] = useState<Image | null>({
    preview: "",
    data: null,
  });
  const [profileImageBoxToggled, setProfileImageBoxToggled] = useState(false);
  const [backgroundStyle, setBackgroundStyle] = useState({
    backgroundColor: "var(--clr-dark--soul)",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundImage: "",
  });

  // Fetching the data using the getUserData() function
  const { data } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserData(id),
  });

  // Fetching the tweets using the useFetcherClient() custom hook
  const { data: tweets, isLoading, setData: setTweets } = useFetcherClient(id);
  const [setSidebarProfile]: any = useOutletContext();

  // Updating banner image on each render
  useEffect(() => {
    if (data?.user?.bannerImage) {
      setBackgroundStyle((prevStyle) => ({
        ...prevStyle,
        backgroundImage: `url(${data?.user?.bannerImage})`,
      }));
    } else {
      setBackgroundStyle((prevStyle) => ({
        ...prevStyle,
        backgroundImage: "",
      }));
    }
  }, [data?.user?.bannerImage]);

  // Create a mutation to update the follow/unfollow data
  const updateFollowingMutate = useMutation({
    mutationFn: () =>
      followUnfollow(
        auth?.user?.id,
        data?.user?._id,
        data?.isFollowing,
        setDisabled,
        data?.user?.username
      ),
    // Invalidating on success
    onSuccess: () => QueryClient.invalidateQueries(["user"] as InvalidateQueryFilters),
  });

  // A dummy bio for new profiles
  const dummyText =
    "This is a dummy bio for your profile. If you want to update this bio, click on the edit profile button and write a custom bio.";

  return (
    <main className='h-[100vh] overflow-y-auto custom-scrollbar max-w-[580px] mx-auto py-[70px] sm:py-0'>
      <header className='flex justify-between items-center py-4 px-6'>
        <div className='flex flex-col'>
          <span className='leading-[1] font-bold text-slate-300'>{data?.user?.name}</span>
          <span className='text-sm font-medium text-slate-400'>
            {
              tweets?.filter(
                (tweet: Tweet) =>
                  tweet?.tweetedBy?._id == data?.user?._id && !tweet?.parentId
              ).length
            }{" "}
            posts
          </span>
        </div>
      </header>

      <div className='overflow-y-auto'>
        <div className='relative h-[180px]' style={backgroundStyle}>
          <img
            src={
              data?.user?.profilePicture
                ? data?.user?.profilePicture
                : "/assets/profile-fallback.png"
            }
            className='absolute left-[20px] top-[100px] w-[120px] h-[120px] rounded-full border-4 border-dark_soul object-cover'
          />

          {auth?.user?.id === data?.user?._id && (
            <div
              className='grid place-items-center absolute left-[20px] top-[100px] w-[120px] h-[120px] rounded-full bg-transparent hover:bg-neutral-900/70 group cursor-pointer'
              onClick={() => setProfileImageBoxToggled((prev) => !prev)}
            >
              <FaPencil className='hidden text-slate-200 group-hover:inline-block' />
            </div>
          )}

          {auth?.user?.id === data?.user?._id && (
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

            {auth?.user?.id === data?.user?._id && (
              <button
                className='primary-button px-6'
                onClick={() => setUpdateBoxToggled((prev) => !prev)}
              >
                Edit details
              </button>
            )}

            {data && auth?.user?.id !== data?.user?._id && (
              <button
                className='primary-button px-6 disabled:bg-slate-600 disabled:border-slate-600'
                disabled={disabled}
                onClick={() => {
                  updateFollowingMutate.mutate();
                  dispatch(login(JSON.parse(localStorage.getItem("user") || "{}")));
                }}
              >
                {data?.isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>

        <div className='flex flex-col mt-8 py-4 px-6'>
          <span className='leading-[1.1] font-bold text-pure_soul'>
            {data?.user?.name}
          </span>
          <span className='text-sm font-medium text-slate-500'>
            @{data?.user?.username}
          </span>
        </div>

        <p className='py-2 px-6 font-medium text-slate-200 text-sm'>
          {data?.user?.bio !== "" && data?.user?.bio ? data?.user?.bio : dummyText}
        </p>

        {data?.user?.dateOfBirth && (
          <div className='flex gap-2 items-center py-2 px-6'>
            <FaBaby className='text-slate-500' />
            <span className='text-slate-500 text-sm'>
              {formatDate(data?.user?.dateOfBirth)}
            </span>
          </div>
        )}

        <div className='flex gap-8 py-2 px-6'>
          {data?.user?.location && (
            <div className='flex gap-2 items-center'>
              <FaLocationDot className='text-slate-500' />
              <span className='text-slate-500 text-sm'>{data?.user?.location}</span>
            </div>
          )}

          <div className='flex gap-2 items-center'>
            <FaCalendar className='text-slate-500' />
            <span className='text-slate-500 text-sm'>
              Joined {data?.user?.createdAt.slice(8, 10)}{" "}
              {data?.user?.createdAt.slice(0, 4)}
            </span>
          </div>
        </div>

        <div className='flex gap-8 py-4 px-6'>
          <span>
            <span className='font-bold text-pure_soul'>
              {data?.user?.following?.length}
            </span>{" "}
            <span className='text-slate-400 font-medium'>following</span>
          </span>

          <span>
            <span className='font-bold text-pure_soul'>
              {data?.user?.followers?.length}
            </span>{" "}
            <span className='text-slate-400 font-medium'>followers</span>
          </span>
        </div>
      </div>

      <h3 className='px-6 pt-4 pb-2 text-xl font-semibold text-slate-300'>Tweets</h3>

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
            ?.filter((tweet: Tweet) => !tweet.parentId)
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
          user_id={data?.user?._id}
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
          user_id={data?.user?._id}
          endpoint='uploadBannerImage'
          setToggle={setBannerImageBoxToggled}
          setSidebarProfile={null}
        />
      )}

      {updateBoxToggled && <Overlay setIsToggled={setUpdateBoxToggled} />}

      {updateBoxToggled && <UpdateBox setToggle={setUpdateBoxToggled} />}
    </main>
  );
};

export default ProfilePage;
