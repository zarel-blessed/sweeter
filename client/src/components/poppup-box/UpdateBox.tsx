/** @format */

import { FaCalendar, FaStar } from "react-icons/fa";
import { MultiLineInput, SingleLineInput } from "../ui/Input";
import { useSelector } from "react-redux";
import { RootState } from "../../context/store";
import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import {
  useMutation,
  useQueryClient,
  InvalidateQueryFilters,
} from "@tanstack/react-query";
import { updateUser } from "../../functions/user-functions";

const UpdateBox = ({
  setToggle,
}: {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const QueryClient = useQueryClient();

  const [name, setName] = useState(user?.name || "");
  const [DOB, setDOB] = useState<Date | string>("2000-01-01");
  const [location, setLocation] = useState(user?.location || "");
  const [bio, setBio] = useState(user?.bio || "");

  const updateUserMutation = useMutation({
    mutationFn: () => updateUser(user?.id, name, DOB, location, bio),
    onSuccess: () => QueryClient.invalidateQueries(["user"] as InvalidateQueryFilters),
  });

  return (
    <article className='fixed left-1/2 top-[45%] translate-x-[-50%] translate-y-[-50%] w-[400px] p-4 bg-dark_soul rounded-md'>
      <div className='flex flex-col gap-6 items-center'>
        <SingleLineInput
          type='text'
          placeholder='Name'
          required={true}
          Icon={FaStar}
          value={name}
          changeHandler={setName}
          dark={true}
        />

        <SingleLineInput
          type='date'
          placeholder='Date of birth'
          required={true}
          Icon={FaCalendar}
          value={DOB}
          changeHandler={setDOB}
          dark={true}
        />

        <SingleLineInput
          type='location'
          placeholder='Location'
          required={false}
          Icon={FaLocationDot}
          value={location}
          changeHandler={setLocation}
          dark={true}
        />

        <MultiLineInput
          placeholder={user?.bio || "Write Bio here..."}
          required={false}
          value={bio}
          changeHandler={setBio}
        />

        <button
          className='primary-button'
          onClick={() => {
            updateUserMutation.mutate();
            setToggle(false);
          }}
        >
          Update user
        </button>
      </div>
    </article>
  );
};

export default UpdateBox;
