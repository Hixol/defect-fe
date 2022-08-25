import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { useRouter } from "next/router";
import Select from "react-select";
import Cookies from "js-cookie";
import axios from "axios";
import lodash from "lodash";
import moment from "moment";
import { InputField } from "../../../components/Form";
import Swal from "sweetalert2";
import ImageAndPdfViewer from './imageAndPdfViewer';

const UserModal = (props) => {
  const { data, updateRequestTable, handleUserDataUpdated, ...rest } = props;
  const {
    user,
    statusValues,
    billingTypeValues,
    priceTierValues,
    adminControlValues,
  } = data;
  const [userData, setUserData] = React.useState(null);
  const { addToast } = useToasts();
  const router = useRouter();
  const token = useSelector((state) => state.user.token);

  const [showPDFDetail, setShowPDFDetail] = useState(false);
  const [selectedFileBuffer, setSelectedFileBuffer] = useState('');

  const handlePDFViewerClose = () => {
    setShowPDFDetail(false);
    setSelectedFileBuffer('');
  };
  const handlePDFViewerShow = () => setShowPDFDetail(true);

  const onChangeHandler = (name, item) => {
    setUserData({ ...userData, [name]: item.value });
  };

  const updateButtonHandler = async () => {
    try {
      if (!token) {
        router.replace("/user/login");
        return;
      }
      const resp = await axios.post(
        `${process.env.API_URL}/admin/updateUserData`,
        { userId: user.id, ...userData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (resp.status === 200) {
        props.onClose();
        addToast(resp.data.message, { appearance: "success", autoDismiss: true });
        // updateRequestTable(username);
        handleUserDataUpdated();
      } else {
        props.onClose();
        addToast(`${resp.data.error ?? resp.data.errors[0]}`, {
          appearance: "error",
        });
      }
    } catch (error) {
      console.log(error.message);
      addToast(error.message, {
        appearance: "error",
      });
    }
  };

  const deleteButtonHandler = async () => {
    try {
      if (!token) {
        router.replace("/user/login");
        return;
      }
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#333",
        confirmButtonText: "Yes, delete it!",
      });
      if (result.isConfirmed) {
        const resp = await axios.delete(
          `${process.env.API_URL}/admin/deleteUser/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (resp.status === 200) {
          props.onClose();
          addToast(resp.data.message, { appearance: "success", autoDismiss: true });
          // props.updateRequestTable(username);
          handleUserDataUpdated();
        } else {
          props.onClose();
          addToast(`${resp.data.error ?? resp.data.errors[0]}`, {
            appearance: "error",
          });
        }
      }
    } catch (error) {
      console.log(error.message);
      addToast(error.message, {
        appearance: "error",
      });
    }
  };

  useEffect(() => {
    console.log("Use effect 1");
    if (user) {
      console.log("Use effect 2");
      setUserData({
        status: user.status,
        billingType: user.billingType,
        priceTier: user.priceTier,
        adminControl: user.adminControl,
      });
    }
  }, [user]);

  const handleShowImageOrPdfViewer = (value) => {
    setSelectedFileBuffer(value);
    handlePDFViewerShow();
  }

  return (
    <>
      <ImageAndPdfViewer
        show={showPDFDetail}
        onHide={handlePDFViewerClose}
        selectedFileBuffer={selectedFileBuffer}
      />
      <Modal
        {...rest}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Header closeButton style={{ borderBottom: "none" }}>
          <Modal.Title className="modal_title">
            {user && user.username}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="active-user-modal">
          <div className="profile-data">
            <div className="profile-pic">
              {user && (
                <img
                  src={`data:image/png;base64,${Buffer.from(
                    user.image_moh.data
                  ).toString("base64")}`}
                  alt="profile-picture"
                  height="125px"
                  onClick={() => handleShowImageOrPdfViewer(user.image_moh.data)}
                // width="100%"
                />
              )}
            </div>
            <div className="profile-details">
              {user && (
                <>
                  <span>
                    {lodash.capitalize(user.firstName)} {user.lastName}
                  </span>
                  <span>{user.email}</span>
                  <span>{user.phone}</span>
                  <span>{user.companyName}</span>
                  <span>{user.accountType}</span>
                </>
              )}
            </div>
          </div>
          <div className="profile-data">
            <div className="profile-pic">
              {user && (
                <img
                  src={`data:image/png;base64,${Buffer.from(
                    user.image_smc.data
                  ).toString("base64")}`}
                  alt="profile-picture"
                  height="125px"
                  width="125px"
                  onClick={() => handleShowImageOrPdfViewer(user.image_smc.data)}
                />
              )}
            </div>
            <div className="profile-pic">
              {user && (
                <img
                  src={`data:image/png;base64,${Buffer.from(
                    user.image_acra.data
                  ).toString("base64")}`}
                  alt="profile-picture"
                  height="125px"
                  width="125px"
                  onClick={() => handleShowImageOrPdfViewer(user.image_acra.data)}
                />
              )}
            </div>
          </div>
          <div className="data-fields">
            <div className="profile-input-fields">
              {user && (
                <>
                  {/* <div className="input-fields-group"> */}
                  <InputField
                    id="username"
                    required={false}
                    field="Username"
                    value={user.username}
                    readOnly={true}
                  />
                  <InputField
                    id="firstName"
                    required={false}
                    field="First Name"
                    value={user.firstName}
                    readOnly={true}
                  />
                  <InputField
                    id="lastName"
                    required={false}
                    field="Last Name"
                    value={user.lastName}
                    readOnly={true}
                  />
                  <InputField
                    id="nationality"
                    required={false}
                    field="Nationality"
                    value={user.nationality}
                    readOnly={true}
                  />
                  {/* </div> */}
                  {/* <div className="input-fields-group"> */}
                  <InputField
                    id="email"
                    required={false}
                    field="Email"
                    value={user.email}
                    readOnly={true}
                  />
                  <InputField
                    id="mobile"
                    required={false}
                    field="Mobile"
                    value={user.mobile}
                    readOnly={true}
                  />
                  <InputField
                    id="phone"
                    required={false}
                    field="Phone"
                    value={user.phone}
                    readOnly={true}
                  />
                  {/* </div> */}
                  {/* <div className="input-fields-group"> */}
                  <InputField
                    id="companyName"
                    required={false}
                    field="companyName"
                    value={user.companyName}
                    readOnly={true}
                  />
                  <InputField
                    id="companyAddress"
                    required={false}
                    field="companyAddress"
                    value={user.companyAddress}
                    readOnly={true}
                  />
                  <InputField
                    id="companyPostal"
                    required={false}
                    field="companyPostal"
                    value={user.companyPostal}
                    readOnly={true}
                  />
                  <InputField
                    id="countryIncorporation"
                    required={false}
                    field="companyPostal"
                    value={user.countryIncorporation}
                    readOnly={true}
                  />
                  {/* </div> */}
                  {/* <div className="input-fields-group"> */}
                  <InputField
                    id="accountType"
                    required={false}
                    field="accountType"
                    value={user.accountType}
                    readOnly={true}
                  />
                  <InputField
                    id="createdAt"
                    required={false}
                    field="createdAt"
                    value={moment(user.createdAt).format("DD/MM/YYYY hh:mm:ss")}
                    readOnly={true}
                  />
                  <InputField
                    id="lastLoginAt"
                    required={false}
                    field="lastLoginAt"
                    value={moment(user.lastLoginAt).format("DD/MM/YYYY hh:mm:ss")}
                    readOnly={true}
                  />
                  {/* </div> */}
                </>
              )}
            </div>
            {user && (
              <div className="select_fields">
                <div className="select_option">
                  <label htmlFor="billingType">Billing Type</label>
                  <Select
                    name="billingType"
                    options={billingTypeValues}
                    onChange={(e) => onChangeHandler("billingType", e)}
                    defaultValue={{
                      label: user.billingType,
                      value: user.billingType,
                    }}
                  />
                </div>
                <div className="select_option">
                  <label htmlFor="priceTier">Price Tier</label>
                  <Select
                    name="priceTier"
                    options={priceTierValues}
                    onChange={(e) => onChangeHandler("priceTier", e)}
                    defaultValue={{
                      label: user.priceTier,
                      value: user.priceTier,
                    }}
                  />
                </div>
                <div className="select_option">
                  <label htmlFor="adminControl">Admin Control</label>
                  <Select
                    name="adminControl"
                    options={adminControlValues}
                    onChange={(e) => onChangeHandler("adminControl", e)}
                    defaultValue={{
                      label: user.adminControl,
                      value: user.adminControl,
                    }}
                  />
                </div>
                <div className="select_option">
                  <label htmlFor="status">Status</label>
                  <Select
                    name="status"
                    options={statusValues}
                    onChange={(e) => onChangeHandler("status", e)}
                    defaultValue={{
                      label: user.status,
                      value: user.status,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="lezada-button lezada-button--medium"
            onClick={updateButtonHandler}
          >
            Update
          </button>
          <button
            className="lezada-button lezada-button--medium lezada-button--transparent-button"
            onClick={deleteButtonHandler}
          >
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserModal;
