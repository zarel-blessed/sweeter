/** @format */

const AuthLayoutLeft = () => (
  <section className='hidden md:block relative w-[50%] h-screen bg-dark_soul py-12'>
    <img
      src='/assets/auth-page-banner.png'
      alt='Deep dive into the social meal'
      className='block mx-auto w-[90%] max-w-[500px]'
      draggable={false}
    />

    <p className='absolute left-7 bottom-14 max-w-[55ch] text-pure_soul text-sm'>
      Welcome to the world of creativity and connectivity! connect with the best peers all
      over the world
    </p>
  </section>
);

export default AuthLayoutLeft;
