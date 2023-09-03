"use client";

import React, { useState } from "react";
import styles from "../styles/SettingsModal.module.scss";
import sidebarStyles from "../styles/Sidebar.module.scss";
import Icon from "@mdi/react";
import { mdiClose, mdiRestart, mdiTune } from "@mdi/js";
import {
  Button,
  Col,
  Container,
  Form,
  ListGroup,
  Modal,
  Nav,
  Row,
  Tab,
} from "react-bootstrap";
import { useSettings } from "./SettingsContext.client";
import {
  WarehouseSchemaProperty,
  WarehouseType,
  FieldDisplayType,
  resetDisplayType,
  setDisplayType,
} from "../services/api";

const ToggleSetting: React.FC<{
  name: string;
  initialValue: boolean;
  description: string;
  callback?: () => void;
}> = ({ name, initialValue, description, callback }) => {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  return (
    <Row className="border-bottom">
      <Form className="d-inline-flex my-2">
        <Form.Label
          htmlFor={slug}
          className="lh-lg me-2 fs-5 mt-auto mb-0 pb-0"
        >
          {name}
          <span className={`ps-3 text-muted ${styles.settingDescription}`}>
            {description}
          </span>
        </Form.Label>
        <Form.Check
          type="switch"
          id={slug}
          checked={initialValue}
          onChange={callback}
          className="my-auto ms-auto"
        />
      </Form>
    </Row>
  );
};

const WarehouseTypeSetting: React.FC<{
  name: string;
  fieldDefinition: WarehouseSchemaProperty;
  warehouseName: string;
  refreshWarehouses: () => void;
  warehouseRefreshCount: number;
}> = ({
  name,
  fieldDefinition,
  warehouseName,
  refreshWarehouses,
  warehouseRefreshCount,
}) => {
  const handleReset = () => {
    (async () => {
      await resetDisplayType(name, warehouseName);
      refreshWarehouses();
    })().catch((error) => console.error("Ah, bugger:", error));
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const displayType = event.target.value as unknown as FieldDisplayType;
    (async () => {
      await setDisplayType(name, warehouseName, displayType);
      refreshWarehouses();
    })().catch((error) => console.error("Ah, bugger:", error));
  };

  return (
    <Row className="border-bottom">
      <Form className="d-flex align-items-center my-2">
        <Form.Label
          htmlFor={name}
          className="lh-lg me-2 fs-5 mt-auto mb-0 pb-0"
        >
          <code>{name}</code>
        </Form.Label>
        <div className="flex-grow-1"></div>
        <span className={`pe-3 text-muted`}>Display as:</span>
        <Form.Select
          defaultValue={fieldDefinition.display_as}
          className={`me-2 ${styles.displayTypeSelect}`}
          onChange={handleChange}
        >
          {Object.values(FieldDisplayType).map((type, index) => (
            <option
              key={`${warehouseName}-${index}-${warehouseRefreshCount}`}
              value={type}
            >
              {type}
            </option>
          ))}
        </Form.Select>
        <Button className={styles.button} onClick={handleReset}>
          <Icon path={mdiRestart} size={1} className={styles.icon} />
        </Button>
      </Form>
    </Row>
  );
};

const WarehousePanel: React.FC<{
  warehouse: WarehouseType;
  warehouseRefreshCount: number;
  refreshWarehouses: () => void;
}> = ({ warehouse, warehouseRefreshCount, refreshWarehouses }) => {
  const sortedEntries = Object.entries(warehouse.item_schema).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  return (
    <Container>
      {sortedEntries.map(([field, fieldDefinition]) => (
        <WarehouseTypeSetting
          warehouseRefreshCount={warehouseRefreshCount}
          refreshWarehouses={refreshWarehouses}
          key={`${warehouse.name}-${field}-${warehouseRefreshCount}`}
          name={field}
          fieldDefinition={fieldDefinition}
          warehouseName={warehouse.name}
        />
      ))}
    </Container>
  );
};

const SettingsPanel: React.FC<{
  darkMode: boolean;
  toggleDarkMode: () => void;
  showTooltip: boolean;
  toggleShowTooltip: () => void;
}> = ({ darkMode, toggleDarkMode, showTooltip, toggleShowTooltip }) => {
  return (
    <Container>
      <ToggleSetting
        name="Dark Mode"
        initialValue={darkMode}
        description="Enable dark mode"
        callback={toggleDarkMode}
      />
      <ToggleSetting
        name="API Documentation Tooltip"
        initialValue={showTooltip}
        description={`Display a tooltip with a link to the API documentation when you hover over "Warehouses"`}
        callback={toggleShowTooltip}
      />
    </Container>
  );
};

const SettingsModal: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const [show, setShow] = useState(false);
  const {
    warehouses,
    warehouseRefreshCount,
    darkMode,
    toggleDarkMode,
    showTooltip,
    toggleShowTooltip,
    refreshWarehouses,
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
          className={`d-flex flex-nowrap list-group-item list-group-item-action ${
            isCollapsed ? sidebarStyles.collapsed : null
          } ${sidebarStyles.warehouseItem}`}
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
            className={`ps-2 ${sidebarStyles.warehouseItemNameCol} ${
              isCollapsed ? sidebarStyles.collapsed : null
            }`}
          >
            Settings
          </Col>
        </ListGroup.Item>
      </ListGroup>

      <Modal show={show} onHide={handleClose} centered size="xl">
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
                    refreshWarehouses={refreshWarehouses}
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
