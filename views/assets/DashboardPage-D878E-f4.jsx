import React, { useRef, useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import axios from "axios";
import { backend_url } from "../../../Helper";
import { BarChart } from "@mui/x-charts";
import ProgressBar from "@ramonak/react-progress-bar";
import { RxCross2 } from "react-icons/rx";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { Notyf } from "notyf";
import CircularProgress from "@mui/material/CircularProgress";

export const DashboardPage = () => {
  const [messages, setMessages] = useState([]);
  const [botTyping, setBotTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [number_of_products, setNumberOfProducts] = useState(0);
  const [progress, setProgress] = useState();

  const [liveChartData, setLiveChartData] = useState({
    actualValue: [],
    predictedValues: [],
    predictoin_monthly_data: [],
  });
  const [productList, setProductList] = useState([]);
  const [loadingCharts, setLoadingCharts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingDialogOpen, setLoadingDialogOpen] = useState(false); // State for the loading modal

  const [files, setFiles] = useState([]);
  const [predictioin_period, setPredictioinPeriod] = useState(3);
  const [is_fileDownloading, setIsFileDownloading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showBarGraph, setShowBarGraph] = useState();
  const [selectedFileName, setSelectedFileName] = useState();
  const [isDownloadReady, setisDownloadReady] = useState(false);
  const [progressData, setProgressData] = useState({
    progress: 0,
    message: "",
  });
  const [interactWithChat, setInteractWithChat] = useState(false);
  const notfy = new Notyf({
    duration: 4000,
  }
  );

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];

    if (!file) {
      notfy.error("No file selected.");
      return;
    }
    if (file.type !== "text/csv") {
      notfy.error("Please upload a CSV file.");
      return;
    }
    const maxFileSize = 30 * 1024 * 1024; // 30 MB
    // if (file.size > maxFileSize) {
    //   notfy.error("File size should not exceed 30 MB.");
    //   return;
    // }

    try {
      setFileUploading(true);
      setProgress(0);
      const formData = new FormData();
      formData.append("csv_file", file);

      const response = await axios.post(
        `${backend_url}/forecasting/upload_csv`,
        formData,
        {
          headers: {
            Authentication: "Bearer " + localStorage.getItem("forcastToken"),
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );
      if (response.status === 200) {
        const newFile = {
          file_name: file.name,
          id: response.data.file_data.file.id,
        };
        setFiles((prevFiles) => [...prevFiles, newFile]);
        notfy.success("File uploaded successfully.");
      } else {
        notfy.error(response.data.message || "Upload failed.");
      }
    } catch (e) {
      notfy.error(e.response?.data?.detail || e.message);
    } finally {
      setFileUploading(false);
    }
  };

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleUserInput = async (e) => {
    if (
      (e.key === "Enter" || e.type === "click") &&
      inputRef.current.value.trim()
    ) {
      e.preventDefault();
      const userInput = inputRef.current.value.trim();
      inputRef.current.value = "";
      if (selectedFile == 0) {
        notfy.error("Please select a file");
        setMessages([]);
      }

      addMessage({ from: "user", text: userInput });

      setBotTyping(true);

      try {
        const response = await axios.post(
          `${backend_url}/forecasting/chat/${encodeURIComponent(selectedFile)}`,
          {
            question: userInput,
          }
          // {
          //   headers: {
          //     Authentication: "Bearer " + localStorage.getItem("forecastToken"),
          //   },
          // }
        );
        // if (response.status !== 200) {
        //   throw new Error(`HTTP error! Status: ${response.status}`);
        // }
        if (response.data) {
          addMessage({ from: "bot", text: response.data });
        }
      } catch (error) {
        console.error("Error fetching chatbot response:", error);
        addMessage({
          from: "bot",
          text: "Sorry, I couldn't process your request. Please try again later.",
        });
      }

      setBotTyping(false);
    }
  };

  const get_product_data = async (file_id) => {
    try {
      setIsLoading(true);
      showLoadingDialog();

      const response = await axios.get(
        `${backend_url}/forecasting/get_product_data/${file_id}`
      );
      if (response.status == 200) {
        const filteredProducts = response.data.products.filter(
          (product) => !product.includes('/')
        );
        setProductList(filteredProducts);
        setSelectedFileName(response.data.file);
        setNumberOfProducts(response.data.number_of_products);
        setSelectedFile(file_id);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
      hideLoadingDialog();
    }
  };

  const get_csv_data = async (product_name) => {
    setLoadingCharts(true);
    try {
      product_name = product_name.replace(/\//g, "");
      const response = await axios.get(
        `${backend_url}/forecasting/get_csv_data/${encodeURIComponent(
          selectedFile
        )}/${encodeURIComponent(product_name)}/${predictioin_period}`,
        {
          headers: {
            Authentication: "Bearer " + localStorage.getItem("forecastToken"),
          },
        }
      );
      if (response.status === 200) {
        const { fields, csv_data, prediction_data, predictoin_monthly_data } =
          response.data;
        console.log("CSV DATA: , ", response.data);
        const actualValues = [];
        const predictedValues = [];
        const monthly_prediction = [];
        if (Array.isArray(csv_data)) {
          csv_data.forEach((item, index) => {
            const xValue = new Date(item[fields[0]]);
            const formattedXValue = xValue.toLocaleDateString("en-US", {
              month: "short",
              // day: "2-digit"
            });

            const yValue = Number(item[fields[1]]);
            if (!isNaN(xValue.getTime()) && !isNaN(yValue)) {
              actualValues.push({ x: formattedXValue, y: yValue });
            } else {
              console.warn(`Invalid actual data at index ${index}: `, item);
            }
          });
        } else {
          console.error("csv_data is undefined or not an array");
          notfy.error("Error generating forecasting");
        }

        if (Array.isArray(prediction_data)) {
          prediction_data.forEach((item, index) => {
            const xValue = new Date(item.Month + "-01");
            const formattedXValue = xValue.toLocaleDateString("en-US", {
              year: "2-digit",
              month: "short",
            });
            const yValue = Number(item.Average);
            if (!isNaN(xValue.getTime()) && !isNaN(yValue)) {
              predictedValues.push({ x: formattedXValue, y: yValue });
            } else {
              console.warn(`Invalid predicted data at index ${index}: `, item);
            }
          });
        } else {
          console.error("prediction_data is undefined or not an array");
        }

        if (Array.isArray(predictoin_monthly_data)) {
          predictoin_monthly_data.forEach((item, index) => {
            const dateObj = new Date(item.Month);
            const formattedDate = dateObj.toLocaleString("default", {
              month: "long",
              year: "numeric",
            });
            const xValue = formattedDate;
            const yValue = Number(item.Average);
            if (!isNaN(dateObj.getTime()) && !isNaN(yValue)) {
              monthly_prediction.push({ x: xValue, y: yValue });
            } else {
              console.warn(`Invalid predicted data at index ${index}: `, item);
            }
          });
        } else {
          console.error("prediction_data is undefined or not an array");
        }

        setLiveChartData({
          actualValue: actualValues,
          predictedValues: predictedValues,
          predictoin_monthly_data: monthly_prediction,
        });
      }
      setLoadingCharts(false);
    } catch (err) {
      console.error("Error fetching data:", err.response.data.detail);
      notfy.error(err.response.data.detail);
      setLoadingCharts(false);
    } finally {
      setLoadingCharts(false);
    }
  };
  const showLoadingDialog = () => {
    setLoadingDialogOpen(true);
  };
  const hideLoadingDialog = () => {
    setLoadingDialogOpen(false);
  };

  const handlePredictoinDownload = async () => {
    try {
      if (selectedFile == 0) {
        notfy.error("Please Select CSV File...");
        return;
      }
      setIsFileDownloading(true);
      const eventSource = new EventSource(
        `${backend_url}/forecasting/generate_prediction/${selectedFile}/${predictioin_period}`
      );

      console.log("Event: ", eventSource);

      eventSource.onmessage = (event) => {
        console.log("Event Data: ", event.data);
        const progressData = JSON.parse(event.data);
        const { status, message } = progressData;
        setProgressData({
          progress: status,
          message: message,
        });
        console.log(`Status: ${status}, Message: ${message}`);
      };

      eventSource.addEventListener("end", (event) => {
        console.log("Processing completed:", event.data);
        const data = JSON.parse(event.data);
        notfy.success(data.message);
        setisDownloadReady(true);
        eventSource.close();
        setProgressData({});
        setIsFileDownloading(false);
      });

      eventSource.addEventListener("error", (event) => {
        console.error("Error Event:", event);
        notfy.error("An error occurred during prediction.");
        eventSource.close();
        setProgressData({});
        setIsFileDownloading(false);
        setisDownloadReady(false);
      });
    } catch (e) {
      console.log("Error: ", e);
      notfy.error(e);
      setIsFileDownloading(false);
    }
  };

  const get_csv_file = async () => {
    try {
      const response = await axios.get(`${backend_url}/forecasting/get-files`, {
        headers: {
          Authentication: "Bearer " + localStorage.getItem("forcastToken"),
        },
      });
      if (response.status === 200) {
        setFiles(response.data.files);
      } else {
        notfy.error("Failed to fetch file data.");
      }
    } catch (error) {
      notfy.error("An error occurred while fetching file data.");
    }
  };

  useEffect(() => {
    get_csv_file();
  }, []);

  useEffect(() => {
    if (selectedFile != null) {
      get_csv_data(selectedProduct);
    }
  }, [predictioin_period]);

  // if (isLoading) {
  //   return (
      // <div>
      //   <div className="flex items-center justify-center min-h-screen">
      //     <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-[#683999] border-t-transparent"></div>
      //   </div>
      // </div>
  //   );
  // }
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <link rel="stylesheet" href="css/theme.css" />
          <script src="https://cdn.tailwindcss.com"></script>
        </Helmet>
      </HelmetProvider>
      <Dialog
  open={isLoading}
  onClose={hideLoadingDialog}
  PaperProps={{
    style: {
      backgroundColor: "transparent", // Remove background color
      boxShadow: "none", // Remove shadow
    },
  }}
>
  <DialogContent
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div className="w-full flex justify-center items-center mb-4">
    <div>
        <div className="flex items-center justify-center min-h-[100%]">
          <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-[#ffffff] border-t-transparent"></div>
        </div>
      </div>
      {/* <CircularProgress sx={{ color: "#ffffff" }} /> Set color to white */}
    </div>
  </DialogContent>
</Dialog>


      <div className="">
        {fileUploading && (
          <div className="fixed top-0 left-0 right-0 text-white text-center z-50">
            <div className="flex justify-center items-center">
              <div className="relative w-full">
                <div
                  className="bg-[#683999] h-1 rounded"
                  style={{ width: `${progress}%` }}
                ></div>
                <span className="absolute left-1/2 transform -translate-x-1/2 text-sm font-bold"></span>
              </div>
            </div>
          </div>
        )}
        <div className="pc-container">
          <div className="pc-content">
            <div className="grid grid-cols-12 gap-x-6">
              <div className="toggle col-span-12 ">
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value={interactWithChat}
                    class="sr-only peer"
                    onChange={() => {
                      setInteractWithChat(!interactWithChat);
                    }}
                  />
                  <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-blue-600"></div>
                  <span class="ms-3 text-sm font-medium text-gray-900 ">
                    Switch to Chat
                  </span>
                </label>
              </div>
              <div className="col-span-12 py-4 ">
                <div className="flex items-center  justify-center w-full">
                  <label
                    for="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2  border-dashed rounded-lg cursor-pointer bg-gradient-to-r border-[#683999] bg-[##f8f9fa]"
                  >
                    <div className="flex flex-col  items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm  ">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={fileUploading}
                    />
                  </label>
                </div>
              </div>
              <div className="col-span-12 p-4 lg:col-span-6">
                <div className="card">
                  <div className="card-body ">
                    <div className="flex items-center justify-between">
                      <div className="flex w-full justify-between items-center">
                        <h5 className="mb-0 font-bold text-2xl  pb-5">
                          CSV Detail
                        </h5>
                        <div className="">
                          <div className="">
                            <button
                              onClick={handlePredictoinDownload}
                              disabled={is_fileDownloading}
                              className="bg-black rounded-3xl text-white p-3 font-bold align-center justify-center"
                            >
                              <i className="ti ti-plus" />{" "}
                              {is_fileDownloading
                                ? "Generating Forecasting..."
                                : "Generate Forecast"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedFile > 0 && (
                      <div className="flex flex-col sm:flex-row w-full justify-between lg:pt-6 xl:pt-12 pt-6 gap-4">
                        <div className="csv_name flex items-center">
                          <div className="name mx-2 font-bold">File Name:</div>
                          <div className="text-sm">{selectedFileName}</div>
                        </div>
                        <div className="csv_name flex items-center">
                          <div className="name mx-2 font-bold">
                            Number of Products:
                          </div>
                          <div className="text-sm">{number_of_products}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  {is_fileDownloading && (
                    <div className="progress p-4">
                      <div className="progress_bar">
                        <ProgressBar
                          completed={progressData.progress}
                          bgColor="#683999"
                        />
                      </div>
                      <div className="message">{progressData.message}</div>
                    </div>
                  )}
                  <div className="message-box p-4 w-full flex justify-end">
                    {isDownloadReady && (
                      <div className="download-button flex space-x-2">
                        <a
                          href={`${backend_url}/forecasting/downlaod_predictition_file/${selectedFile}`}
                        >
                          <div className="bg-black text-sm py-3 text-white rounded-3xl p-2 font-bold">
                            Download Forecast File
                          </div>
                        </a>
                        <div
                          className="cancel-button cursor-pointer"
                          onClick={() => {
                            setisDownloadReady(false);
                          }}
                        >
                          <RxCross2 />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-12 p-4 lg:col-span-6">
                <div className="card">
                  <div className="card-body">
                    <div className="items-center">
                      <div className="grow mx-3">
                        <h6 className="font-bold">Filters</h6>
                      </div>
                      <div>
                        <div className="dropdown-menu ">
                          <select
                            onChange={(e) => {
                              setSelectedFile(e.target.value);
                              const selectedFileId = e.target.value;
                              get_product_data(selectedFileId);
                              setisDownloadReady(false);
                            }}
                            value={selectedFile}
                            id="small"
                            className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select a file</option>
                            {files.map((file, index) => (
                              <option key={index} value={file.id}>
                                {file.file_name}
                              </option>
                            ))}
                          </select>
                          <div className="flex w-full justify-between">
                            {selectedFile > 0 && (
                              <div className="">
                                <select
                                  onChange={(e) => {
                                    const predictionPeriod = e.target.value;
                                    setPredictioinPeriod(predictionPeriod);
                                  }}
                                  id="small"
                                  className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="">Prediction Period</option>
                                  <option key={1} value={3}>
                                    3 Month
                                  </option>
                                  <option key={2} value={6}>
                                    6 Month
                                  </option>
                                  <option key={3} value={9}>
                                    9 Month
                                  </option>
                                  <option key={4} value={12}>
                                    12 Month
                                  </option>
                                </select>
                              </div>
                            )}
                            {selectedFile > 0 && (
                              <div className="">
                                <select
                                  onChange={(e) => {
                                    const selectedProductId = e.target.value;
                                    get_csv_data(selectedProductId);
                                    setSelectedProduct(selectedProductId);
                                  }}
                                  id="small"
                                  className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="">Select Your Product</option>
                                  {productList.map((product, index) => (
                                    <option key={index} value={product}>
                                      {product}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {interactWithChat == false ? (
                <>
                  <div
                    className={`col-span-12 border-black border-2 border-opacity-30 p-4 rounded-2xl  md:col-span-6 2xl:col-span-6`}
                  >
                    <div className="card">
                      <div className="card-body">
                        <div className="">
                          <div className="flex items-center shrink-0">
                            <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center bg-primary-500/10 text-primary-500">
                              <svg
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  opacity="0.4"
                                  d="M13 9H7"
                                  stroke="#4680FF"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M22.0002 10.9702V13.0302C22.0002 13.5802 21.5602 14.0302 21.0002 14.0502H19.0402C17.9602 14.0502 16.9702 13.2602 16.8802 12.1802C16.8202 11.5502 17.0602 10.9602 17.4802 10.5502C17.8502 10.1702 18.3602 9.9502 18.9202 9.9502H21.0002C21.5602 9.9702 22.0002 10.4202 22.0002 10.9702Z"
                                  stroke="#4680FF"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M17.48 10.55C17.06 10.96 16.82 11.55 16.88 12.18C16.97 13.26 17.96 14.05 19.04 14.05H21V15.5C21 18.5 19 20.5 16 20.5H7C4 20.5 2 18.5 2 15.5V8.5C2 5.78 3.64 3.88 6.19 3.56C6.45 3.52 6.72 3.5 7 3.5H16C16.26 3.5 16.51 3.50999 16.75 3.54999C19.33 3.84999 21 5.76 21 8.5V9.95001H18.92C18.36 9.95001 17.85 10.17 17.48 10.55Z"
                                  stroke="#4680FF"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <div className="grow ltr:ml-3 rtl:mr-3">
                              <h6 className="mb-0 font-semibold px-4 ">
                                Actual Data
                              </h6>
                            </div>
                          </div>
                          <div
                            className="chart w-full flex-grow flex items-center justify-center"
                            style={{ minHeight: "150px", paddingTop: "1rem" }} // Changed to minHeight
                          >
                            {loadingCharts ? (
                              <CircularProgress />
                            ) : liveChartData.actualValue.length > 0 &&
                              liveChartData.predictedValues.length > 0 ? (
                              <div className="w-full">
                                <div className="w-full">
                                  <BarChart
                                    xAxis={[
                                      {
                                        scaleType: "band",
                                        data: liveChartData.actualValue.map(
                                          (items) => items.x
                                        ),
                                      },
                                    ]}
                                    series={[
                                      {
                                        data: liveChartData.actualValue.map(
                                          (items) => items.y
                                        ),
                                      },
                                    ]}
                                    height={300}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div>No data available for chart</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`col-span-12 border-black border-2 border-opacity-30 p-4 rounded-2xl md:col-span-6 2xl:col-span-6`}
                  >
                    <div className="card">
                      <div className="card-body">
                        <div className="flex items-center">
                          <div className="shrink-0">
                            <div className="w-10 h-10 rounded-xl inline-flex items-center justify-center bg-warning-500/10 text-warning-500">
                              <svg
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M21 7V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V7C3 4 4.5 2 8 2H16C19.5 2 21 4 21 7Z"
                                  stroke="#E58A00"
                                  strokeWidth="1.5"
                                  strokeMiterlimit={10}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  opacity="0.6"
                                  d="M14.5 4.5V6.5C14.5 7.6 15.4 8.5 16.5 8.5H18.5"
                                  stroke="#E58A00"
                                  strokeWidth="1.5"
                                  strokeMiterlimit={10}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  opacity="0.6"
                                  d="M8 13H12"
                                  stroke="#E58A00"
                                  strokeWidth="1.5"
                                  strokeMiterlimit={10}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  opacity="0.6"
                                  d="M8 17H16"
                                  stroke="#E58A00"
                                  strokeWidth="1.5"
                                  strokeMiterlimit={10}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="grow ltr:ml-3 rtl:mr-3">
                            <h6 className="mb-0 font-semibold px-4 text-[#633694]">
                              Forecasts
                            </h6>
                          </div>
                        </div>
                        <div
                          className="chart w-full flex-grow flex items-center justify-center"
                          style={{ minHeight: "150px", paddingTop: "1rem" }}
                        >
                          {loadingCharts ? (
                            <CircularProgress />
                          ) : liveChartData.actualValue.length > 0 &&
                            liveChartData.predictedValues.length > 0 ? (
                            <div className="w-full">
                              <div className="graph">
                                <BarChart
                                  colors={["#6b89e3"]}
                                  xAxis={[
                                    {
                                      scaleType: "band",
                                      data: liveChartData.predictedValues.map(
                                        (item) => item.x
                                      ),
                                    },
                                  ]}
                                  yAxis={[
                                    {
                                      scaleType: "linear",
                                      domain: ["auto", "auto"],
                                    },
                                  ]}
                                  series={[
                                    {
                                      data: liveChartData.predictedValues.map(
                                        (item) => item.y
                                      ),
                                    },
                                  ]}
                                  height={300}
                                />
                              </div>
                            </div>
                          ) : (
                            <div>No data available for chart</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className={`col-span-12 border-black border-2 border-opacity-30 p-4 rounded-2xl md:col-span-12 py-4 2xl:col-span-12 w-full `}
                >
                  <div className="">
                    <form>
                      <div className="card h-[500px] chats flex-grow w-full px-4 overflow-y-auto">
                        <div className="flex-1 p-2 sm:p-6 justify-between flex flex-col rounded-2xl h-[50vh] bg-white">
                          <div
                            id="messages"
                            className="flex flex-col space-y-4 p-3 overflow-y-auto"
                          >
                            {messages.length === 0 && !botTyping && (
                              <div className="text-center text-gray-500">
                                No previous conversations.
                              </div>
                            )}
                            {messages.map((message, key) => (
                              <div key={key}>
                                <div
                                  className={`flex items-end ${
                                    message.from === "bot"
                                      ? "justify-start"
                                      : "justify-end"
                                  }`}
                                >
                                  <div
                                    className={`flex flex-col space-y-2 text-md leading-tight max-w-lg mx-2 ${
                                      message.from === "bot"
                                        ? "order-2 items-start"
                                        : "order-1 items-end"
                                    }`}
                                  >
                                    <div>
                                      <span
                                        className={`px-4 py-3 rounded-xl inline-block ${
                                          message.from === "bot"
                                            ? "rounded-bl-none bg-gray-100 text-gray-600"
                                            : "rounded-br-none bg-[#2f63ff] text-white"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                          __html: message.text,
                                        }}
                                      ></span>
                                    </div>
                                  </div>
                                  <img
                                    src={
                                      message.from === "bot"
                                        ? "https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png"
                                        : "https://i.pravatar.cc/100?img=7"
                                    }
                                    alt=""
                                    className={`w-6 h-6 rounded-full ${
                                      message.from === "bot"
                                        ? "order-1"
                                        : "order-2"
                                    }`}
                                  />
                                </div>
                              </div>
                            ))}
                            {botTyping && (
                              <div className="flex items-end">
                                <div className="flex flex-col space-y-2 text-md leading-tight mx-2 order-2 items-start">
                                  <div>
                                    <img
                                      src="https://support.signal.org/hc/article_attachments/360016877511/typing-animation-3x.gif"
                                      alt="Typing..."
                                      className="w-16 ml-6"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                            <div ref={messagesEndRef} />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center  space-x-4 prompt">
                        <div className="input w-full">
                          <input
                            type="text"
                            autoFocus
                            onKeyDown={handleUserInput}
                            ref={inputRef}
                            className="w-full p-2 border rounded-3xl border-gray-300"
                            placeholder="Enter your prompt..."
                          />
                        </div>
                        <div
                          className="bg-black text-white px-4 py-2 rounded-3xl cursor-pointer"
                          onClick={handleUserInput}
                        >
                          Send
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
