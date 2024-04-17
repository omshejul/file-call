"use client";
import { useState } from "react";
import axios from "axios"; // Import Axios

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState(null); // State to store the upload response

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const uploadFile = async (file) => {
    const params = new FormData();
    params.append("audios", file);
    params.append("client_id", "1");
    params.append("language", "en");

    const uploadUrl =
      // "http://127.0.0.1:1880/zip";
      "https://dev.assisto.tech/conv_scorer/scorers";

    setLoading(true); // Set loading true before the request

    try {
      setUploadResponse(null); // Reset the response state before the request
      const response = await axios.post(uploadUrl, params, {
        timeout: 600000, // Set timeout to 600000 milliseconds (10 minutes)
      });

      console.log("Upload successful:", response.data);
      setUploadResponse(response.data); // Store the response in state
      return response.data;
    } catch (error) {
      console.error("Failed to upload file:", error);
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.log("Error message:", error.message);
      }
      setUploadResponse({ error: error.message });
    } finally {
      setLoading(false); // Reset loading state after the request
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (file) {
      await uploadFile(file);
    } else {
      alert("No file selected");
      console.log("No file selected");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          className="border border-neutral-500 p-2 m-2 rounded-lg"
          type="file"
          onChange={handleFileChange}
        />
        <button
          type="disabled"
          className={`mt-4 px-4 py-2 ${loading ? "bg-gray-500" : "bg-blue-500"} bg-blue-500 text-white rounded`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </form>
      {/* Conditionally render the response div only if there is a response */}
      {uploadResponse && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-lg font-bold">Upload Response:</h3>
          <pre>{JSON.stringify(uploadResponse, null, 2)}</pre>{" "}
          {/* Display the response data prettily */}
        </div>
      )}
    </main>
  );
}
