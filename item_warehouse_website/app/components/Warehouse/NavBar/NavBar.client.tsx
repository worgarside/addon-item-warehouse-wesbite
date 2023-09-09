"use client";

import React from "react";
import PageSizeDropdown from "./PageSizeDropdown.client";
import styles from "../../../styles/NavBar.module.scss";
import Paginator from "./Paginator.client";
import { Nav, Container, Navbar } from "react-bootstrap";

interface NavBarProps {
  pageSize: string;
  currentPage: number;
  itemCount: number;
  itemTotal: number;
  itemName: string;
  warehouseName: string;
}

const NavBar: React.FC<NavBarProps> = ({
  itemCount,
  itemTotal,
  pageSize,
  currentPage,
  itemName,
  warehouseName,
}) => {
  return (
    <Navbar className={styles.navBar}>
      <Container fluid={true}>
        <Navbar.Collapse>
          <Nav className="me-auto mb-2 mb-lg-0 user-select-none">
            <h1 className="mb-0 mt-auto">{warehouseName}</h1>
            <span className="mb-1 mt-auto ms-3 text-muted">
              {`Viewing ${itemCount} of ${itemTotal} ${itemName}s`}
            </span>
          </Nav>
          <Paginator
            currentPage={currentPage}
            totalPages={Math.ceil(itemTotal / parseInt(pageSize))}
            warehouseName={warehouseName}
          />
          <PageSizeDropdown
            currentPageSize={pageSize}
            warehouseName={warehouseName}
          />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
