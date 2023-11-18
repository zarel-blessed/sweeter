/** @format */

import {
  InvalidateQueryFilters,
  useQueryClient,
  useMutation,
} from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import TweetCard from "../../../components/ui/TweetCard";
import { ColorRing } from "react-loader-spinner";
import { deleteTweet, fetchAllTweets } from "../../../functions/tweet-functions";
import { showToast } from "../../../utils";
import { useQuery } from "@tanstack/react-query";
import { Tweet } from "../../../interfaces/interface";

interface Data {
  tweets?: Tweet[];
}

const Home = () => {
  const QueryClient = useQueryClient();

  const { data, isError, isLoading, refetch } = useQuery<Data, Error>({
    queryKey: ["tweets"],
    queryFn: fetchAllTweets,
  });

  const deleteTweetMutation = useMutation({
    mutationFn: deleteTweet,
    onSuccess: () => {
      QueryClient.invalidateQueries(["tweets"] as InvalidateQueryFilters);
    },
  });

  const deleteMutate = async (tweet_id: any) => {
    try {
      await deleteTweetMutation?.mutateAsync(tweet_id);
      showToast("Tweet deleted successfully!");
      refetch();
    } catch (error: any) {
      console.log(error);
    }
  };

  if (isError) {
    return (
      <>
        <div>Error</div>
        <ToastContainer />
      </>
    );
  }

  return (
    <main className='flex justify-center mt-24 px-6 overflow-y-auto h-[78%] sm:h-[86%] custom-scrollbar mb-12'>
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
        <div className='flex flex-col gap-6 max-w-[500px]'>
          {data?.tweets
            ?.filter((tweet) => tweet?.parentId == null || tweet?.parentId == undefined)
            ?.map((tweet: any, idx: number) =>
              isLoading ? (
                <p>Loading...</p>
              ) : (
                <TweetCard
                  key={idx}
                  tweet={tweet}
                  deleteMutate={deleteMutate}
                  isQuery={true}
                />
              )
            )}
        </div>
      )}

      <ToastContainer />
    </main>
  );
};

export default Home;
