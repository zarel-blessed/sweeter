import { FaComment, FaHeart, FaRetweet, FaTrash } from "react-icons/fa";
import { Tweet } from "../../interfaces/interface";
import { useSelector } from "react-redux";
import { RootState } from "../../context/store";
import { fetcherClient, showToast } from "../../utils";
import { useState } from "react";

const TweetCard = ({
    tweet,
    deleteMutate,
}: {
    tweet: Tweet;
    deleteMutate: (tweet_id: any) => void;
}) => {
    const auth = useSelector((state: RootState) => state.auth);

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

    const [isLiked, setIsLiked] = useState(
        checkLike(tweet.likes, auth?.user?.id)
    );

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

    return (
        <article className="mb-6 p-6 border border-slate-400 rounded-lg max-w-[500px]">
            <div className="flex items-start justify-between">
                <div className="flex gap-4 mb-4">
                    <img
                        src={
                            tweet.tweetedBy.profilePicture ||
                            "/assets/profile-fallback.png"
                        }
                        className="w-[40px] h-[40px] rounded-full border-2 object-cover border-slate-400"
                    />

                    <div className="flex flex-col">
                        <span className="leading-[1] uppercase text-sm font-semibold text-slate-800">
                            {tweet.tweetedBy?.name}
                        </span>
                        <span className="text-sm text-slate-700">
                            @{tweet.tweetedBy?.username}
                        </span>
                    </div>

                    <div className="text-sm text-slate-800 font-medium">
                        12 Nov 2023
                    </div>
                </div>

                {byUser(auth?.user?.id, tweet?.tweetedBy?._id) && (
                    <FaTrash
                        className="text-gray-500 cursor-pointer"
                        onClick={() => {
                            deleteMutate(tweet?._id);
                        }}
                    />
                )}
            </div>

            <p className="text-sm font-medium text-slate-800 mb-4">
                {mentionChunks.map((chunk: string, idx: number) => (
                    <span
                        key={idx}
                        className={
                            chunk[0] === "@"
                                ? "font-semibold text-pink-600"
                                : undefined
                        }
                    >
                        {chunk}
                    </span>
                ))}
            </p>

            {tweet?.image && (
                <img
                    src={tweet?.image}
                    className="rounded-md h-[230px] object-cover my-2"
                />
            )}

            <div className="flex gap-6">
                <div className="flex items-center gap-2 group cursor-pointer">
                    <FaHeart
                        className="text-gray-500 transition duration-500 group-hover:text-red-500"
                        style={{
                            color: isLiked ? "#f33434" : "#777",
                        }}
                        onClick={() => handleLike(tweet?._id)}
                    />
                    <span className="font-medium text-slate-700 group-hover:text-red-500">
                        {likeCount}
                    </span>
                </div>

                <div className="flex items-center gap-2 group cursor-pointer">
                    <FaComment className="text-gray-500 group-hover:text-blue-500" />
                    <span className="font-medium text-slate-700 group-hover:text-blue-500">
                        {tweet.replies.length}
                    </span>
                </div>

                <div className="flex items-center gap-2 group cursor-pointer">
                    <FaRetweet className="text-gray-500 group-hover:text-green-6 00" />
                    <span className="font-medium text-slate-700 group-hover:text-green-6 00">
                        {tweet.retweetBy.length}
                    </span>
                </div>
            </div>
        </article>
    );
};

export default TweetCard;
