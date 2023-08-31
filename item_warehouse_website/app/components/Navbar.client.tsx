"use client";

import React from "react";
import PageSizeDropdown from "./PageSizeDropdown.client";
import { ItemsResponse, WarehouseType } from "../services/api";
import styles from "../styles/NavBar.module.scss";
import Paginator from "./Paginator.client";
import { Nav, Container, Navbar } from "react-bootstrap";

const NavBar: React.FC<{
  warehouse: WarehouseType;
  item_page: ItemsResponse;
  pageSize: string;
}> = ({ warehouse, item_page, pageSize }) => {
  return (
    <Navbar className={styles.navBar}>
      <Container fluid={true}>
        <Navbar.Collapse>
          <Nav className="me-auto mb-2 mb-lg-0">
            <h1 className="mb-0 mt-auto">{warehouse.name}</h1>
            <span className="mb-1 mt-auto ms-3 text-muted">
              {`Viewing ${item_page.count} of ${item_page.total} ${warehouse.item_name}s`}
            </span>
          </Nav>
          <Paginator
            currentPage={item_page.page}
            totalPages={Math.ceil(item_page.total / parseInt(pageSize))}
            warehouseName={warehouse.name}
          />
          <PageSizeDropdown
            currentPageSize={pageSize}
            warehouseName={warehouse.name}
          />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
