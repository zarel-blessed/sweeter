/** @format */

const Overlay = ({
  setIsToggled,
}: {
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div
      className='fixed inset-0 bg-black/50'
      onClick={(event) => {
        setIsToggled((prev) => !prev);
        event?.stopPropagation();
      }}
    ></div>
  );
};

export default Overlay;
