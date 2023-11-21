/** @format */

import { useState } from "react";
import { MultiLineInput } from "../ui/Input";
import { useSelector } from "react-redux";
import { RootState } from "../../context/store";
import { InvalidateQueryFilters, useQueryClient } from "@tanstack/react-query";
import { replyTweet } from "../../functions/tweet-functions";
import { Tweet } from "../../interfaces/interface";

const CommentBox = ({
  id,
  setIsToggled,
}: {
  id: Tweet;
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const auth = useSelector((state: RootState) => state.auth);
  const QueryClient = useQueryClient();

  const [content, setContent] = useState("");

  const handleReply = async (content: string, id: Tweet) => {
    await replyTweet(content, id);
    QueryClient.invalidateQueries(["tweets"] as InvalidateQueryFilters);
  };

  return (
    <article
      className='fixed left-1/2 top-[48%] translate-x-[-50%] translate-y-[-50%] bg-dark_soul p-6 rounded-lg w-[300px] sm:w-[450px]'
      onClick={(e) => e.stopPropagation()}
    >
      <div className='flex gap-4'>
        <img
          src={auth?.user?.profilePicture || "/assets/profile-fallback.png"}
          className='hidden sm:inline-block w-[40px] h-[40px] rounded-full object-cover'
        />
        <MultiLineInput
          placeholder="What's happening?"
          value={content}
          changeHandler={setContent}
        />
      </div>

      <div className='sm:pl-12'>
        <button
          className='primary-button mt-4 w-full'
          onClick={() => {
            handleReply(content, id);
            setContent("");
            setIsToggled((prev) => !prev);
          }}
        >
          Reply
        </button>
      </div>
    </article>
  );
};

export default CommentBox;
