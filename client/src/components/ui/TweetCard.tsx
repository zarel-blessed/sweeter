/** @format */

import { FaComment, FaHeart, FaRetweet, FaTrash } from "react-icons/fa";
import { Tweet } from "../../interfaces/interface";
import { useSelector } from "react-redux";
import { RootState } from "../../context/store";
import { fetcherClient, showToast } from "../../utils";
import { useState, useEffect } from "react";
import { deleteTweet, retweetTweet } from "../../functions/tweet-functions";
import { Link, useNavigate } from "react-router-dom";
import CommentBox from "../poppup-box/CommentBox";
import Overlay from "../Overlay";
import formatDate from "../../utils/formatDate";
import { ToastContainer } from "react-toastify";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

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
  const QueryClient = useQueryClient();

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

  const retweetTweetMutation = useMutation({
    mutationFn: () => retweetTweet(tweet?._id),
    onSuccess: () => QueryClient.invalidateQueries(["tweets"] as InvalidateQueryFilters),
  });

  useEffect(() => {
    setIsLiked(checkLike(tweet.likes, auth?.user?.id));
    setLikeCount(tweet.likes?.length);
  }, [tweet]);

  const navigate = useNavigate();

  return (
    <article
      className='p-6 border border-zinc-900 rounded-lg bg-zinc-950/10 hover:bg-zinc-900/[0.45] transition'
      onClick={() => {
        navigate(`/tweet/${tweet._id}`);
      }}
    >
      {tweet.retweetBy.length > 0 && (
        <div className='flex gap-4 items-center font-medium text-sm text-slate-600 pl-14 mb-2'>
          <FaRetweet />
          <span>
            Retweeted by {tweet.retweetBy[0].username}{" "}
            {tweet.retweetBy.length > 1 && `and ${tweet.retweetBy.length - 1} `}
            {tweet.retweetBy.length - 1 === 1 ? "other" : "others"}
          </span>
        </div>
      )}

      <div className='flex items-start justify-between'>
        <div className='flex gap-4 mb-4'>
          <Link
            to={`/profile/${tweet.tweetedBy._id}`}
            className='flex gap-4'
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <img
              src={tweet.tweetedBy.profilePicture || "/assets/profile-fallback.png"}
              className='w-[40px] h-[40px] rounded-full border-2 object-cover border-slate-400'
            />

            <div className='flex flex-col'>
              <span className='leading-[1] uppercase text-xs sm:text-sm font-semibold text-slate-400'>
                {tweet.tweetedBy?.name}
              </span>
              <span className='text-sm text-slate-300'>@{tweet.tweetedBy?.username}</span>
            </div>
          </Link>

          <div className='text-xs sm:text-sm text-slate-400 font-medium'>
            {formatDate(tweet?.createdAt)}
          </div>
        </div>

        {byUser(auth?.user?.id, tweet?.tweetedBy?._id) && (
          <FaTrash
            className='text-gray-500 cursor-pointer'
            onClick={(event: React.MouseEvent) => {
              if (isQuery && deleteMutate) deleteMutate(tweet?._id);
              if (!isQuery) {
                deleteTweet(tweet?._id, setTweets);
                if (!setTweets) navigate("/");
              }
              event?.stopPropagation();
            }}
          />
        )}
      </div>

      <p className='text-sm font-medium text-slate-400 mb-4'>
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
        <div
          className='flex items-center gap-2 group cursor-pointer'
          onClick={(event: React.MouseEvent) => {
            handleLike(tweet?._id);
            event.stopPropagation();
          }}
        >
          <FaHeart
            className='text-gray-500 transition duration-500 group-hover:sm:text-red-500'
            style={{
              color: isLiked ? "#f33434" : "#777",
            }}
          />
          <span className='font-medium text-slate-300 group-hover:sm:text-red-500'>
            {likeCount}
          </span>
        </div>

        <div
          className='flex items-center gap-2 group cursor-pointer'
          onClick={(event: React.MouseEvent) => {
            setIsCommentBoxToggled((prev) => !prev);
            event.stopPropagation();
          }}
        >
          <FaComment className='text-gray-500 group-hover:sm:text-blue-500' />
          <span className='font-medium text-slate-300 group-hover:sm:text-blue-500'>
            {tweet.replies.length}
          </span>
        </div>

        <div
          className='flex items-center gap-2 group cursor-pointer'
          onClick={(event) => {
            retweetTweetMutation.mutate();
            event?.stopPropagation();
          }}
        >
          <FaRetweet className='text-gray-500 group-hover:sm:text-green-600' />
          <span className='font-medium text-slate-300 group-hover:sm:text-green-600'>
            {tweet.retweetBy.length}
          </span>
        </div>
      </div>

      {isCommentBoxToggled && <Overlay setIsToggled={setIsCommentBoxToggled} />}

      {isCommentBoxToggled && (
        <CommentBox id={tweet._id} setIsToggled={setIsCommentBoxToggled} />
      )}

      <ToastContainer />
    </article>
  );
};

export default TweetCard;
