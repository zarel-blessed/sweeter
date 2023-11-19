/** @format */

import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Image, handleFileSelect, updateImage } from "../../functions/image-functions";

interface Props {
  image: Image | null;
  setImage: React.Dispatch<React.SetStateAction<Image | null>>;
  user_id: string;
  endpoint: string;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarProfile: React.Dispatch<React.SetStateAction<string>> | null;
}

const ImageBox = ({
  image,
  setImage,
  user_id,
  endpoint,
  setToggle,
  setSidebarProfile,
}: Props) => {
  const QueryClient = useQueryClient();

  const updateImageMutation = useMutation({
    mutationFn: () => updateImage(image, user_id, endpoint, setSidebarProfile),
    onSuccess: () => {
      QueryClient.invalidateQueries(["user"] as InvalidateQueryFilters);
    },
  });

  return (
    <article className='fixed left-1/2 top-[48%] translate-x-[-50%] translate-y-[-50%] w-[300px] bg-dark_soul flex flex-col gap-4 items-center p-6 rounded-lg'>
      <div className='relative w-[100%] h-[250px] bg-dark_soul border-dashed border-2 border-essence02 rounded-md'>
        <input
          name='filename'
          type='file'
          id='file'
          accept='.png,.jpeg,.jpg'
          hidden
          onChange={(e) => handleFileSelect(e, setImage)}
        />
        <label
          htmlFor='file'
          className='grid place-items-center absolute inset-0 cursor-pointer'
        >
          {image?.preview ? (
            <img
              src={image?.preview}
              alt='Click here to upload image!'
              className='w-[90%] h-[230px] object-cover'
            />
          ) : (
            <img
              src='/assets/drop-image-icon.png'
              alt='Click here to upload image!'
              className='w-[100px]'
            />
          )}
        </label>
      </div>

      <button
        className='primary-button w-full px-6 disabled:bg-neutral-600 disabled:border-neutral-600 disabled:cursor-not-allowed'
        disabled={image?.data ? false : true}
        onClick={() => {
          updateImageMutation.mutate();
          setImage({ preview: "", data: null });
          setToggle(false);
        }}
      >
        Upload
      </button>
    </article>
  );
};

export default ImageBox;
