/** @format */

import { FaComment, FaHeart, FaRetweet, FaTrash } from "react-icons/fa";
import { Tweet } from "../../interfaces/interface";
import { useSelector } from "react-redux";
import { RootState } from "../../context/store";
import { fetcherClient, showToast } from "../../utils";
import { useState } from "react";
import { deleteTweet } from "../../functions/tweet-functions";
import { Link, useNavigate } from "react-router-dom";
import CommentBox from "./CommentBox";
import Overlay from "../Overlay";
import formatDate from "../../utils/formatDate";

const TweetCard = ({
  tweet,
  deleteMutate,
  isQuery,
  setTweets,
}: {
  tweet: Tweet;
  deleteMutate?: (tweet_id: any) => void;
  isQuery: boolean;
  setTweets?: React.Dispatch<React.SetStateAction<Tweet[]>>;
}) => {
  const auth = useSelector((state: RootState) => state.auth);
  const [isCommentBoxToggled, setIsCommentBoxToggled] = useState(false);

  const checkLike = (array: any, key: any): boolean => {
    for (let item of array) {
      if (item._id == key) return true;
    }
    return false;
  };

  const byUser = (userId: any, tweetedBy: any): boolean => {
    if (userId == tweetedBy) return true;
    return false;
  };

  const [isLiked, setIsLiked] = useState(checkLike(tweet.likes, auth?.user?.id));

  const [likeCount, setLikeCount] = useState(tweet.likes?.length);

  const tweetContent = tweet?.content || "";
  const mentionChunks = tweetContent.split(/(@\S+)|(\s)/).filter(Boolean);

  const handleLike = async (_id: Tweet) => {
    const accessToken = localStorage.getItem("accessToken");

    const headers = {
      "Content-Type": "application/json",
      "x-auth-token": `Bearer ${accessToken}`,
    };

    try {
      if (!isLiked) {
        setIsLiked((prev) => !prev);
        setLikeCount((prev) => ++prev);
      }

      await fetcherClient.post(`/tweet/${_id}/like`, {}, { headers });
      showToast("Liked the tweet!", "default", 2000);
    } catch (error) {
      if (isLiked) {
        setIsLiked((prev) => !prev);
        setLikeCount((prev) => --prev);
      }

      await fetcherClient.post(`/tweet/${_id}/dislike`, {}, { headers });
    }
  };

  const navigate = useNavigate();

  return (
    <article
      className='p-6 border border-slate-400 rounded-lg'
      onClick={() => navigate(`/tweet/${tweet._id}`)}
    >
      <div className='flex items-start justify-between'>
        <div className='flex gap-4 mb-4'>
          <Link to={`/profile/${tweet.tweetedBy._id}`} className='flex gap-4'>
            <img
              src={tweet.tweetedBy.profilePicture || "/assets/profile-fallback.png"}
              className='w-[40px] h-[40px] rounded-full border-2 object-cover border-slate-400'
            />

            <div className='flex flex-col'>
              <span className='leading-[1] uppercase text-xs sm:text-sm font-semibold text-slate-800'>
                {tweet.tweetedBy?.name}
              </span>
              <span className='text-sm text-slate-700'>@{tweet.tweetedBy?.username}</span>
            </div>
          </Link>

          <div className='text-xs sm:text-sm text-slate-800 font-medium'>
            {formatDate(tweet?.createdAt)}
          </div>
        </div>

        {byUser(auth?.user?.id, tweet?.tweetedBy?._id) && (
          <FaTrash
            className='text-gray-500 cursor-pointer'
            onClick={() => {
              if (isQuery && deleteMutate) deleteMutate(tweet?._id);
              if (!isQuery) deleteTweet(tweet?._id, setTweets);
            }}
          />
        )}
      </div>

      <p className='text-sm font-medium text-slate-800 mb-4'>
        {mentionChunks.map((chunk: string, idx: number) => (
          <span
            key={idx}
            className={chunk[0] === "@" ? "font-semibold text-pink-600" : undefined}
          >
            {chunk}
          </span>
        ))}
      </p>

      {tweet?.image && (
        <img
          src={tweet?.image}
          className='rounded-md max-h-[350px] sm:w-auto object-cover my-2'
        />
      )}

      <div className='flex gap-6'>
        <div className='flex items-center gap-2 group cursor-pointer'>
          <FaHeart
            className='text-gray-500 transition duration-500 group-hover:sm:text-red-500'
            style={{
              color: isLiked ? "#f33434" : "#777",
            }}
            onClick={() => handleLike(tweet?._id)}
          />
          <span className='font-medium text-slate-700 group-hover:sm:text-red-500'>
            {likeCount}
          </span>
        </div>

        <div
          className='flex items-center gap-2 group cursor-pointer'
          onClick={() => setIsCommentBoxToggled((prev) => !prev)}
        >
          <FaComment className='text-gray-500 group-hover:sm:text-blue-500' />
          <span className='font-medium text-slate-700 group-hover:sm:text-blue-500'>
            {tweet.replies.length}
          </span>
        </div>

        <div className='flex items-center gap-2 group cursor-pointer'>
          <FaRetweet className='text-gray-500 group-hover:sm:text-green-600' />
          <span className='font-medium text-slate-700 group-hover:sm:text-green-600'>
            {tweet.retweetBy.length}
          </span>
        </div>
      </div>

      {isCommentBoxToggled && <Overlay setIsToggled={setIsCommentBoxToggled} />}

      {isCommentBoxToggled && (
        <CommentBox id={tweet._id} setIsToggled={setIsCommentBoxToggled} />
      )}
    </article>
  );
};

export default TweetCard;
