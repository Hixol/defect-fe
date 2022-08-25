import React, { useState, useEffect } from "react";
import Link from "next/link";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import { Container, Row, Col } from "react-bootstrap";
import { FaCloudDownloadAlt, FaRegEdit } from "react-icons/fa";
import { LayoutTwo } from "../../components/Layout";
import { BreadcrumbOne } from "../../components/Breadcrumb";
import withAuth from "../../hoc/withAuth";
import PendingUsersTable from "./components/pendingUsersTable";
import ActiveUsersTable from "./components/activeUsersTable";


const Dashboard = () => {
  const [userDataUpdated, setUserDataUpdated] = useState(false);

  const handleUserDataUpdated = () => {
    setUserDataUpdated(!userDataUpdated);
  };

  

  return (
    <LayoutTwo>
      {/* breadcrumb */}
      <BreadcrumbOne
        pageTitle="Dashboard"
        backgroundImage="/assets/images/backgrounds/breadcrumb-bg-2.jpg"
      >
        <ul className="breadcrumb__list">
          <li>
            <Link href="/admin/dashboard" as={process.env.PUBLIC_URL + "/"}>
              <a>Admin</a>
            </Link>
          </li>

          <li>Dashboard</li>
        </ul>
      </BreadcrumbOne>
      <div className="my-account-area space-mt--r130 space-mb--r130">
        <Container>
          <Tab.Container defaultActiveKey="dashboard">
            <Nav
              variant="pills"
              className="my-account-area__navigation space-mb--r60"
            >
              {/*
              <Nav.Item>
                <Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
              </Nav.Item>
              */}
              <Nav.Item>
                <Nav.Link eventKey="newRequests">New Requests</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="activeUsers">Active Users</Nav.Link>
              </Nav.Item>
              
              
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="newRequests">
                <PendingUsersTable
                  userDataUpdated={userDataUpdated}
                  handleUserDataUpdated={handleUserDataUpdated}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="activeUsers">
                <ActiveUsersTable
                  userDataUpdated={userDataUpdated}
                  handleUserDataUpdated={handleUserDataUpdated}
                />
              </Tab.Pane>
              
              <Tab.Pane eventKey="dashboard">
              </Tab.Pane>
              
            </Tab.Content>
          </Tab.Container>
        </Container>
      </div>
    </LayoutTwo>
  );
};

export default withAuth(Dashboard);
