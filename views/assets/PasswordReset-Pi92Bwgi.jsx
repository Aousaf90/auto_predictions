import React, { useState } from "react";
import axios from "axios";
import { backend_url } from "../../../Helper";
import { Notyf } from "notyf";
import { useNavigate } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link } from "react-router-dom";
export const PasswordReset = () => {
  const notyf = new Notyf();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${backend_url}/auth/send-reset-code`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setStep(2);
        notyf.success("Reset code sent to your email!");
      }
    } catch (error) {
      console.error("Error sending reset code:", error);
      notyf.error("Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const code = e.target.code.value;
      const response = await axios.post(
        `${backend_url}/auth/reset-password`,
        {
          email,
          code,
          password: newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        notyf.success("Password successfully reset!");
        navigate('/login')
      }
    } catch (error) {
      console.error("Verification failed:", error);
      notyf.error(error.response.data.detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
          <HelmetProvider>
        <Helmet>
          <link rel="stylesheet" href="/assets/css/style.css" />
          <link rel="stylesheet" href="/assets/css/all.css" />
          <script src="https://cdn.tailwindcss.com"></script>

        </Helmet>
      </HelmetProvider>
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
      <div className="absolute left-1/2 top-25 w-full h-[550px] -translate-x-1/2 bg-cover  bg-[url('https://aplio.vercel.app/images/hero-gradient.png')] bg-no-repeat bg-center opacity-70 md:hidden -z-10" />
      <div
        className="container relative"
        data-aos="fade-up"
        data-aos-offset={200}
        data-aos-duration={1000}
        data-aos-once="true"
      >
        <div className="text-2xl font-bold mb-12 text-center max-w-[475px] mx-auto">
          <h2>{step === 1 ? "Reset Password" : "Enter Verification Code & New Password"}</h2>
        </div>
        <div className="relative z-10 max-w-[510px] mx-auto">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex max-md:flex-col -z-10 max-md:hidden">
            <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/30 blur-[145px]" />
            <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/50 -ml-[170px] max-md:ml-0 blur-[145px]" />
            <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/30 -ml-[170px] max-md:ml-0 blur-[145px]" />
          </div>
          <div className="bg-white  rounded-medium p-2.5 shadow-nav">
            <div className="bg-white  border border-dashed rounded border-gray-100  p-12 max-md:px-5 max-md:py-7">
              {step === 1 ? (
                <form onSubmit={handleEmailSubmit}>
                <div className="grid grid-cols-12 gap-y-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium font-jakarta_sans text-paragraph  mb-2"
                    >
                      Enter your email to reset your password
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full text-sm rounded-[48px] border border-borderColour  py-3.5 px-5 text-paragraph-light placeholder:text-paragraph-light outline-none bg-white  focus:border-primary  duration-300 transition-all"
                    />
                  </div>
              
                  <div className="col-span-full flex gap-4">
                    <button
                      type="button"
                    //   onClick={handleCancel}
                      className="btn w-full block font-medium text-white"
                      onClick={()=>{navigate('/login')}}

                    >
                        Cancel
                    </button>
                    <button
                      disabled={loading}
                      type="submit"
                      className="btn text-white w-full block font-medium"
                    >
                      {loading ? "Sending code..." : "Send Reset Code"}
                    </button>
                  </div>
                </div>
              </form>
              
              ) : (
                <form onSubmit={handleVerification}>
                  <div className="grid grid-cols-12 gap-y-6 ">
                    <div className="col-span-12">
                      <label
                        htmlFor="code"
                        className="block text-sm font-bold font-jakarta_sans text-paragraph  mb-2"
                      >
                        A Password Reset Code has been sent to your email.
                      </label>
                    </div>
                    <div className="col-span-full">
                      <label
                        htmlFor="code"
                        className="block text-sm font-medium font-jakarta_sans text-paragraph  mb-2"
                      >
                        Enter your code here
                      </label>
                      <input
                        required
                        type="text"
                        name="code"
                        id="code"
                        placeholder="Please enter your code here"
                        className="block w-full text-sm rounded-[48px] border border-borderColour  py-3.5 px-5 text-paragraph-light placeholder:text-paragraph-light outline-none bg-white  focus:border-primary  duration-300 transition-all"
                      />
                    </div>
                    <div className="col-span-full">
                      <label
                        htmlFor="new-password"
                        className="block text-sm font-medium font-jakarta_sans text-paragraph  mb-2"
                      >
                        Enter your new password
                      </label>
                      <input
                        required
                        type="password"
                        name="new-password"
                        id="new-password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="block w-full text-sm rounded-[48px] border border-borderColour  py-3.5 px-5 text-paragraph-light placeholder:text-paragraph-light outline-none bg-white  focus:border-primary  duration-300 transition-all"
                      />
                    </div>
                    <div className="col-span-full ">
                      <button
                        disabled={loading}
                        type="submit"
                        className="btn w-full block font-medium"
                      >
                        {loading ? "Verifying..." : "Verify Code and Reset Password"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
    </>
  );
};
