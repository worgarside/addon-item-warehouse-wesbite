"use client";

import React, { useState } from "react";
import styles from "styles/Settings/SettingsModal.module.scss";
import sidebarStyles from "styles/Sidebar.module.scss";
import Icon from "@mdi/react";
import { mdiClose, mdiTune } from "@mdi/js";
import { Button, Col, ListGroup, Modal, Nav, Tab } from "react-bootstrap";
import { useSettings } from "./SettingsContext.client";
import { WarehousePanel } from "./WarehousePanel/WarehousePanel.client";
import { SettingsPanel } from "./SettingsPanel.client";

const SettingsModal: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const [show, setShow] = useState(false);
  const {
    warehouses,
    warehouseRefreshCount,
    darkMode,
    showTooltip,
    showActionsColumn,
    toggleDarkMode,
    toggleShowTooltip,
    toggleShowActionsColumn,
    setDisplayAsOption,
    updateWarehouseColumnOrder,
    warehouseColumnOrderConfigs,
    warehouseColumnExclusions,
    updateWarehouseColumnExclusions,
  } = useSettings();

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  return (
    <>
      <ListGroup className={`list-group-flush mt-auto ${styles.settings}`}>
        <ListGroup.Item
          key="settings"
          active={false}
          className={`
            d-flex
            flex-nowrap 
            list-group-item 
            list-group-item-action 
            ${sidebarStyles.warehouseItem}
            ${isCollapsed ? sidebarStyles.collapsed : null} 
          `}
          onClick={handleShow}
        >
          <Col xs="auto">
            <Icon
              className={`flex-shrink-0 ${sidebarStyles.warehouseIcon}`}
              path={mdiTune}
              size={1}
            />
          </Col>

          <Col
            className={`
              ps-2 
              ${sidebarStyles.warehouseItemNameCol} 
              ${isCollapsed ? sidebarStyles.collapsed : null}
            `}
          >
            Settings
          </Col>
        </ListGroup.Item>
      </ListGroup>

      <Modal
        className="overflow-hidden"
        show={show}
        onHide={handleClose}
        centered
        size="xl"
      >
        <Modal.Header>
          <Modal.Title>
            <h3 className="my-auto">Settings</h3>
          </Modal.Title>
          <div className="flex-grow-1"></div>
          <Button onClick={handleClose} className={styles.button}>
            <Icon path={mdiClose} size={1} className={styles.icon} />
          </Button>
        </Modal.Header>
        <Modal.Body
          className={`${styles.modalBody} pt-2 pb-0 d-flex flex-column`}
        >
          <Tab.Container id="settings-tabs" defaultActiveKey="general">
            <Nav variant="tabs" className="flex-row">
              <Nav.Item>
                <Nav.Link eventKey="general">General</Nav.Link>
              </Nav.Item>
              {warehouses.map((warehouse) => (
                <Nav.Item key={`tab-${warehouse.name}`}>
                  <Nav.Link eventKey={warehouse.name}>
                    {warehouse.name}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
            <Tab.Content className={`flex-grow-1 overflow-y-scroll`}>
              <Tab.Pane eventKey="general">
                <SettingsPanel
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  showTooltip={showTooltip}
                  toggleShowTooltip={toggleShowTooltip}
                  showActionsColumn={showActionsColumn}
                  toggleShowActionsColumn={toggleShowActionsColumn}
                />
              </Tab.Pane>

              {warehouses.map((warehouse) => (
                <Tab.Pane
                  eventKey={warehouse.name}
                  key={`pane-${warehouse.name}-${warehouseRefreshCount}`}
                  className={`flex-grow-1`}
                >
                  <WarehousePanel
                    warehouse={warehouse}
                    warehouseRefreshCount={warehouseRefreshCount}
                    setDisplayAsOption={setDisplayAsOption}
                    updateWarehouseColumnOrder={updateWarehouseColumnOrder}
                    warehouseColumnOrder={
                      warehouseColumnOrderConfigs[warehouse.name] ||
                      Object.keys(warehouse.item_schema)
                    }
                    columnExclusions={
                      warehouseColumnExclusions[warehouse.name] || []
                    }
                    updateWarehouseColumnExclusions={
                      updateWarehouseColumnExclusions
                    }
                  />
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Tab.Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SettingsModal;
