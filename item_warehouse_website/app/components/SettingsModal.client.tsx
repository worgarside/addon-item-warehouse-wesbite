"use client";

import React, { useState } from "react";
import styles from "../styles/SettingsModal.module.scss";
import sidebarStyles from "../styles/Sidebar.module.scss";
import Icon from "@mdi/react";
import { mdiClose, mdiTune } from "@mdi/js";
import {
  Button,
  Col,
  Container,
  Form,
  ListGroup,
  Modal,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useSettings } from "./SettingsContext.client";

const Setting: React.FC<{
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

const SettingsPanel: React.FC = () => {
  const { darkMode, toggleDarkMode } = useSettings();
  const { showTooltip, toggleShowTooltip } = useSettings();

  return (
    <Container>
      <Setting
        name="Dark Mode"
        initialValue={darkMode}
        description="Enable dark mode"
        callback={toggleDarkMode}
      />
      <Setting
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
        <Modal.Body className={styles.modalBody}>
          <Tabs defaultActiveKey="general" id="settings-tabs">
            <Tab eventKey="general" title="General">
              <SettingsPanel />
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SettingsModal;
