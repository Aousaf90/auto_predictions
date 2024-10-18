import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import { useSearchParams } from "react-router-dom";
import { backend_url } from "../../../Helper";
import { Helmet, HelmetProvider } from 'react-helmet-async';


export const VerifyEmail = () => {
  const navigate = useNavigate();

  const notyf = new Notyf();

  const [loading, setLoading] = useState();
  const urlParams = useSearchParams();
  const handleVerification = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const encodedEmail = urlParams.get("email");
    const email = atob(encodedEmail);
    const verifyParams = {
      email: email,
      code: e.target.code.value,
    };
    try {
      const response = await axios.post(
        `${backend_url}/auth/account_activation`,
        verifyParams,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response: ", response);
      if (response.status == 200) {
        notyf.success("Account successfully verified!");
        navigate('/login')
        
      } else {
        notyf.error(response.detail);
      }
    } catch (error) {
      console.error("Error: ", error);
      notyf.error(error.response.data.detail);
    }
  };

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
          <img src="img/logos/Gif 1.gif"
          width={100}
          alt="" /></a>    
        </div>
      <div className="absolute left-1/2 top-25 w-full h-[550px] -translate-x-1/2 bg-cover  bg-[url('https://aplio.vercel.app/images/hero-gradient.png')] bg-no-repeat bg-center opacity-70 md:hidden -z-10" />
      <div
        className="container relative"
        data-aos="fade-up"
        data-aos-offset={200}
        data-aos-duration={1000}
        data-aos-once="true"
      >
        <div className="mb-12 text-center max-w-[475px] mx-auto">
          <h2>Verify Your Email</h2>
        </div>
        <div className="relative z-10 max-w-[510px] mx-auto">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex max-md:flex-col -z-10 max-md:hidden">
            <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/30 blur-[145px]" />
            <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/50 -ml-[170px] max-md:ml-0 blur-[145px]" />
            <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/30 -ml-[170px] max-md:ml-0 blur-[145px]" />
          </div>
          <div className="bg-white  rounded-medium p-2.5 shadow-nav">
            <div className="bg-white  border border-dashed rounded border-gray-100  p-12 max-md:px-5 max-md:py-7">
              <form onSubmit={(e) => handleVerification(e)}>
                <div className="grid grid-cols-12 gap-y-6 ">
                  <div className="col-span-12">
                    <label
                      htmlFor="email"
                      className="block text-sm font-jakarta_sans font-bold text-paragraph  mb-2"
                    >
                      A Verification Code has been send to your email...
                    </label>
                  </div>
                  <div className="col-span-full">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium font-jakarta_sans text-paragraph  mb-2"
                    >
                      Enter your code here
                    </label>
                    <input
                      required
                      type="text"
                      name="code"
                      id="code"
                      placeholder="please enter your code here"
                      className="block w-full text-sm rounded-[48px] border border-borderColour  py-3.5 px-5 text-paragraph-light   placeholder:text-paragraph-light outline-none bg-white  focus:border-primary :border-primary duration-300 transition-all"
                    />
                  </div>
                  <div className="col-span-full ">
                    <button
                      disabled={loading}
                      type="submit"
                      className="btn w-full block font-medium"
                    >
                      Verify
                    </button>
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
