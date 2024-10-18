import React, { useState } from "react";
import axios from "axios";
import { Notyf } from "notyf";
import { backend_url } from "../../../Helper";

export const DashboardPage = () => {
  const notyf = new Notyf();
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType !== "text/csv") {
        notyf.error("Please upload a valid CSV file.");
        e.target.value = "";
        setCsvFile(null);
        return;
      }
      setCsvFile(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!csvFile) {
      notyf.error("Please upload a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", "Project1");
    formData.append("csv_file", csvFile);

    try {
      setLoading(true);
      // const response = await axios.post(
      //   `${backend_url}/forecasting/upload_csv`,
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   }
      // );

      notyf.success("CSV file uploaded successfully!");
      if (response.data.status === "success") {
        notyf.success("CSV file uploaded successfully!");
        setCsvFile(null);
      } else {
        notyf.error("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
      notyf.error("Error uploading file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
       <div className="p-6">
        <div className="">
          <div className="">
            <div className="">
              <div className="card welcome-banner bg-primary-800">
                <div className="absolute opacity-50 inset-0 bg-right-bottom bg-[length:100%] bg-no-repeat bg-blue" />
                <div className="card-body relative z-20">
                  <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 sm:col-span-6">
                      <div className="p-4">
                        <h2 className="text-white">Forcasting and Inventory Management</h2>
                        <p className="text-white my-5">
                        Driving cost efficiency and customer happiness with Predictive AI Inventory management.


                        </p>
                        <a href="" className="btn text-white">
                          Get Started
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="py-6">
                <div className="heading text-2xl font-bold">Upload CSV File</div>
                <form onSubmit={handleFormSubmit}>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100 "
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 "
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 ">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 ">
                          CSV Only (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  {/* Show the selected file name */}
                  {csvFile && (
                    <div className="mt-4 text-center">
                      <span className="text-gray-700 ">
                        Selected file: {csvFile.name}
                      </span>
                    </div>
                  )}

                  <div className="button pt-5">
                    <button
                      type="submit"
                      className="btn"
                      disabled={loading}
                    >
                      {loading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

{
  /* <div className="col-span-12 md:col-span-6">
              <div className="card">
                <div className="card-body border-bottom pb-0">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="mb-0">Transactions</h5>
                    <div className="dropdown">
                      <a
                        className="w-8 h-8 rounded-xl inline-flex items-center justify-center btn-link-secondary dropdown-toggle arrow-none"
                        href=""
                        data-pc-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i className="ti ti-dots-vertical text-lg leading-none" />
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="">
                          Today
                        </a>{" "}
                        <a className="dropdown-item" href="">
                          Weekly
                        </a>{" "}
                        <a className="dropdown-item" href="">
                          Monthly
                        </a>
                      </div>
                    </div>
                  </div>
                  <ul className="flex flex-wrap w-full text-center nav-tabs border-b border-theme-border ">
                    <li className="group active">
                      <a
                        href=""
                        data-pc-toggle="tab"
                        data-pc-target="tran-1"
                        className="inline-block mr-6 py-4 transition-all duration-300 ease-linear border-b-2 border-transparent group-[.active]:text-primary-500 group-[.active]:border-primary-500 hover:text-primary-500 active:text-primary-500"
                      >
                        All Transaction
                      </a>
                    </li>
                    <li className="group">
                      <a
                        href=""
                        data-pc-toggle="tab"
                        data-pc-target="tran-2"
                        className="inline-block mr-6 py-4 transition-all duration-300 ease-linear border-b-2 border-transparent group-[.active]:text-primary-500 group-[.active]:border-primary-500 hover:text-primary-500 active:text-primary-500"
                      >
                        Success
                      </a>
                    </li>
                    <li className="group">
                      <a
                        href=""
                        data-pc-toggle="tab"
                        data-pc-target="tran-3"
                        className="inline-block mr-6 py-4 transition-all duration-300 ease-linear border-b-2 border-transparent group-[.active]:text-primary-500 group-[.active]:border-primary-500 hover:text-primary-500 active:text-primary-500"
                      >
                        Pending
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="tab-content">
                  <div className="block tab-pane" id="tran-1">
                    <ul className="rounded-lg *:py-4 *:px-[25px] divide-y divide-inherit border-theme-border ">
                      <li className="list-group-item">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center border border-theme-border ">
                              AI
                            </div>
                          </div>
                          <div className="grow ltr:ml-3 rtl:mr-3">
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-6">
                                <h6 className="mb-0">Apple Inc.</h6>
                                <p className="text-muted mb-0">
                                  <small>#ABLE-PRO-T00232</small>
                                </p>
                              </div>
                              <div className="col-span-6 ltr:text-right rtl:text-left">
                                <h6 className="mb-1">$210,000</h6>
                                <p className="text-danger-500 mb-0">
                                  <i className="ti ti-arrow-down-left" /> 10.6%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center border border-theme-border ">
                              SM
                            </div>
                          </div>
                          <div className="grow ltr:ml-3 rtl:mr-3">
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-6">
                                <h6 className="mb-0">Spotify Music</h6>
                                <p className="text-muted mb-0">
                                  <small>#ABLE-PRO-T10232</small>
                                </p>
                              </div>
                              <div className="col-span-6 ltr:text-right rtl:text-left">
                                <h6 className="mb-1">- 10,000</h6>
                                <p className="text-success-500 mb-0">
                                  <i className="ti ti-arrow-down-right" /> 30.6%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center border border-theme-border ">
                              MD
                            </div>
                          </div>
                          <div className="grow ltr:ml-3 rtl:mr-3">
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-6">
                                <h6 className="mb-0">Medium</h6>
                                <p className="text-muted mb-0">
                                  <small>06:30 pm</small>
                                </p>
                              </div>
                              <div className="col-span-6 ltr:text-right rtl:text-left">
                                <h6 className="mb-1">-26</h6>
                                <p className="text-warning-500 mb-0">
                                  <i className="ti ti-arrows-left-right" /> 5%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center border border-theme-border ">
                              U
                            </div>
                          </div>
                          <div className="grow ltr:ml-3 rtl:mr-3">
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-6">
                                <h6 className="mb-0">Uber</h6>
                                <p className="text-muted mb-0">
                                  <small>08:40 pm</small>
                                </p>
                              </div>
                              <div className="col-span-6 ltr:text-right rtl:text-left">
                                <h6 className="mb-1">+210,000</h6>
                                <p className="text-success-500 mb-0">
                                  <i className="ti ti-arrow-up-right" /> 10.6%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center border border-theme-border ">
                              OC
                            </div>
                          </div>
                          <div className="grow ltr:ml-3 rtl:mr-3">
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-6">
                                <h6 className="mb-0">Ola Cabs</h6>
                                <p className="text-muted mb-0">
                                  <small>07:40 pm</small>
                                </p>
                              </div>
                              <div className="col-span-6 ltr:text-right rtl:text-left">
                                <h6 className="mb-1">+210,000</h6>
                                <p className="text-success-500 mb-0">
                                  <i className="ti ti-arrow-up-right" /> 10.6%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="hidden tab-pane" id="tran-2">
                    <ul className="rounded-lg *:py-4 *:px-[25px] divide-y divide-inherit border-theme-border ">
                      <li className="list-group-item">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center border border-theme-border ">
                              SM
                            </div>
                          </div>
                          <div className="grow ltr:ml-3 rtl:mr-3">
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-6">
                                <h6 className="mb-0">Spotify Music</h6>
                                <p className="text-muted mb-0">
                                  <small>#ABLE-PRO-T10232</small>
                                </p>
                              </div>
                              <div className="col-span-6 ltr:text-right rtl:text-left">
                                <h6 className="mb-1">- 10,000</h6>
                                <p className="text-success-500 mb-0">
                                  <i className="ti ti-arrow-down-right" /> 30.6%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center border border-theme-border ">
                              MD
                            </div>
                          </div>
                          <div className="grow ltr:ml-3 rtl:mr-3">
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-6">
                                <h6 className="mb-0">Medium</h6>
                                <p className="text-muted mb-0">
                                  <small>06:30 pm</small>
                                </p>
                              </div>
                              <div className="col-span-6 ltr:text-right rtl:text-left">
                                <h6 className="mb-1">-26</h6>
                                <p className="text-warning-500 mb-0">
                                  <i className="ti ti-arrows-left-right" /> 5%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center border border-theme-border ">
                              AI
                            </div>
                          </div>
                          <div className="grow ltr:ml-3 rtl:mr-3">
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-6">
                                <h6 className="mb-0">Apple Inc.</h6>
                                <p className="text-muted mb-0">
                                  <small>#ABLE-PRO-T00232</small>
                                </p>
                              </div>
                              <div className="col-span-6 ltr:text-right rtl:text-left">
                                <h6 className="mb-1">$210,000</h6>
                                <p className="text-danger-500 mb-0">
                                  <i className="ti ti-arrow-down-left" /> 10.6%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center border border-theme-border ">
                              U
                            </div>
                          </div>
                          <div className="grow ltr:ml-3 rtl:mr-3">
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-6">
                                <h6 className="mb-0">Uber</h6>
                                <p className="text-muted mb-0">
                                  <small>08:40 pm</small>
                                </p>
                              </div>
                              <div className="col-span-6 ltr:text-right rtl:text-left">
                                <h6 className="mb-1">+210,000</h6>
                                <p className="text-success-500 mb-0">
                                  <i className="ti ti-arrow-up-right" /> 10.6%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center border border-theme-border ">
                              OC
                            </div>
                          </div>
                          <div className="grow ltr:ml-3 rtl:mr-3">
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-6">
                                <h6 className="mb-0">Ola Cabs</h6>
                                <p className="text-muted mb-0">
                                  <small>07:40 pm</small>
                                </p>
                              </div>
                              <div className="col-span-6 ltr:text-right rtl:text-left">
                                <h6 className="mb-1">+210,000</h6>
                                <p className="text-success-500 mb-0">
                                  <i className="ti ti-arrow-up-right" /> 10.6%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="hidden tab-pane" id="tran-3">
                    <ul className="rounded-lg *:py-4 *:px-[25px] divide-y divide-inherit border-theme-border ">
                      <li className="list-group-item">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center border border-theme-border ">
                              U
                            </div>
                          </div>
                          <div className="grow ltr:ml-3 rtl:mr-3">
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-6">
                                <h6 className="mb-0">Uber</h6>
                                <p className="text-muted mb-0">
                                  <small>08:40 pm</small>
                                </p>
                              </div>
                              <div className="col-span-6 ltr:text-right rtl:text-left">
                                <h6 className="mb-1">+210,000</h6>
                                <p className="text-success-500 mb-0">
                                  <i className="ti ti-arrow-up-right" /> 10.6%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center border border-theme-border ">
                              OC
                            </div>
                          </div>
                          <div className="grow ltr:ml-3 rtl:mr-3">
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-6">
                                <h6 className="mb-0">Ola Cabs</h6>
                                <p className="text-muted mb-0">
                                  <small>07:40 pm</small>
                                </p>
                              </div>
                              <div className="col-span-6 ltr:text-right rtl:text-left">
                                <h6 className="mb-1">+210,000</h6>
                                <p className="text-success-500 mb-0">
                                  <i className="ti ti-arrow-up-right" /> 10.6%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center border border-theme-border ">
                              AI
                            </div>
                          </div>
                          <div className="grow ltr:ml-3 rtl:mr-3">
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-6">
                                <h6 className="mb-0">Apple Inc.</h6>
                                <p className="text-muted mb-0">
                                  <small>#ABLE-PRO-T00232</small>
                                </p>
                              </div>
                              <div className="col-span-6 ltr:text-right rtl:text-left">
                                <h6 className="mb-1">$210,000</h6>
                                <p className="text-danger-500 mb-0">
                                  <i className="ti ti-arrow-down-left" /> 10.6%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center border border-theme-border ">
                              SM
                            </div>
                          </div>
                          <div className="grow ltr:ml-3 rtl:mr-3">
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-6">
                                <h6 className="mb-0">Spotify Music</h6>
                                <p className="text-muted mb-0">
                                  <small>#ABLE-PRO-T10232</small>
                                </p>
                              </div>
                              <div className="col-span-6 ltr:text-right rtl:text-left">
                                <h6 className="mb-1">- 10,000</h6>
                                <p className="text-success-500 mb-0">
                                  <i className="ti ti-arrow-down-right" /> 30.6%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                      <li className="list-group-item">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center border border-theme-border ">
                              MD
                            </div>
                          </div>
                          <div className="grow ltr:ml-3 rtl:mr-3">
                            <div className="grid grid-cols-12 gap-2">
                              <div className="col-span-6">
                                <h6 className="mb-0">Medium</h6>
                                <p className="text-muted mb-0">
                                  <small>06:30 pm</small>
                                </p>
                              </div>
                              <div className="col-span-6 ltr:text-right rtl:text-left">
                                <h6 className="mb-1">-26</h6>
                                <p className="text-warning-500 mb-0">
                                  <i className="ti ti-arrows-left-right" /> 5%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 md:col-span-6">
                      <div className="grid">
                        <button className="btn btn-outline-secondary grid">
                          <span className="truncate w-full">
                            View all Transaction History
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-6">
                      <div className="grid">
                        <button className="btn btn-primary grid">
                          <span className="truncate w-full">
                            Create new Transaction
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6">
              <div className="card">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="mb-0">Total Income</h5>
                    <div className="dropdown">
                      <a
                        className="w-8 h-8 rounded-xl inline-flex items-center justify-center btn-link-secondary dropdown-toggle arrow-none"
                        href=""
                        data-pc-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i className="ti ti-dots-vertical text-lg leading-none" />
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="">
                          Today
                        </a>{" "}
                        <a className="dropdown-item" href="">
                          Weekly
                        </a>{" "}
                        <a className="dropdown-item" href="">
                          Monthly
                        </a>
                      </div>
                    </div>
                  </div>
                  <div id="total-income-graph" style={{ minHeight: "298.7px" }}>
                    <div
                      id="apexcharts040iy1yb"
                      className="apexcharts-canvas apexcharts040iy1yb apexcharts-theme-light"
                      style={{ width: 876, height: "298.7px" }}
                    >
                      <svg
                        id="SvgjsSvg2453"
                        width={876}
                        height="298.7"
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        xmlns:svgjs="http://svgjs.dev"
                        className="apexcharts-svg"
                        xmlns:data="ApexChartsNS"
                        transform="translate(0, 0)"
                        style={{ background: "transparent" }}
                      >
                        <foreignObject x={0} y={0} width={876} height="298.7">
                          <div
                            className="apexcharts-legend"
                            xmlns="http://www.w3.org/1999/xhtml"
                          />
                        </foreignObject>
                        <g
                          id="SvgjsG2455"
                          className="apexcharts-inner apexcharts-graphical"
                          transform="translate(291, 0)"
                        >
                          <defs id="SvgjsDefs2454">
                            <clipPath id="gridRectMask040iy1yb">
                              <rect
                                id="SvgjsRect2456"
                                width={302}
                                height={324}
                                x={-3}
                                y={-3}
                                rx={0}
                                ry={0}
                                opacity={1}
                                strokeWidth={0}
                                stroke="none"
                                strokeDasharray={0}
                                fill="#fff"
                              />
                            </clipPath>
                            <clipPath id="forecastMask040iy1yb" />
                            <clipPath id="nonForecastMask040iy1yb" />
                            <clipPath id="gridRectMarkerMask040iy1yb">
                              <rect
                                id="SvgjsRect2457"
                                width={300}
                                height={322}
                                x={-2}
                                y={-2}
                                rx={0}
                                ry={0}
                                opacity={1}
                                strokeWidth={0}
                                stroke="none"
                                strokeDasharray={0}
                                fill="#fff"
                              />
                            </clipPath>
                          </defs>
                          <g id="SvgjsG2458" className="apexcharts-pie">
                            <g
                              id="SvgjsG2459"
                              transform="translate(0, 0) scale(1)"
                            >
                              <circle
                                id="SvgjsCircle2460"
                                r="89.95365853658537"
                                cx={148}
                                cy={148}
                                fill="transparent"
                              />
                              <g id="SvgjsG2461" className="apexcharts-slices">
                                <g
                                  id="SvgjsG2462"
                                  className="apexcharts-series apexcharts-pie-series"
                                  seriesname="Totalxincome"
                                  rel={1}
                                  data:realindex={0}
                                >
                                  <path
                                    id="SvgjsPath2463"
                                    d="M 148 9.609756097560961 A 138.39024390243904 138.39024390243904 0 0 1 276.56131483513354 199.2235095950896 L 231.5648546428368 181.29528123680825 A 89.95365853658537 89.95365853658537 0 0 0 148 58.046341463414635 L 148 9.609756097560961 z "
                                    fill="rgba(70,128,255,1)"
                                    fillOpacity="1 1 1 0.3"
                                    strokeOpacity={1}
                                    strokeLinecap="butt"
                                    strokeWidth={2}
                                    strokeDasharray={0}
                                    className="apexcharts-pie-area apexcharts-donut-slice-0"
                                    index={0}
                                    j={0}
                                    data:angle="111.72413793103448"
                                    data:startangle={0}
                                    data:strokewidth={2}
                                    data:value={27}
                                    data:pathorig="M 148 9.609756097560961 A 138.39024390243904 138.39024390243904 0 0 1 276.56131483513354 199.2235095950896 L 231.5648546428368 181.29528123680825 A 89.95365853658537 89.95365853658537 0 0 0 148 58.046341463414635 L 148 9.609756097560961 z "
                                    stroke="#ffffff"
                                  />
                                </g>
                                <g
                                  id="SvgjsG2464"
                                  className="apexcharts-series apexcharts-pie-series"
                                  seriesname="Totalxrent"
                                  rel={2}
                                  data:realindex={1}
                                >
                                  <path
                                    id="SvgjsPath2465"
                                    d="M 276.56131483513354 199.2235095950896 A 138.39024390243904 138.39024390243904 0 0 1 85.39487798630151 271.4198456692703 L 107.30667069109599 228.22289968502565 A 89.95365853658537 89.95365853658537 0 0 0 231.5648546428368 181.29528123680825 L 276.56131483513354 199.2235095950896 z "
                                    fill="rgba(229,138,0,1)"
                                    fillOpacity="1 1 1 0.3"
                                    strokeOpacity={1}
                                    strokeLinecap="butt"
                                    strokeWidth={2}
                                    strokeDasharray={0}
                                    className="apexcharts-pie-area apexcharts-donut-slice-1"
                                    index={0}
                                    j={1}
                                    data:angle="95.17241379310343"
                                    data:startangle="111.72413793103448"
                                    data:strokewidth={2}
                                    data:value={23}
                                    data:pathorig="M 276.56131483513354 199.2235095950896 A 138.39024390243904 138.39024390243904 0 0 1 85.39487798630151 271.4198456692703 L 107.30667069109599 228.22289968502565 A 89.95365853658537 89.95365853658537 0 0 0 231.5648546428368 181.29528123680825 L 276.56131483513354 199.2235095950896 z "
                                    stroke="#ffffff"
                                  />
                                </g>
                                <g
                                  id="SvgjsG2466"
                                  className="apexcharts-series apexcharts-pie-series"
                                  seriesname="Download"
                                  rel={3}
                                  data:realindex={2}
                                >
                                  <path
                                    id="SvgjsPath2467"
                                    d="M 85.39487798630151 271.4198456692703 A 138.39024390243904 138.39024390243904 0 0 1 17.67320256822711 101.45125696053435 L 63.28758166934763 117.74331702434733 A 89.95365853658537 89.95365853658537 0 0 0 107.30667069109599 228.22289968502565 L 85.39487798630151 271.4198456692703 z "
                                    fill="rgba(44,168,127,1)"
                                    fillOpacity="1 1 1 0.3"
                                    strokeOpacity={1}
                                    strokeLinecap="butt"
                                    strokeWidth={2}
                                    strokeDasharray={0}
                                    className="apexcharts-pie-area apexcharts-donut-slice-2"
                                    index={0}
                                    j={2}
                                    data:angle="82.75862068965517"
                                    data:startangle="206.8965517241379"
                                    data:strokewidth={2}
                                    data:value={20}
                                    data:pathorig="M 85.39487798630151 271.4198456692703 A 138.39024390243904 138.39024390243904 0 0 1 17.67320256822711 101.45125696053435 L 63.28758166934763 117.74331702434733 A 89.95365853658537 89.95365853658537 0 0 0 107.30667069109599 228.22289968502565 L 85.39487798630151 271.4198456692703 z "
                                    stroke="#ffffff"
                                  />
                                </g>
                                <g
                                  id="SvgjsG2468"
                                  className="apexcharts-series apexcharts-pie-series"
                                  seriesname="Views"
                                  rel={4}
                                  data:realindex={3}
                                >
                                  <path
                                    id="SvgjsPath2469"
                                    d="M 17.67320256822711 101.45125696053435 A 138.39024390243904 138.39024390243904 0 0 1 147.97584634603524 9.609758205364898 L 147.98430012492292 58.04634283348719 A 89.95365853658537 89.95365853658537 0 0 0 63.28758166934763 117.74331702434733 L 17.67320256822711 101.45125696053435 z "
                                    fill="rgba(70,128,255,0.3)"
                                    fillOpacity="1 1 1 0.3"
                                    strokeOpacity={1}
                                    strokeLinecap="butt"
                                    strokeWidth={2}
                                    strokeDasharray={0}
                                    className="apexcharts-pie-area apexcharts-donut-slice-3"
                                    index={0}
                                    j={3}
                                    data:angle="70.34482758620692"
                                    data:startangle="289.6551724137931"
                                    data:strokewidth={2}
                                    data:value={17}
                                    data:pathorig="M 17.67320256822711 101.45125696053435 A 138.39024390243904 138.39024390243904 0 0 1 147.97584634603524 9.609758205364898 L 147.98430012492292 58.04634283348719 A 89.95365853658537 89.95365853658537 0 0 0 63.28758166934763 117.74331702434733 L 17.67320256822711 101.45125696053435 z "
                                    stroke="#ffffff"
                                  />
                                </g>
                              </g>
                            </g>
                            <g
                              id="SvgjsG2470"
                              className="apexcharts-datalabels-group"
                              transform="translate(0, 0) scale(1)"
                            >
                              <text
                                id="SvgjsText2471"
                                fontFamily="Helvetica, Arial, sans-serif"
                                x={148}
                                y={138}
                                textAnchor="middle"
                                dominantBaseline="auto"
                                fontSize="16px"
                                fontWeight={600}
                                fill="#4680ff"
                                className="apexcharts-text apexcharts-datalabel-label"
                                style={{
                                  fontFamily: "Helvetica, Arial, sans-serif",
                                }}
                              />
                              <text
                                id="SvgjsText2472"
                                fontFamily="Helvetica, Arial, sans-serif"
                                x={148}
                                y={174}
                                textAnchor="middle"
                                dominantBaseline="auto"
                                fontSize="20px"
                                fontWeight={400}
                                fill="#373d3f"
                                className="apexcharts-text apexcharts-datalabel-value"
                                style={{
                                  fontFamily: "Helvetica, Arial, sans-serif",
                                }}
                              />
                            </g>
                          </g>
                          <line
                            id="SvgjsLine2473"
                            x1={0}
                            y1={0}
                            x2={296}
                            y2={0}
                            stroke="#b6b6b6"
                            strokeDasharray={0}
                            strokeWidth={1}
                            strokeLinecap="butt"
                            className="apexcharts-ycrosshairs"
                          />
                          <line
                            id="SvgjsLine2474"
                            x1={0}
                            y1={0}
                            x2={296}
                            y2={0}
                            strokeDasharray={0}
                            strokeWidth={0}
                            strokeLinecap="butt"
                            className="apexcharts-ycrosshairs-hidden"
                          />
                        </g>
                      </svg>
                      <div className="apexcharts-tooltip apexcharts-theme-dark">
                        <div
                          className="apexcharts-tooltip-series-group"
                          style={{ order: 1 }}
                        >
                          <span
                            className="apexcharts-tooltip-marker"
                            style={{ backgroundColor: "rgb(70, 128, 255)" }}
                          />
                          <div
                            className="apexcharts-tooltip-text"
                            style={{
                              fontFamily: "Helvetica, Arial, sans-serif",
                              fontSize: 12,
                            }}
                          >
                            <div className="apexcharts-tooltip-y-group">
                              <span className="apexcharts-tooltip-text-y-label" />
                              <span className="apexcharts-tooltip-text-y-value" />
                            </div>
                            <div className="apexcharts-tooltip-goals-group">
                              <span className="apexcharts-tooltip-text-goals-label" />
                              <span className="apexcharts-tooltip-text-goals-value" />
                            </div>
                            <div className="apexcharts-tooltip-z-group">
                              <span className="apexcharts-tooltip-text-z-label" />
                              <span className="apexcharts-tooltip-text-z-value" />
                            </div>
                          </div>
                        </div>
                        <div
                          className="apexcharts-tooltip-series-group"
                          style={{ order: 2 }}
                        >
                          <span
                            className="apexcharts-tooltip-marker"
                            style={{ backgroundColor: "rgb(229, 138, 0)" }}
                          />
                          <div
                            className="apexcharts-tooltip-text"
                            style={{
                              fontFamily: "Helvetica, Arial, sans-serif",
                              fontSize: 12,
                            }}
                          >
                            <div className="apexcharts-tooltip-y-group">
                              <span className="apexcharts-tooltip-text-y-label" />
                              <span className="apexcharts-tooltip-text-y-value" />
                            </div>
                            <div className="apexcharts-tooltip-goals-group">
                              <span className="apexcharts-tooltip-text-goals-label" />
                              <span className="apexcharts-tooltip-text-goals-value" />
                            </div>
                            <div className="apexcharts-tooltip-z-group">
                              <span className="apexcharts-tooltip-text-z-label" />
                              <span className="apexcharts-tooltip-text-z-value" />
                            </div>
                          </div>
                        </div>
                        <div
                          className="apexcharts-tooltip-series-group"
                          style={{ order: 3 }}
                        >
                          <span
                            className="apexcharts-tooltip-marker"
                            style={{ backgroundColor: "rgb(44, 168, 127)" }}
                          />
                          <div
                            className="apexcharts-tooltip-text"
                            style={{
                              fontFamily: "Helvetica, Arial, sans-serif",
                              fontSize: 12,
                            }}
                          >
                            <div className="apexcharts-tooltip-y-group">
                              <span className="apexcharts-tooltip-text-y-label" />
                              <span className="apexcharts-tooltip-text-y-value" />
                            </div>
                            <div className="apexcharts-tooltip-goals-group">
                              <span className="apexcharts-tooltip-text-goals-label" />
                              <span className="apexcharts-tooltip-text-goals-value" />
                            </div>
                            <div className="apexcharts-tooltip-z-group">
                              <span className="apexcharts-tooltip-text-z-label" />
                              <span className="apexcharts-tooltip-text-z-value" />
                            </div>
                          </div>
                        </div>
                        <div
                          className="apexcharts-tooltip-series-group"
                          style={{ order: 4 }}
                        >
                          <span
                            className="apexcharts-tooltip-marker"
                            style={{ backgroundColor: "rgb(70, 128, 255)" }}
                          />
                          <div
                            className="apexcharts-tooltip-text"
                            style={{
                              fontFamily: "Helvetica, Arial, sans-serif",
                              fontSize: 12,
                            }}
                          >
                            <div className="apexcharts-tooltip-y-group">
                              <span className="apexcharts-tooltip-text-y-label" />
                              <span className="apexcharts-tooltip-text-y-value" />
                            </div>
                            <div className="apexcharts-tooltip-goals-group">
                              <span className="apexcharts-tooltip-text-goals-label" />
                              <span className="apexcharts-tooltip-text-goals-value" />
                            </div>
                            <div className="apexcharts-tooltip-z-group">
                              <span className="apexcharts-tooltip-text-z-label" />
                              <span className="apexcharts-tooltip-text-z-value" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-3 mt-4">
                    <div className="col-span-12 sm:col-span-6">
                      <div className="p-4 rounded-lg bg-theme-bodybg ">
                        <p className="mb-1 relative inline-flex items-center gap-2">
                          <span className="rounded-full w-2 h-2 inline-block bg-primary-500" />
                          <span>Item01</span>
                        </p>
                        <h6 className="mb-0">
                          $23,876{" "}
                          <small className="text-muted">
                            <i className="ti ti-chevrons-up" /> +$763,43
                          </small>
                        </h6>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <div className="p-4 rounded-lg bg-theme-bodybg ">
                        <p className="mb-1 relative inline-flex items-center gap-2">
                          <span className="rounded-full w-2 h-2 inline-block bg-warning-500" />
                          <span>Item02</span>
                        </p>
                        <h6 className="mb-0">
                          $23,876{" "}
                          <small className="text-muted">
                            <i className="ti ti-chevrons-up" /> +$763,43
                          </small>
                        </h6>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <div className="p-4 rounded-lg bg-theme-bodybg ">
                        <p className="mb-1 relative inline-flex items-center gap-2">
                          <span className="rounded-full w-2 h-2 inline-block bg-success-500" />
                          <span>Item03</span>
                        </p>
                        <h6 className="mb-0">
                          $23,876{" "}
                          <small className="text-muted">
                            <i className="ti ti-chevrons-up" /> +$763,43
                          </small>
                        </h6>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6">
                      <div className="p-4 rounded-lg bg-theme-bodybg ">
                        <p className="mb-1 relative inline-flex items-center gap-2">
                          <span className="rounded-full w-2 h-2 inline-block bg-info-500" />
                          <span>Item04</span>
                        </p>
                        <h6 className="mb-0">
                          $23,876{" "}
                          <small className="text-muted">
                            <i className="ti ti-chevrons-up" /> +$763,43
                          </small>
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */
}
