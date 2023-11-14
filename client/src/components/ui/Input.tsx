/** @format */

import { LegacyRef, Dispatch } from "react";
import { IconType } from "react-icons/lib/esm/iconBase";

export const SingleLineInput = ({
  type,
  placeholder,
  required,
  reference,
  Icon,
  value,
  changeHandler,
}: {
  type: string;
  placeholder: string;
  required?: boolean;
  reference?: LegacyRef<HTMLInputElement> | undefined;
  Icon: IconType;
  value: string;
  changeHandler: Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className='input-container'>
      <Icon className='text-essence02' />
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        ref={reference}
        className='input-field'
        value={value}
        onChange={(e) => changeHandler(e.target.value)}
      />
    </div>
  );
};

export const MultiLineInput = ({
  placeholder,
  required,
  value,
  changeHandler,
}: {
  placeholder: string;
  required?: boolean;
  value: string;
  changeHandler: Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className='max-w-[400px] w-[100vw]'>
      <textarea
        placeholder={placeholder}
        required={required}
        className='multiline-input'
        value={value}
        onChange={(e) => changeHandler(e.target.value)}
      />
    </div>
  );
};
