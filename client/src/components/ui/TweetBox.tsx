/** @format */

import { useState } from "react";
import { MultiLineInput } from "./Input";
import { useSelector } from "react-redux";
import { RootState } from "../../context/store";
import { FaImage, FaPoll, FaSmile } from "react-icons/fa";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createTweet } from "../../functions/tweet-functions";

export interface Image {
  preview: any;
  data: any;
}

const TweetBox = ({
  setIsToggled,
}: {
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const auth = useSelector((state: RootState) => state.auth);
  const QueryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [image, setImage] = useState<Image>({ preview: "", data: "" });

  const createTweetMutation = useMutation({
    mutationFn: createTweet,
    onSuccess: () => {
      QueryClient.invalidateQueries(["tweets"] as InvalidateQueryFilters);
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length) {
      const img = {
        preview: URL.createObjectURL(event.target.files[0]),
        data: event.target.files[0],
      };

      setImage(img);
    }
  };

  return (
    <article className='absolute left-1/2 top-[48%] translate-x-[-50%] translate-y-[-50%] bg-dark_soul p-6 rounded-lg'>
      <div className='flex gap-4'>
        <img
          src={auth?.user?.profilePicture || "/assets/profile-fallback.png"}
          className='w-[40px] h-[40px] rounded-full object-cover'
        />
        <MultiLineInput
          placeholder="What's happening?"
          value={content}
          changeHandler={setContent}
        />
      </div>
      {image.preview && (
        <img
          src={image.preview}
          className='ml-14 my-2 h-[200px] object-cover rounded-md'
        />
      )}
      <div className='flex justify-between items-center mt-6'>
        <div className='flex gap-4'>
          <input
            id='file'
            name='filename'
            hidden
            type='file'
            accept='.png,.jpg,.gif,.jpeg'
            onChange={handleFileSelect}
          />
          <label htmlFor='file'>
            <FaImage className='text-slate-700 cursor-pointer' />
          </label>
          <FaPoll className='text-slate-700' />
          <FaSmile className='text-slate-700' />
        </div>
        <button
          className='primary-button px-8'
          onClick={() => {
            createTweetMutation.mutate({ content, image });
            setContent("");
            setIsToggled((prev) => !prev);
          }}
        >
          Tweet
        </button>
      </div>
    </article>
  );
};

export default TweetBox;
