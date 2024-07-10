// components/UserProfileCard.js
import { useState } from "react";

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Check if the number of selected files exceeds the limit
    if (files.length + selectedFiles.length > 5) {
      setErrorMessage("You can only upload up to 5 files.");
      return;
    }

    // Filter files to only allow PDF, DOCX, and TXT formats
    const allowedFileTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    const filteredFiles = files.filter((file) =>
      allowedFileTypes.includes(file.type)
    );

    setSelectedFiles((prevFiles) => [...prevFiles, ...filteredFiles]);
    setErrorMessage("");
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleUploadFiles = () => {
    // Implement your upload logic here
    console.log("Uploading files:", selectedFiles);
    // Reset selected files after upload

    setSelectedFiles([]);
  };

  return (
    <div className="w-80 items-center justify-center text-center">
      <div className="inline-block transform overflow-hidden rounded-lg  text-left align-bottom  transition-all">
        <div className="sm:flex sm:items-start">
          <div className=" mb-10  text-center">
            <h1 className="text-primary mb-10 text-2xl font-bold">
              Upload Files
            </h1>
            <div className="mt-5 ">
              <input
                type="file"
                multiple
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="side-menu-item btn inline-flex cursor-pointer items-center justify-center hover:bg-emerald-600"
              >
                Select Files
              </label>
              {errorMessage && (
                <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
              )}
            </div>
            {selectedFiles.length > 0 && (
              <div className="mt-5">
                <h4 className="text-primary my-5 text-lg font-medium leading-6">
                  Selected Files ({selectedFiles.length}):
                </h4>
                <ul className="text-primary mt-2 text-sm">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="my-2 flex items-center justify-between"
                    >
                      <span>{file.name}</span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="ml-3 text-red-600 hover:text-red-700 focus:outline-none focus:ring"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedFiles.length > 0 && (
        <div className="mt-1 p-4">
          <button
            onClick={handleUploadFiles}
            type="button"
            // disabled={selectedFiles.length === 0}
            className=" btn inline-flex w-full cursor-pointer items-center justify-center hover:bg-emerald-600"
          >
            Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
