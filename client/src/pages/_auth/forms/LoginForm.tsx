import { useRef, useState, useEffect } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { showToast, fetcherClient, eraseInput } from "../../../utils";

import { SingleLineInput } from "../../../components/ui/Input.tsx";
import { PrimaryButton } from "../../../components/ui/Button.tsx";
import { ToastContainer } from "react-toastify";
import { AppDispatch } from "../../../context/store.ts";

import { useDispatch } from "react-redux";
import { login } from "../../../context/slices/AuthSlice.ts";

const LoginForm = () => {
    const usernameRef = useRef<HTMLInputElement>(null);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (usernameRef.current) usernameRef.current.focus();
    }, []);

    const navigate = useNavigate();

    const dispatch: AppDispatch = useDispatch();

    const handleLogin = async (e: any) => {
        e.preventDefault();

        if (username === "" || password === "") {
            return showToast("Required fields are empty!", "error");
        }

        try {
            const response = await fetcherClient.post(
                "/auth/login",
                JSON.stringify({
                    username,
                    password,
                })
            );

            const data = response.data;
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: data.user._id,
                    name: data.user.name,
                    username: data.user.username,
                    profilePicture: data.user.profilePicture || "",
                })
            );

            eraseInput(setUsername, setPassword);
            showToast("Logged in successfully!", "default", 1000);

            dispatch(
                login({
                    id: data.user._id,
                    name: data.user.name,
                    username: data.user.username,
                    profilePicture: data.user.profilePicture || "",
                })
            );

            setTimeout(() => navigate("/"), 2000);
        } catch (error: any) {
            if (!error?.response) {
                showToast("No server response!", "error");
            } else if (error.response?.status === 401) {
                showToast("Invalid username or password!", "error");
            } else {
                showToast("Uncaught error", "error");
            }
        }
    };

    return (
        <form className="flex flex-col gap-6 items-center relative py-4 px-6 w-[95%] max-w-[400px] z-20">
            <h2 className="font-semibold uppercase text-xl text-dark_soul">
                User login
            </h2>
            <div className="flex flex-col gap-6 w-full">
                <SingleLineInput
                    type="text"
                    placeholder="Username"
                    reference={usernameRef}
                    Icon={FaUser}
                    required={true}
                    value={username}
                    changeHandler={setUsername}
                />
                <SingleLineInput
                    type="password"
                    placeholder="Password"
                    Icon={FaLock}
                    required={true}
                    value={password}
                    changeHandler={setPassword}
                />
            </div>
            <div className="flex justify-between w-full">
                <div>
                    <input type="checkbox" id="remeber" className="mr-2" />
                    <label
                        htmlFor="remember"
                        className="text-sm text-slate-700 font-medium"
                    >
                        Remember me
                    </label>
                </div>
                <p className="text-essence02 text-sm">Forgot password?</p>
            </div>
            <PrimaryButton innerText="Log in" submitHandler={handleLogin} />
            <ToastContainer />
        </form>
    );
};

export default LoginForm;
