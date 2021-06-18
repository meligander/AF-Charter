import React, { useRef, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { BiFileBlank, BiDownload } from "react-icons/bi";
import api from "../../../utils/api";

import PopUp from "../../modal/PopUp";

import "./style.scss";

const DropZone = ({ _id, clearImages }) => {
   const fileInputRef = useRef();
   const progressRef = useRef();
   const uploadRef = useRef();

   const [adminValues, setAdminValues] = useState({
      selectedFiles: [],
      errorMessages: [],
      fileIn: false,
      toggleModal: false,
      finished: false,
   });

   const { selectedFiles, errorMessages, fileIn, toggleModal, finished } =
      adminValues;

   const dragOver = (e) => {
      e.preventDefault();
      if (!fileIn) setAdminValues((prev) => ({ ...prev, fileIn: true }));
   };

   const dragLeave = (e) => {
      e.preventDefault();
      if (fileIn) setAdminValues((prev) => ({ ...prev, fileIn: false }));
   };

   const fileDrop = (e) => {
      e.preventDefault();
      //const file = e.target.files[0];
      const files = e.dataTransfer.files;
      if (files) handleFiles(files);
   };

   const filesSelected = (e) => {
      if (e.target.value) {
         const files = e.target.files;
         handleFiles(files);
      }
   };

   const fileInputClicked = () => {
      fileInputRef.current.click();
   };

   const handleFiles = (files) => {
      const validTypes = ["image/png", "image/jpeg", "image/gif"];

      let errorMessages =
         adminValues.errorMessages.length > 0
            ? [...adminValues.errorMessages, ...Array(files.length)]
            : new Array(files.length);

      for (var x = 0; x < files.length; x++) {
         const type = files[x].type;
         const name = files[x].name;
         const errorNum =
            adminValues.errorMessages.length > 0
               ? adminValues.errorMessages.length + x
               : x;

         switch (true) {
            case selectedFiles.some((file) => file.name === name):
               errorMessages[errorNum] = "File already on the list";
               break;
            case !validTypes.some((validType) => type === validType):
               errorMessages[errorNum] =
                  files[x].type + " is not a supported format\n";
               break;
            case files[x].size > 2000000:
               errorMessages[errorNum] =
                  "File too large, please pick a smaller one\n";
               break;
            default:
               break;
         }
      }

      setAdminValues((prev) => ({
         ...prev,
         selectedFiles:
            selectedFiles.length > 0
               ? [...selectedFiles, ...Array.from(files)]
               : Array.from(files),
         fileIn: false,
         finished: false,
         errorMessages,
      }));
   };

   const fileSize = (size) => {
      if (size === 0) {
         return "0 Bytes";
      }
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(size) / Math.log(k));
      return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
   };

   const fileType = (fileName) => {
      return fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
   };

   const removeFile = (i) => {
      selectedFiles.splice(i, 1);
      errorMessages.splice(i, 1);

      setAdminValues((prev) => ({
         ...prev,
         selectedFiles,
         errorMessages,
      }));
   };

   const setToggleModal = () => {
      setAdminValues((prev) => ({
         ...prev,
         toggleModal: !toggleModal,
      }));
   };

   const uploadFile = async () => {
      const data = new FormData();

      for (var x = 0; x < selectedFiles.length; x++) {
         data.append("file", selectedFiles[x]);
      }

      uploadRef.current.innerHTML = "Updating Images...";

      setAdminValues((prev) => ({
         ...prev,
         toggleModal: true,
      }));

      api.put(`/vessel/upload-images/${_id}`, data, {
         onUploadProgress: (progressEvent) => {
            let uploadPercentage = Math.floor(
               (progressEvent.loaded / progressEvent.total) * 100
            );
            progressRef.current.innerHTML = `<p>${uploadPercentage}%</p>`;
            progressRef.current.style.width = `${uploadPercentage}%`;
            progressRef.current.style.backgroundColor = "#05a6a6";

            if (uploadPercentage === 100) {
               uploadRef.current.innerHTML = "New Images Updated";
               setAdminValues((prev) => ({
                  ...prev,
                  selectedFiles: [],
                  finished: true,
               }));
            }
         },
      }).catch(() => {
         uploadRef.current.innerHTML = `<span class="up-popup-error">Images Upload Fail</span>`;
         progressRef.current.style.backgroundColor = "#b92525";
      });
   };

   return (
      <>
         <h4 className="heading-tertiary text-secondary py-3 mt-3">
            Upload New Images:
         </h4>
         <div className="row">
            <div className="drop">
               <div
                  className={`drop-container ${fileIn ? "lighter" : ""}`}
                  onDragLeave={dragLeave}
                  onDragOver={dragOver}
                  onDrop={fileDrop}
                  onClick={fileInputClicked}
               >
                  <div className="drop-container-message">
                     <BiDownload className="drop-container-icon" />
                     Drag and drop the files or click here to select them.
                  </div>
                  <input
                     ref={fileInputRef}
                     className="drop-container-file-input"
                     type="file"
                     onChange={filesSelected}
                  />
               </div>
               {selectedFiles.length > 0 && (
                  <div className="drop-file">
                     {selectedFiles.map((file, i) => (
                        <div
                           key={i}
                           className="drop-file-display"
                           onClick={() => errorMessages[i] && removeFile(i)}
                        >
                           <div className="drop-file-type">
                              <BiFileBlank />
                              <div className="drop-file-type-name">
                                 {fileType(file.name)}
                              </div>
                           </div>
                           <span
                              className={`drop-file-name ${
                                 errorMessages[i] ? "drop-file-error" : ""
                              }`}
                           >
                              {file.name} &nbsp; ({fileSize(file.size)})
                              {errorMessages[i] && (
                                 <span className="drop-file-error">
                                    ({errorMessages[i]})
                                 </span>
                              )}
                           </span>
                           <div
                              className="drop-file-remove"
                              onClick={() => removeFile(i)}
                           >
                              <IoMdCloseCircle />
                           </div>
                        </div>
                     ))}
                  </div>
               )}

               {selectedFiles.length > 0 && (
                  <>
                     {!errorMessages.some((item) => item) ? (
                        <div className="text-right">
                           <button
                              className="btn btn-primary"
                              onClick={() => uploadFile()}
                           >
                              Upload Files
                           </button>
                        </div>
                     ) : (
                        <p className="drop-error">
                           Please, remove the file or files not supported
                        </p>
                     )}
                  </>
               )}
            </div>

            <PopUp
               type="uploadFile"
               finished={finished}
               uploadRef={uploadRef}
               progressRef={progressRef}
               setToggleModal={setToggleModal}
               toggleModal={toggleModal}
               confirm={clearImages}
            />
         </div>
      </>
   );
};

export default DropZone;
