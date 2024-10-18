import React, { useState } from "react";
import { Notyf } from "notyf";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { backend_url } from "../../../Helper";
import axios from "axios";
import { Helmet, HelmetProvider } from "react-helmet-async";

export const Register = () => {
  const notyf = new Notyf();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const register_credentials = {
        email: e.target.email.value,
        password: e.target.password.value,
        name: e.target.name.value,
      };

      const response = await axios.post(
        `${backend_url}/auth/register`,
        register_credentials,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        notyf.success(response.data.message || "Registration successful!");
        navigate(`/verify-email?email=${btoa(e.target.email.value)}`);
      } else {
        notyf.error(
          response.data.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      if (error.response) {
        notyf.error(
          error.response.data.message ||
            "Registration failed. Please try again."
        );
      } else if (error.request) {
        notyf.error("No response from the server. Please try again later.");
      } else {
        notyf.error("An error occurred during the registration process.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    // <>
    //   <HelmetProvider>
    //     <Helmet>
    //       <link rel="stylesheet" href="/assets/css/style.css" />
    //       <link rel="stylesheet" href="/assets/css/all.css" />
    //     </Helmet>
    //   </HelmetProvider>
    //   <section className="pt-[200px] mb-150 relative">
    //     <div className="absolute left-1/2 top-25 w-full h-[550px] -translate-x-1/2 bg-cover  bg-[url('https://aplio.vercel.app/images/hero-gradient.png')] bg-no-repeat bg-center opacity-70 md:hidden -z-10" />
    //     <div
    //       className="container relative"
    //       data-aos="fade-up"
    //       data-aos-offset={200}
    //       data-aos-duration={1000}
    //       data-aos-once="true"
    //     >
    //       <div className="mb-12 text-center max-w-[475px] mx-auto">
    //         <div className="font-bold text-3xl">
    //           Join our community <br />
    //           and unlock exclusive benefits!
    //         </div>
    //       </div>
    //       <div className="relative z-10 max-w-[510px] mx-auto">
    //         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex max-md:flex-col -z-10 max-md:hidden">
    //           <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/30 blur-[145px]" />
    //           <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/50 -ml-[170px] max-md:ml-0 blur-[145px]" />
    //           <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/30 -ml-[170px] max-md:ml-0 blur-[145px]" />
    //         </div>
    //         <div className="bg-white  rounded-medium p-2.5 shadow-nav">
    //           <div className="bg-white  border border-dashed rounded border-gray-100  p-12 max-md:px-5 max-md:py-7">
    //             <form onSubmit={(e) => handleRegister(e)}>
    //               <div className="grid grid-cols-12 gap-y-6 ">
    //                 <div className="col-span-12">
    //                   <label
    //                     htmlFor="name"
    //                     className="block text-sm font-medium font-jakarta_sans text-paragraph  mb-2"
    //                   >
    //                     Your Name
    //                   </label>
    //                   <input
    //                     required
    //                     type="text"
    //                     name="name"
    //                     id="name"
    //                     placeholder="Enter Your Name"
    //                     className="block w-full text-sm rounded-[48px] border border-borderColour  py-2.5 px-5 text-paragraph-light placeholder:text-paragraph-light :text-paragraph-light outline-none bg-white  focus:border-primary :border-primary duration-300 transition-all"
    //                   />
    //                 </div>
    //                 <div className="col-span-12">
    //                   <label
    //                     htmlFor="email"
    //                     className="block text-sm font-medium font-jakarta_sans text-paragraph  mb-2"
    //                   >
    //                     Email
    //                   </label>
    //                   <input
    //                     required
    //                     type="email"
    //                     name="email"
    //                     id="email"
    //                     placeholder="Email address"
    //                     className="block w-full text-sm rounded-[48px] border border-borderColour  py-2.5 px-5 text-paragraph-light placeholder:text-paragraph-light :text-paragraph-light outline-none bg-white  focus:border-primary :border-primary duration-300 transition-all"
    //                   />
    //                 </div>
    //                 <div className="col-span-full">
    //                   <label
    //                     htmlFor="password"
    //                     className="block text-sm font-medium font-jakarta_sans text-paragraph  mb-2"
    //                   >
    //                     Password
    //                   </label>
    //                   <input
    //                     required
    //                     type="password"
    //                     name="password"
    //                     id="password"
    //                     placeholder="At least 8 characters"
    //                     className="block w-full text-sm rounded-[48px] border border-borderColour  py-2.5 px-5 text-paragraph-light   placeholder:text-paragraph-light outline-none bg-white  focus:border-primary :border-primary duration-300 transition-all"
    //                   />
    //                 </div>
    //                 <div className="col-span-full ">
    //                   <button
    //                     disabled={loading}
    //                     type="submit"
    //                     className="btn w-full block"
    //                   >
    //                     {loading ? "Signing Up..." : "Sign Up"}
    //                   </button>
    //                 </div>
    //               </div>
    //             </form>
    //             <p className="text-center ont-jakarta_sans text-sm font-medium leading-[24px] ">
    //               Already Have an account?
    //               <Link
    //                 to="/login"
    //                 className="relative font-jakarta_sans inline-block overflow-hidden text-sm font-medium text-paragraph  before:absolute before:bottom-0 before:left-0 before:h-[1px] before:w-full before:origin-right before:scale-x-0 before:bg-paragraph :bg-white  before:transition-transform before:duration-500 before:content-[''] before:hover:origin-left before:hover:scale-x-100 leading-[24px] align-bottom"
    //               >
    //                 login
    //               </Link>
    //             </p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </section>
    // </>
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
        <div className="absolute left-1/2 top-25 w-full h-[550px] -translate-x-1/2 bg-cover   bg-no-repeat bg-center opacity-70 md:hidden -z-10" />
        <div
          className="container relative"
          data-aos="fade-up"
          data-aos-offset={200}
          data-aos-duration={1000}
          data-aos-once="true"
        >
          <div className="mb-12 font-bold text-center max-w-[475px] mx-auto text-4xl">
            Register Here
          </div>
          <div className="relative z-10 max-w-[510px] mx-auto">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex max-md:flex-col -z-10 max-md:hidden">
              <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/30 blur-[145px]" />
              <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/50 -ml-[170px] max-md:ml-0 blur-[145px]" />
              <div className="max-1xl:w-[335px] max-1xl:h-[335px]  1xl:w-[442px] 1xl:h-[442px]  rounded-full bg-primary-200/30 -ml-[170px] max-md:ml-0 blur-[145px]" />
            </div>
            <div className="bg-white  rounded-medium p-2.5 shadow-nav">
              <div className="bg-white  border border-dashed rounded border-gray-100  p-12 max-md:px-5 max-md:py-7">
                <form onSubmit={(e) => handleRegister(e)}>
                  <div className="grid grid-cols-12 gap-y-6 ">
                    <div className="col-span-12">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium font-jakarta_sans text-paragraph  mb-2"
                      >
                        Your Name
                      </label>
                      <input
                        required
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter Your Name"
                        className="block w-full text-sm rounded-[48px] border border-borderColour  py-2.5 px-5 text-paragraph-light placeholder:text-paragraph-light :text-paragraph-light outline-none bg-white  focus:border-primary :border-primary duration-300 transition-all"
                      />
                    </div>
                    <div className="col-span-12">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium font-jakarta_sans text-paragraph  mb-2"
                      >
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email address"
                        className="block w-full text-sm rounded-[48px] border border-borderColour  py-2.5 px-5 text-paragraph-light placeholder:text-paragraph-light :text-paragraph-light outline-none bg-white  focus:border-primary :border-primary duration-300 transition-all"
                      />
                    </div>
                    <div className="col-span-full">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium font-jakarta_sans text-paragraph  mb-2">
                        Password
                      </label>
                      <input
                        required
                        type="password"
                        name="password"
                        id="password"
                        placeholder="At least 8 characters"
                        className="block w-full text-sm rounded-[48px] border border-borderColour  py-2.5 px-5 text-paragraph-light   placeholder:text-paragraph-light outline-none bg-white  focus:border-primary :border-primary duration-300 transition-all"
                      />
                    </div>
                    <div className="col-span-full ">
                      <button
                        disabled={loading}
                        type="submit"
                        className="btn w-full block"
                      >
                        {loading ? "Signing Up..." : "Sign Up"}
                      </button>
                    </div>
                  </div>
                </form>
                <div className="col-span-full ">
                      <p className="text-sm font-medium  text-center font-jakarta_sans leading-[24px]">
                        Already have account 
                        <div
                          onClick={() => {
                            navigate("/login");
                          }}
                          className="px-2 relative font-jakarta_sans cursor-pointer inline-block overflow-hidden text-sm  font-medium text-paragraph  before:absolute before:bottom-0 before:left-0 before:h-[1px] before:w-full before:origin-right before:scale-x-0 before:bg-paragraph :bg-white  before:transition-transform before:duration-500 before:content-[''] before:hover:origin-left before:hover:scale-x-100 leading-[24px] align-bottom"
                        >
                          Login 
                        </div>
                      </p>
                    </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
