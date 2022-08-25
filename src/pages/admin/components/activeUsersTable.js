import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useToasts } from 'react-toast-notifications';
import { Spinner } from 'react-bootstrap';
import Table from '../../../components/Table';
import Modal from './activeUsersModal';
import moment from 'moment';
import axios from 'axios';
import { IoMdEye } from 'react-icons/io';

const ActiveUsersTable = ({ userDataUpdated, handleUserDataUpdated }) => {
  const [apiData, setApiData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    accountType: 0
  });

  const accounts = [
    { value: 0, label: 'All' },
    { value: 1, label: 'clinic' },
    { value: 2, label: 'vendor' }
  ];

  const [requestTableData, setRequestTableData] = useState({
    headers: [
      'No.',
      'Username',
      'Email',
      'Account Type',
      'Account Created At',
      'Last Login Time',
      'Action'
    ],
    data: []
  });
  const token = useSelector((state) => state.user.token);
  const { addToast } = useToasts();
  const router = useRouter();

  const handleShowModal = (user) => {
    setModalData((prev) => {
      return { ...prev, user: user };
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData({ ...modalData, user: null });
  };

  useEffect(() => {
    console.log('Active');
    setLoading(true);
    if (!token) {
      addToast('Unauthorized Request', { appearance: 'error' });
      setLoading(false);
      router.replace('/user/login');
      return;
    }
    axios
      .get(`${process.env.API_URL}/admin/usersList/Active`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((resp) => {
        const data = resp.data;
        if (resp.status >= 400) {
          console.log('Status error: ', resp.data);
          addToast(resp.data.error, { appearance: 'error' });
          setLoading(false);
        } else {
          setApiData(data);
        }
      })
      .catch((error) => {
        const errorMsg = error.response.data.error;
        if (errorMsg === 'Error parsing auth token') {
          addToast('Unauthorized Request', { appearance: 'error' });
          router.replace('/user/login');
          return;
        }
      });
  }, [userDataUpdated]);

  useEffect(() => {
    if (apiData.userList) {
      setModalData({
        ...modalData,
        statusValues: apiData.statusValues,
        billingTypeValues: apiData.billingTypeValues,
        priceTierValues: apiData.priceTierValues,
        adminControlValues: apiData.adminControlValues
      });
      const tableData = apiData.userList.map((item, userNo) => ({
        no: userNo + 1,
        username: item.username,
        email: item.email,
        accountType: item.accountType,
        createdAt: moment(item.createdAt).format('DD/MM/YYYY hh:mm:ss'),
        lastLoginAt: moment(item.lastLoginAt).format('DD/MM/YYYY hh:mm:ss'),
        action: (
          <IoMdEye
            style={{ cursor: 'pointer' }}
            onClick={() => {
              handleShowModal(item);
            }}
          />
        )
      }));
      setRequestTableData({ ...requestTableData, data: tableData });
      setLoading(false);
    }
  }, [apiData]);

  if (loading) {
    return (
      <div className="loader_container">
        <Spinner animation="border" />
      </div>
    );
  }

  const onChangeFilters = ({ accountType }) => {
    let filterData;
    //console.log("hreer : ", accountType);
    //console.log(apiData);
    if (accountType == 0) {
      filterData = apiData.userList;
    } else if (accountType == 1) {
      filterData = apiData.userList.filter(
        (item) => item.accountType == 'clinic'
      );
    } else if (accountType == 2) {
      filterData = apiData.userList.filter(
        (item) => item.accountType == 'vendor'
      );
    }
    //console.log(filterData);

    const tableData = filterData.map((item, userNo) => ({
      no: userNo + 1,
      username: item.username,
      email: item.email,
      accountType: item.accountType,
      createdAt: moment(item.createdAt).format('DD/MM/YYYY hh:mm:ss'),
      lastLoginAt: moment(item.lastLoginAt).format('DD/MM/YYYY hh:mm:ss'),
      action: (
        <IoMdEye
          style={{ cursor: 'pointer' }}
          onClick={() => {
            handleShowModal(item);
          }}
        />
      )
    }));
    setRequestTableData({ ...requestTableData, data: tableData });
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        data={modalData}
        onClose={handleCloseModal}
        handleUserDataUpdated={handleUserDataUpdated}
      />
      <div>
        <div className="my-account-area__content">
          {requestTableData.data.length === 0 ? (
            <h4>No active users</h4>
          ) : (
            <>
              <h3>Active Users</h3>
              <div className="single-icon filter-dropdown">
                <label htmlFor="accountType" className="required">
                  Account Type :
                </label>
                <select
                  style={{ height: '100%', minWidth: '120px' }}
                  value={filterOptions?.accountType}
                  onChange={(e) => {
                    onChangeFilters({
                      ...filterOptions,
                      accountType: e.target.value
                    });
                    setFilterOptions({
                      ...filterOptions,
                      accountType: e.target.value
                    });
                  }}
                >
                  {accounts.map((item) => (
                    <option value={item.value}>{item.label}</option>
                  ))}
                </select>
              </div>
              <div className="myaccount-table table-responsive text-center">
                <Table
                  headers={requestTableData.headers}
                  data={requestTableData.data}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ActiveUsersTable;
