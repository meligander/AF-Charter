import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import moment from "moment";
import { withRouter, Link } from "react-router-dom";
import { FaUserPlus, FaUserAlt } from "react-icons/fa";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BiMailSend, BiSave } from "react-icons/bi";
import PropTypes from "prop-types";

import { signup, removeAuthError } from "../../../actions/auth";
import {
   loadUser,
   registerUpdateUser,
   removeUserError,
} from "../../../actions/user";

import Alert from "../../shared/Alert";

import "./style.scss";

const EditUser = ({
   auth: { loggedUser, isAuthenticated, loading, emailSent, error },
   users: { user, loadingUser, error: userError },
   location,
   match,
   signup,
   loadUser,
   registerUpdateUser,
   removeUserError,
   removeAuthError,
}) => {
   const isAdmin =
      loggedUser &&
      (loggedUser.type === "admin" || loggedUser.type === "admin&captain");
   const _id = match.params.user_id;
   let adminType = location.pathname.replace("/", "");

   if (_id) adminType = adminType.replace(`/${_id}`, "");

   const [formData, setFormData] = useState({
      name: "",
      lastname: "",
      email: "",
      password: "",
      passwordConf: "",
      cel: {
         countryCode: "",
         areaCode: "",
         phoneNumb: "",
      },
      type: "",
      address: "",
      dob: "",
      img: "",
      active: true,
   });

   const [adminValues, setAdminValues] = useState({
      previewSource: "",
      fileInputState: "",
      selectedFile: "",
   });

   const {
      name,
      lastname,
      email,
      password,
      cel: { countryCode, areaCode, phoneNumb },
      type,
      address,
      dob,
      img,
      passwordConf,
      active,
   } = formData;

   const { previewSource, fileInputState, selectedFile } = adminValues;

   useEffect(() => {
      if (adminType === "profile" || adminType === "edit-user") {
         let userLoaded;

         if (_id) {
            if (loadingUser) loadUser(_id);
            else userLoaded = user;
         } else if (!loading) userLoaded = loggedUser;

         if (userLoaded) {
            setFormData((prev) => ({
               ...prev,
               name: userLoaded.name,
               lastname: userLoaded.lastname,
               type: userLoaded.type,
               email: userLoaded.email,
               active: userLoaded.active,
               ...(userLoaded.address && { address: userLoaded.address }),
               ...(userLoaded.dob && {
                  dob: moment(userLoaded.dob).utc().format("YYYY-MM-DD"),
               }),
               cel: {
                  ...prev.cel,
                  ...(userLoaded.cel.areaCode && {
                     countryCode: userLoaded.cel.countryCode,
                  }),
                  ...(userLoaded.cel.areaCode && {
                     areaCode: userLoaded.cel.areaCode,
                  }),
                  ...(userLoaded.cel.phoneNumb && {
                     phoneNumb: userLoaded.cel.phoneNumb,
                  }),
               },
            }));
            if (userLoaded.img && userLoaded.img.fileName !== "")
               setAdminValues((prev) => ({
                  ...prev,
                  previewSource: userLoaded.img.filePath,
                  fileInputState: true,
               }));
         }
      }
   }, [loading, loggedUser, loadingUser, user, _id, adminType, loadUser]);

   const header = () => {
      switch (adminType) {
         case "signup":
         case "new-user":
            return (
               <>
                  <FaUserPlus className="heading-icon" />
                  &nbsp;New account
               </>
            );
         case "profile":
            return (
               <>
                  <FaUserAlt className="heading-icon" />
                  &nbsp;My Profile
               </>
            );
         default:
            return (
               <>
                  <FaUserAlt className="heading-icon" />
                  &nbsp;User's Profile
               </>
            );
      }
   };

   const onChange = (e) => {
      setFormData((prev) => ({
         ...prev,
         ...(e.target.name === "cel"
            ? {
                 cel: {
                    ...prev.cel,
                    [e.target.id]: e.target.value,
                 },
              }
            : e.target.name === "active"
            ? { active: !active }
            : { [e.target.id]: e.target.value }),
      }));

      if (
         (error.constructor === Array && error.length > 0) ||
         (userError.constructor === Array && userError.length > 0)
      )
         adminType === "signup"
            ? removeAuthError(e.target.id)
            : removeUserError(e.target.id);
   };

   const onChangeImg = (e) => {
      if (e.target.value) {
         const file = e.target.files[0];
         previewFile(file, e.target.value);
      }
   };

   const previewFile = (file, state) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
         setAdminValues((prev) => ({
            ...prev,
            previewSource: reader.result,
            selectedFile: file,
            fileInputState: state,
         }));
      };
   };

   const saveUser = async (e) => {
      e.preventDefault();

      const uploadImg = new FormData();
      if (selectedFile !== "")
         uploadImg.append("file", selectedFile, selectedFile.name);

      const data = {
         ...formData,
         ...(selectedFile !== "" && {
            img: selectedFile.name,
            formImg: uploadImg,
         }),
      };

      if (adminType === "signup") signup(data);
      else
         registerUpdateUser(
            data,
            adminType === "profile" ? loggedUser._id : _id && _id,
            adminType === "profile",
            isAdmin
         );
   };

   return (
      (!isAuthenticated || !loading) && (
         <div className="user">
            <h2 className="heading heading-primary">{header()}</h2>
            {!emailSent ? (
               <>
                  <Alert type="2" />
                  <form className="form py-5" onSubmit={saveUser}>
                     <div className="form-img">
                        <img
                           className="form-img-prev"
                           src={
                              previewSource !== ""
                                 ? previewSource
                                 : img.filePath
                                 ? img.filePath
                                 : "https://pngimage.net/wp-content/uploads/2018/06/no-user-image-png-3-300x200.png"
                           }
                           alt="chosen img"
                        />
                        <div
                           className={`form-img-file ${
                              fileInputState ? "success" : ""
                           }`}
                        >
                           <input
                              type="file"
                              onChange={onChangeImg}
                              className="form-img-file-upl"
                           />
                           <span>
                              <AiOutlineCloudUpload className="form-img-icon" />
                              &nbsp; Upload Image
                           </span>
                        </div>
                     </div>
                     <div className="user-name">
                        <div className="form-group half">
                           <input
                              type="text"
                              placeholder="Name"
                              id="name"
                              onChange={onChange}
                              value={name}
                              className={`form-input ${
                                 (error.constructor === Array &&
                                    error.some(
                                       (value) => value.param === "name"
                                    )) ||
                                 (userError.constructor === Array &&
                                    userError.some(
                                       (value) => value.param === "name"
                                    ))
                                    ? "invalid"
                                    : ""
                              }`}
                           />
                           <label
                              htmlFor="name"
                              className={`form-label ${
                                 name === "" ? "lbl" : ""
                              }`}
                           >
                              Name
                           </label>
                        </div>
                        <div className="form-group half">
                           <input
                              type="text"
                              placeholder="Lastname"
                              value={lastname}
                              onChange={onChange}
                              id="lastname"
                              className={`form-input ${
                                 (error.constructor === Array &&
                                    error.some(
                                       (value) => value.param === "lastname"
                                    )) ||
                                 (userError.constructor === Array &&
                                    userError.some(
                                       (value) => value.param === "lastname"
                                    ))
                                    ? "invalid"
                                    : ""
                              }`}
                           />

                           <label
                              htmlFor="lastname"
                              className={`form-label ${
                                 lastname === "" ? "lbl" : ""
                              }`}
                           >
                              Lastname
                           </label>
                        </div>
                     </div>
                     <div className="form-group">
                        <input
                           className={`form-input ${
                              (error.constructor === Array &&
                                 error.some(
                                    (value) => value.param === "email"
                                 )) ||
                              (userError.constructor === Array &&
                                 userError.some(
                                    (value) => value.param === "email"
                                 ))
                                 ? "invalid"
                                 : ""
                           }`}
                           type="text"
                           value={email}
                           id="email"
                           disabled={adminType === "profile" && !isAdmin}
                           onChange={onChange}
                           placeholder="Email"
                        />
                        <label htmlFor="email" className="form-label">
                           Email
                        </label>
                     </div>
                     {isAdmin && (
                        <div className="form-group">
                           <select
                              className="form-input"
                              name="type"
                              id="type"
                              value={type}
                              onChange={onChange}
                           >
                              <option value="">* Select user type</option>
                              <option value="admin">Admin</option>
                              <option value="admin&captain">
                                 Admin and Captain
                              </option>
                              <option value="captain">Captain</option>
                              <option value="customer">Customer</option>
                              <option value="mate">Mate</option>
                              <option value="mechanic">Mechanic</option>
                           </select>
                           <label
                              htmlFor="type"
                              className={`form-label ${
                                 type === "" ? "lbl" : ""
                              }`}
                           >
                              User Type
                           </label>
                        </div>
                     )}
                     {adminType === "signup" && (
                        <>
                           <div className="form-group">
                              <input
                                 className={`form-input ${
                                    (error.constructor === Array &&
                                       error.some(
                                          (value) => value.param === "password"
                                       )) ||
                                    (userError.constructor === Array &&
                                       userError.some(
                                          (value) => value.param === "password"
                                       ))
                                       ? "invalid"
                                       : ""
                                 }`}
                                 autoComplete="new-password"
                                 id="password"
                                 type="password"
                                 value={password}
                                 placeholder="Password"
                                 onChange={onChange}
                              />
                              <label htmlFor="password" className="form-label">
                                 Password
                              </label>
                           </div>
                           <div className="form-group">
                              <input
                                 className={`form-input ${
                                    (error.constructor === Array &&
                                       error.some(
                                          (value) =>
                                             value.param === "passwordConf"
                                       )) ||
                                    (userError.constructor === Array &&
                                       userError.some(
                                          (value) =>
                                             value.param === "passwordConf"
                                       ))
                                       ? "invalid"
                                       : ""
                                 }`}
                                 id="passwordConf"
                                 type="password"
                                 value={passwordConf}
                                 placeholder="Confirm Password"
                                 onChange={onChange}
                              />
                              <label
                                 htmlFor="passwordConf"
                                 className="form-label"
                              >
                                 Confirm Password
                              </label>
                           </div>
                        </>
                     )}
                     <div className="form-group">
                        <input
                           className="form-input"
                           type="text"
                           value={address}
                           onChange={onChange}
                           id="address"
                           placeholder="Address"
                        />
                        <label htmlFor="address" className="form-label">
                           Address
                        </label>
                     </div>

                     {isAdmin && loggedUser && loggedUser.type !== "customer" && (
                        <div className="form-group">
                           <input
                              className="form-input"
                              type="date"
                              value={dob}
                              onChange={onChange}
                              id="dob"
                           />
                           <label htmlFor="dob" className="form-label-show">
                              DOB
                           </label>
                        </div>
                     )}
                     <div className="form-group-phone">
                        <div className="form-group-phone-section">
                           <label
                              htmlFor="countryCode"
                              className="form-label-show"
                           >
                              C<span className="hide-sm">ountry</span> Code
                           </label>
                           <input
                              name="cel"
                              className="form-input"
                              type="number"
                              id="countryCode"
                              placeholder={+1}
                              value={countryCode}
                              onChange={onChange}
                           />
                        </div>
                        <div className="form-group-phone-section">
                           <label
                              htmlFor="areaCode"
                              className="form-label-show"
                           >
                              Area Code
                           </label>
                           <input
                              name="cel"
                              className="form-input"
                              type="number"
                              id="areaCode"
                              placeholder={800}
                              value={areaCode}
                              onChange={onChange}
                           />
                        </div>
                        <div className="form-group-phone-section">
                           <label
                              htmlFor="phoneNumb"
                              className="form-label-show"
                           >
                              Phone Number
                           </label>
                           <input
                              name="cel"
                              className="form-input"
                              type="number"
                              id="phoneNumb"
                              placeholder={8000000}
                              value={phoneNumb}
                              onChange={onChange}
                           />
                        </div>
                     </div>
                     <label className="form-label-show">Cellphone</label>

                     {isAdmin && (
                        <div className="form-group checkbox-group">
                           <input
                              className="form-input-checkbox"
                              type="checkbox"
                              value={active}
                              onChange={onChange}
                              checked={active}
                              name="active"
                              id="active"
                           />
                           <label
                              className="form-lbl-checkbox"
                              htmlFor="active"
                           >
                              Active
                           </label>
                        </div>
                     )}

                     <div className="btn-center">
                        <button className="btn btn-primary" type="submit">
                           {adminType === "signup" ? (
                              "Sign Up"
                           ) : (
                              <BiSave className="icon" />
                           )}
                        </button>
                        {adminType === "signup" && (
                           <p className="user-login">
                              Do you already have an account? &nbsp;
                              <Link className="btn-text" to="/login">
                                 Login
                              </Link>
                           </p>
                        )}
                     </div>
                  </form>
               </>
            ) : (
               <div className="user-email text-center">
                  <div>
                     <BiMailSend className="user-email-icon" />
                     <p className="user-email-text">
                        We've sent an email to {email}.
                        <br />
                        Click the confirmation link in that email to begin using
                        our servicies.
                     </p>
                     <p className="user-email-text-smaller">
                        If you did not recieve the email,
                     </p>
                     <button
                        type="button"
                        onClick={saveUser}
                        className="btn-text"
                     >
                        resend another email
                     </button>
                     <p className="user-email-text-smaller">
                        Check the spam folder to be sure it was not sent.
                     </p>
                  </div>
               </div>
            )}
         </div>
      )
   );
};

EditUser.propTypes = {
   auth: PropTypes.object.isRequired,
   users: PropTypes.object.isRequired,
   signup: PropTypes.func.isRequired,
   removeAuthError: PropTypes.func.isRequired,
   registerUpdateUser: PropTypes.func.isRequired,
   removeUserError: PropTypes.func.isRequired,
   loadUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
   users: state.users,
});

export default connect(mapStateToProps, {
   signup,
   removeAuthError,
   registerUpdateUser,
   removeUserError,
   loadUser,
})(withRouter(EditUser));
