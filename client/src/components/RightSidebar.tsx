/** @format */

import trendings from "../constants";

const RightSidebar = () => {
  return (
    <section className='hidden lg:block bg-dark_soul h-screen w-[360px] border-x-2 border-slate-900'>
      <div className='px-4 py-8'>
        <ul className='bg-[#16181c] py-4 rounded-md'>
          <li className='px-4 mb-4'>
            <h3 className='text-pure_soul font-bold text-lg'>What's happening</h3>
          </li>
          {trendings.map((trend, idx) => (
            <li
              key={idx}
              className='flex items-center justify-between py-2 px-4 bg-transparent hover:bg-neutral-950/50'
            >
              <div>
                <span className='text-slate-400 text-xs'>{trend.category}</span>
                <h4 className='text-bold text-slate-100 text-sm leading-[1.2]'>
                  {trend.hashtag}
                </h4>
                <span className='text-slate-400 text-sm leading-[1.1]'>
                  {trend.topic}
                </span>
              </div>
              {trend.image && (
                <img
                  src={trend.image}
                  className='w-[60px] h-[60px] object-cover rounded-md'
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default RightSidebar;
