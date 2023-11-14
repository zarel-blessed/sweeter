import { useRef, useState, useEffect } from "react";
import { FaUser, FaLock, FaEnvelope, FaStar } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { eraseInput, showToast, fetcherClient } from "../../../utils";

import { SingleLineInput } from "../../../components/ui/Input";
import { PrimaryButton } from "../../../components/ui/Button";

const SignupFrom = () => {
    const USERNAME_REGEX: RegExp = /^[a-zA-Z0-9_]{2,30}$/;

    const PASSWORD_REGEX: RegExp =
        /^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    const EMAIL_REGEX: RegExp =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const nameRef = useRef<HTMLInputElement>(null);

    const [name, setName] = useState("");

    const [username, setUsername] = useState("");
    const [usernameValidated, setUsernameValidated] = useState(false);

    const [email, setEmail] = useState("");
    const [emailValidated, setEmailValidated] = useState(false);

    const [password, setPassword] = useState("");
    const [passwordValidated, setPasswordValidated] = useState(false);

    useEffect(() => {
        if (nameRef.current) nameRef.current.focus();
    }, []);

    useEffect(() => {
        const result = USERNAME_REGEX.test(username);
        setUsernameValidated(result);
    }, [username]);

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        setEmailValidated(result);
    }, [email]);

    useEffect(() => {
        const result = PASSWORD_REGEX.test(password);
        setPasswordValidated(result);
    }, [password]);

    const navigate = useNavigate();

    const handleRegister = async (e: any) => {
        e.preventDefault();

        if (!emailValidated) {
            showToast("Email address is not valid", "error");
        } else if (!usernameValidated) {
            showToast("Username must be at-least 3 character long", "error");
        } else if (!passwordValidated) {
            showToast(
                "Password must contain some alphanumeric characters and at least 1 number",
                "error"
            );
        } else {
            try {
                await fetcherClient.post(
                    "/auth/register",
                    JSON.stringify({
                        name,
                        email,
                        username,
                        password,
                    })
                );

                eraseInput(setName, setEmail, setUsername, setPassword);
                showToast("User registered successfully!", "default", 3000);
                setTimeout(() => navigate("/log-in"), 3000);
            } catch (error: any) {
                if (!error?.response) {
                    showToast("No server response!", "error");
                } else if (error.response?.status === 409) {
                    showToast("Username or email already in use!", "error");
                } else {
                    showToast("Uncaught error", "error");
                }
            }
        }
    };

    return (
        <form className="flex flex-col gap-6 items-center relative py-4 px-6 w-[95%] max-w-[400px] z-20">
            <h2 className="font-semibold uppercase text-xl text-dark_soul">
                User Signup
            </h2>
            <ToastContainer />

            <div className="flex flex-col gap-6 w-full">
                <SingleLineInput
                    type="text"
                    placeholder="Full name"
                    required={true}
                    reference={nameRef}
                    Icon={FaStar}
                    value={name}
                    changeHandler={setName}
                />
                <SingleLineInput
                    type="email"
                    placeholder="Email"
                    required={true}
                    Icon={FaEnvelope}
                    value={email}
                    changeHandler={setEmail}
                />
                <SingleLineInput
                    type="text"
                    placeholder="Username"
                    required={true}
                    Icon={FaUser}
                    value={username}
                    changeHandler={setUsername}
                />
                <SingleLineInput
                    type="password"
                    placeholder="Password"
                    required={true}
                    Icon={FaLock}
                    value={password}
                    changeHandler={setPassword}
                />
            </div>

            <PrimaryButton innerText="Sign up" submitHandler={handleRegister} />
            <ToastContainer />
        </form>
    );
};

export default SignupFrom;
