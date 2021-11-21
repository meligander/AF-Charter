import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FiEdit } from "react-icons/fi";
import { MdSearch } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";
import { BiPlus } from "react-icons/bi";

import { loadUsers, clearUser, deleteUser } from "../../../actions/user";

import PopUp from "../../modal/PopUp";
import Alert from "../../shared/Alert";

const VesselsList = ({
   users: { users, loading, error },
   loadUsers,
   clearUser,
   deleteUser,
}) => {
   const [formData, setFormData] = useState({
      name: "",
      lastname: "",
      type: "",
      active: true,
   });

   const [adminValues, setAdminValues] = useState({
      modalDelete: false,
      toDelete: "",
   });

   const { name, lastname, type, active } = formData;

   const { modalDelete, toDelete } = adminValues;

   useEffect(() => {
      if (loading) loadUsers({ active: true }, true);
   }, [loading, loadUsers]);

   const onChange = (e) => {
      setFormData((prev) => ({
         ...prev,
         [e.target.name]: e.target.id ? e.target.checked : e.target.value,
      }));
   };

   const onSubmit = (e) => {
      e.preventDefault();
      loadUsers(formData, true);
   };

   return (
      <>
         <PopUp
            text="Are you sure you want to delete the user?"
            type="confirmation"
            confirm={() => deleteUser(toDelete)}
            toggleModal={modalDelete}
            setToggleModal={() =>
               setAdminValues((prev) => ({
                  ...prev,
                  modalDelete: !modalDelete,
               }))
            }
         />
         <h2 className="heading heading-primary text-primary">Users</h2>

         <Alert type="2" />
         <form className="form filter" onSubmit={onSubmit}>
            <p className="heading-tertiary text-secondary">Filter</p>
            <div className="form-group">
               <div className="two-in-row">
                  <input
                     className="form-input"
                     type="text"
                     name="name"
                     placeholder="Name"
                     value={name}
                     onChange={onChange}
                  />
                  <input
                     className="form-input"
                     type="text"
                     name="lastname"
                     placeholder="Lastname"
                     value={lastname}
                     onChange={onChange}
                  />
               </div>
               <div className="two-in-row">
                  <label className={`form-label ${name === "" ? "lbl" : ""}`}>
                     Name
                  </label>
                  <label
                     className={`form-label ${lastname === "" ? "lbl" : ""}`}
                  >
                     Lastname
                  </label>
               </div>
            </div>
            <div className="form-group">
               <select
                  className="form-input"
                  name="type"
                  value={type}
                  onChange={onChange}
               >
                  <option value="">* Select user type</option>
                  <option value="admin">Admin</option>
                  <option value="captain">Captain</option>
                  <option value="customer">Customer</option>
                  <option value="mate">Mate</option>
                  <option value="mechanic">Mechanic</option>
               </select>
               <label
                  htmlFor="type"
                  className={`form-label ${type === "" ? "lbl" : ""}`}
               >
                  User Type
               </label>
            </div>
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
               <label className="form-lbl-checkbox" htmlFor="active">
                  Active
               </label>
            </div>
            <div className="btn-right">
               <button type="submit" className="btn btn-secondary">
                  <MdSearch className="icon" />
               </button>
            </div>
         </form>
         {!loading && (
            <>
               {users.length > 0 ? (
                  <div className="wrapper">
                     <table className="stick icon-4">
                        <thead>
                           <tr>
                              <th>Name</th>
                              <th>Type</th>
                              <th>Email</th>
                              <th></th>
                              <th></th>
                           </tr>
                        </thead>
                        <tbody>
                           {users.map((user) => (
                              <tr key={user._id}>
                                 <td>{`${user.name} ${user.lastname}`}</td>
                                 <td>
                                    {user.type === "admin&captain"
                                       ? "Admin/Captain"
                                       : user.type[0].toUpperCase() +
                                         user.type.substring(1)}
                                 </td>
                                 <td>{user.email}</td>
                                 <td>
                                    <Link
                                       className="btn-text secondary"
                                       to={`/edit-user/${user._id}`}
                                       onClick={() => {
                                          window.scroll(0, 0);
                                          clearUser();
                                       }}
                                    >
                                       <FiEdit />
                                    </Link>
                                 </td>
                                 <td>
                                    <button
                                       type="button"
                                       className="btn-text danger"
                                       onClick={() =>
                                          setAdminValues((prev) => ({
                                             ...prev,
                                             modalDelete: !modalDelete,
                                             toDelete: user._id,
                                          }))
                                       }
                                    >
                                       <AiOutlineDelete />
                                    </button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               ) : (
                  <h3 className="heading-secondary text-danger text-center py-5">
                     {error.msg}
                  </h3>
               )}
               <div className="btn-right">
                  <Link to="/new-user" className="btn btn-primary">
                     <BiPlus className="icon" /> User
                  </Link>
               </div>
            </>
         )}
      </>
   );
};

VesselsList.propTypes = {
   users: PropTypes.object.isRequired,
   loadUsers: PropTypes.func.isRequired,
   clearUser: PropTypes.func.isRequired,
   deleteUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   users: state.users,
});

export default connect(mapStateToProps, {
   loadUsers,
   deleteUser,
   clearUser,
})(VesselsList);
