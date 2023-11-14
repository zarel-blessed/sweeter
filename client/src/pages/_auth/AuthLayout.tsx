// Import Outlet to insert our Sign-up/Log-in forms and Navigate component to redirect to Home (if authenticated)
import { Outlet, Navigate, useLocation, Link } from "react-router-dom";
// Left part of the AuthLayout component
import { AuthLayoutLeft } from "../../components";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { RootState } from "../../context/store";

const AuthLayout = () => {
    const auth = useSelector((state: RootState) => state.auth);
    const { pathname } = useLocation();

    return (
        <main className="flex">
            {auth.isAuth ? (
                <Navigate to="/" />
            ) : (
                <>
                    <AuthLayoutLeft />

                    <section className="auth-layout-right">
                        <div className="top-left-curve">
                            <img
                                src="/assets/sweeter-logo.png"
                                alt="Sweeter"
                                className="block mx-auto w-32"
                                draggable={false}
                            />
                        </div>

                        <Outlet />

                        <div className="tossy-curve">
                            <h3 className="text-pure_soul font-medium text-center uppercase text-sm">
                                <Link
                                    to={
                                        pathname === "/sign-up"
                                            ? "/log-in"
                                            : "/sign-up"
                                    }
                                >
                                    {pathname === "/sign-up"
                                        ? "Login here"
                                        : "Create account"}
                                </Link>
                            </h3>
                        </div>

                        <img
                            src="/assets/circle-graphic.svg"
                            className="hidden xl:inline-block absolute left-0 bottom-28 w-[180px] translate-x-[-50%]"
                            draggable={false}
                        />
                    </section>
                </>
            )}
        </main>
    );
};

export default AuthLayout;
