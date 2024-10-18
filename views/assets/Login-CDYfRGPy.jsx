import React, { useEffect, useState } from "react";
import { backend_url } from "../../../Helper";
import { Notyf } from "notyf";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Helmet, HelmetProvider } from "react-helmet-async";

import axios from "axios";
// import '../../../public/css/all.css'
// import '../../../public/css/fencybox.css'
// import '../../../public/css/swiper.css'

export const Login = () => {
  const notyf = new Notyf();
  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  const [email, setEmail] = useState();
  const handleForgetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const respones = await axios.post(`${backend_url}/auth/send-reset-code`, {
        email: e.target.email.value,
      });
    } catch (error) {
      console.log("Error");
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const login_credentials = {
        email: e.target.email.value,
        password: e.target.password.value,
      };
      const response = await axios.post(
        `${backend_url}/auth/login`,
        login_credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response: ", response);
      if (response.status === 200) {
        localStorage.setItem("forcastToken", response.data.access_token);
        localStorage.setItem("user_email", response.data.email);
        localStorage.setItem("user_name", response.data.user_name);
        notyf.success("Login successful");
        navigate("/dashboard");
      } else {
        notyf.error(response.data.message || "An error occurred");
      }
    } catch (error) {
      console.error("Login error: ", error);
      if (error) {
        console.log("Error: ", error);
        notyf.error(error.response.data.detail);
        if (e.target.email.value == "401: Email not verified") {
          navigate(`/verify-email?email=${btoa(e.target.email.value)}`);
        }
        console.log("e.target.email.value: ", e.target.email.value);
      } else if (error.request) {
        notyf.error("No response from the server. Please try again.");
      } else {
        notyf.error("An error occurred during the login process.");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("forcastToken")) {
      navigate("/dashboard");
    }
  });
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <link rel="stylesheet" href="css/theme.css" />
        </Helmet>
      </HelmetProvider>
      <section className="mb-150 max-md:mb-25 relative ">
        <div className=" px-10 header-section w-full">
          <a href="/">
            <img src="img/logos/Gif 1.gif" width={100} alt="" />
          </a>
        </div>
        <div className="absolute left-1/2 top-25 w-full h-[550px] -translate-x-1/2 bg-cover   bg-no-repeat bg-center opacity-70 md:hidden -z-10" />
        <div
          className="container relative"
          data-aos="fade-up"
          data-aos-offset={200}
          data-aos-duration={1000}
          data-aos-once="true"
        >
          <div className="mb-12 font-bold text-center max-w-[475px] mx-auto text-4xl">
            Login to your <br />
            account
          </div>
          <div className="relative z-10 max-w-[510px] mx-auto">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex max-md:flex-col -z-10 max-md:hidden">
              <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/30 blur-[145px]" />
              <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/50 -ml-[170px] max-md:ml-0 blur-[145px]" />
              <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/30 -ml-[170px] max-md:ml-0 blur-[145px]" />
            </div>
            <div className="bg-white  rounded-medium p-2.5 shadow-nav">
              <div className="bg-white  border border-dashed rounded border-gray-100  p-12 max-md:px-5 max-md:py-7">
                <form onSubmit={(e) => handleLogin(e)}>
                  <div className="grid grid-cols-12 gap-y-6 ">
                    <div className="col-span-12">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium font-jakarta_sans text-paragraph  mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        name="email"
                        id="email"
                        placeholder="Email address"
                        className="block w-full text-sm rounded-[48px] border border-borderColour  py-3.5 px-5 text-paragraph-light placeholder:text-paragraph-light :text-paragraph-light outline-none bg-white  focus:border-primary :border-primary duration-300 transition-all"
                      />
                    </div>
                    <div className="col-span-full">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium font-jakarta_sans text-paragraph  mb-2"
                      >
                        Password
                      </label>
                      <input
                        required
                        type="password"
                        name="password"
                        id="password"
                        placeholder="At least 8 character"
                        className="block w-full text-sm rounded-[48px] border border-borderColour  py-3.5 px-5 text-paragraph-light   placeholder:text-paragraph-light outline-none bg-white  focus:border-primary :border-primary duration-300 transition-all"
                      />
                    </div>
                    <div className="col-span-full flex items-center justify-between">
                      {/* <label
                    htmlFor="remember-me"
                    className="flex items-center gap-x-3"
                  >
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="sr-only peer"
                    />
                    <div className=" w-5 h-5 rounded-full border border-borderColour  relative after:absolute after:w-2.5 after:h-2.5 after:bg-primary after:rounded-full after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:opacity-0 peer-checked:after:opacity-100 peer-checked:border-primary :border-primary cursor-pointer" />
                    <span className="block text-sm font-medium text-paragraph  font-jakarta_sans">
                      Remember me
                    </span>
                  </label> */}
                      <Link
                        to="/password-reset"
                        className="relative font-jakarta_sans inline-block overflow-hidden text-sm font-medium text-paragraph  before:absolute before:bottom-0 before:left-0 before:h-[1px] before:w-full before:origin-right before:scale-x-0 before:bg-paragraph :bg-white  before:transition-transform before:duration-500 before:content-[''] before:hover:origin-left before:hover:scale-x-100 leading-[24px] align-bottom"
                      >
                        Forget Password
                      </Link>
                    </div>
                    <div className="col-span-full ">
                      <button
                        disabled={loading}
                        type="submit"
                        className="btn w-full block font-medium"
                      >
                        Login
                      </button>
                    </div>
                    <div className="col-span-full ">
                      <p className="text-sm font-medium  text-center font-jakarta_sans leading-[24px]">
                        Not registered yet?
                        <div
                          onClick={() => {
                            navigate("/register");
                          }}
                          className="px-2 relative font-jakarta_sans cursor-pointer inline-block overflow-hidden text-sm  font-medium text-paragraph  before:absolute before:bottom-0 before:left-0 before:h-[1px] before:w-full before:origin-right before:scale-x-0 before:bg-paragraph :bg-white  before:transition-transform before:duration-500 before:content-[''] before:hover:origin-left before:hover:scale-x-100 leading-[24px] align-bottom"
                        >
                          Create an Account
                        </div>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
