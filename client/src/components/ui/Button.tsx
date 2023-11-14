/** @format */

export const PrimaryButton = ({
  innerText,
  submitHandler,
}: {
  innerText: string;
  submitHandler: (e: any) => void;
}) => {
  return (
    <button className='primary-button' onClick={submitHandler}>
      {innerText}
    </button>
  );
};
