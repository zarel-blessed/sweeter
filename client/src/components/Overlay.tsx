/** @format */

const Overlay = ({
  setIsToggled,
}: {
  setIsToggled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div
      className='fixed inset-0 bg-black/50'
      onClick={() => setIsToggled((prev) => !prev)}
    ></div>
  );
};

export default Overlay;
