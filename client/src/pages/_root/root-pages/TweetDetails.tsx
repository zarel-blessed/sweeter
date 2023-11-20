/** @format */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetcherClient } from "../../../utils";
import { ColorRing } from "react-loader-spinner";
import TweetCard from "../../../components/ui/TweetCard";
import { Tweet } from "../../../interfaces/interface";

const TweetDetails = () => {
  const { id } = useParams();
  const [tweetDetails, settweetDetails] = useState<any>(null);

  const fetchDetails = () => {
    const accessToken = localStorage.getItem("accessToken");

    const headers = {
      "Content-Type": "application/json",
      "x-auth-token": `Bearer ${accessToken}`,
    };

    fetcherClient
      .get(`/tweet/${id}`, {
        headers,
      })
      .then((response) => settweetDetails(response?.data?.tweet));
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  return (
    <main className='bg-dark_soul custom-scrollbar h-screen overflow-y-auto'>
      <div className='p-4 max-w-[540px] mx-auto min-h-screen'>
        <h2 className='font-semibold text-xl text-pure_soul'>Post</h2>
        {!tweetDetails ? (
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
          <section className='mt-4'>
            <TweetCard tweet={tweetDetails} isQuery={false} />
            <h3 className='text-xl font-semibold my-6 text-slate-400'>Replies</h3>
            <div className='flex flex-col gap-4'>
              {tweetDetails?.replies?.length ? (
                tweetDetails?.replies?.map((reply: Tweet, idx: number) => (
                  <TweetCard key={idx} tweet={reply} isQuery={false} />
                ))
              ) : (
                <div className='flex items-center flex-col'>
                  <h3 className='font-medium text-dark_soul mb-6'>
                    No replies on this tweet
                  </h3>
                  <img src='/assets/comment.png' className='w-[150px]' />
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default TweetDetails;
