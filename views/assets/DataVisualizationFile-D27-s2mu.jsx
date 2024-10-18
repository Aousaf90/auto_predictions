import React, { useEffect, useState } from "react";
import axios from "axios";
import { Notyf } from "notyf";
import { backend_url } from "../../../Helper";

import { MdDelete } from "react-icons/md";
import { MdFileDownload } from "react-icons/md";

export const DataVisualizationFile = () => {
  const notyf = new Notyf();
  const [fileUploading, setFileUploading] = useState(false);
  const [filesData, setFilesData] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [deleting, setIsDeleting] = useState("");
  const [progress, setProgress] = useState();

  const handleFileUpload = async (e) => {
    e.preventDefault();
    console.log("Handle File Upload");
    const file = e.target.files[0];

    if (!file) {
      console.error("No file selected");
      return;
    }
    if (file.type !== "text/csv") {
      notyf.error("Please upload a CSV file.");
      return;
    }

    const maxFileSize = 30 * 1024 * 1024; // 30MB limit
    // if (file.size > maxFileSize) {
    //   notyf.error("File size exceeds 30MB limit.");
    //   return;
    // }

    console.log("File: ", file);
    setFileUploading(true);
    setProgress(0);

    try {
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
          file_name: response.data.file_data.file.file_name,
          file_id: response.data.file_id,
        };
        console.log("Response: ", response);
        setFilesData((prevFiles) => [
          ...prevFiles,
          response.data.file_data.file,
        ]);
        notyf.success("File uploaded successfully");
      } else {
        console.log("Error: ", response);
        notyf.error("Error: " + (response.data.message || "Upload failed"));
      }
    } catch (e) {
      notyf.error("Error: " + (e.response?.data?.detail || e.message));
    } finally {
      setFileUploading(false);
    }
  };

  const delete_file = async (file_id) => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `${backend_url}/forecasting/delete_file/${file_id}`,
        {
          headers: {
            Authentication: "Bearer " + localStorage.getItem("forcastToken"),
          },
        }
      );
      if (response.status !== 200) {
        notyf.error("Failed to delete file");
        return;
      }
      get_csv_file();
      notyf.success(response.data.message);
      setIsDeleting("");
    } catch (error) {
      notyf.error("Failed to delete file");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const get_csv_file = async () => {
    try {
      const response = await axios.get(`${backend_url}/forecasting/get-files`, {
        headers: {
          Authentication: "Bearer " + localStorage.getItem("forcastToken"),
        },
      });
      if (response.status !== 200) {
        notyf.error("Failed to fetch file data");
        return;
      }
      setFilesData(response.data.files);
    } catch (error) {
      notyf.error("An error occurred while fetching the file data");
      console.error(error);
    }
  };

  const handleFileClick = (file) => {
    setSelectedFileName(file.file_name);
  };

  useEffect(() => {
    get_csv_file();
  }, []);

  return (
    <div className="w-full h-full sm:pl-[7%] p-11">
      {fileUploading && (
        <div className="fixed top-0 left-0 right-0 text-white text-center z-50">
          <div className="flex justify-center items-center">
            <div className="relative w-full">
              <div
                className="bg-blue-600 h-1 rounded"
                style={{ width: `${progress}%` }}
              ></div>
              <span className="absolute left-1/2 transform -translate-x-1/2 text-sm font-bold">
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="upload-file w-full flex justify-end">
        <div className="bg-black flex justify-center px-4 py-2 rounded-3xl text-white w-[10%]">
          <label className="cursor-pointer text-white">
            {fileUploading ? "Uploading..." : "Upload File"}
            <input
              type="file"
              style={{ display: "none" }}
              onChange={handleFileUpload}
              disabled={fileUploading}
            />
          </label>
        </div>
      </div>
      <div className="br w-full mt-10 bg-opacity-10 h-0.5"></div>
      <div className="table-view w-full">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs uppercase py-10 border-b-2 bg-[#c5d6ea]">
              <tr>
                <th scope="col" className="px-6 py-4">
                  ID
                </th>
                <th scope="col" className="px-6 py-4">
                  File Name
                </th>
                <th scope="col" className="px-6 py-4">
                  Download
                </th>
                <th scope="col" className="px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filesData.map((file, index) => (
                <tr
                  key={file.id}
                  onClick={() => handleFileClick(file)}
                  className={`border-b border-gray-200 cursor-pointer ${
                    index % 2 === 0 ? "" : ""
                  }`}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 text-gray-900 whitespace-nowrap font-bold"
                  >
                    {file.id}
                  </th>
                  <td className="px-6 py-4">{file.file_name}</td>
                  <td className="px-6 py-4">
                    <a
                      href={`${backend_url}/forecasting/download_csv_file/${file.id}`}
                    >
                      <MdFileDownload size={"25"} style={{ fill: "green" }} />
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <div onClick={() => delete_file(file.id)}>
                      <MdDelete size={"25"} style={{ fill: "#f77d7e" }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {csvData.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold">Data from {selectedFileName}</h2>
          <table className="w-full border-separate border-spacing-2 mt-2">
            <thead>
              <tr>
                {Object.keys(csvData[0]).map((header) => (
                  <th key={header} className="border p-2">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((cell, cellIndex) => (
                    <td key={cellIndex} className="border p-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
