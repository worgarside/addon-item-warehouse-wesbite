"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import styles from "../styles/SettingsModal.module.scss";
import Icon from "@mdi/react";
import { mdiClose, mdiTune } from "@mdi/js";
import {
  Button,
  Container,
  Form,
  ListGroup,
  Modal,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import Cookie from "js-cookie";

const Setting: React.FC<{
  name: string;
  initialValue: boolean;
  description: string;
  callback?: (value: boolean) => void;
}> = ({ name, initialValue, description, callback }) => {
  const slug = name.toLowerCase().replace(" ", "-");
  const cookieValue = Cookie.get(slug) === "1" ? true : initialValue;
  const [settingState, setSettingState] = useState(cookieValue);

  useEffect(() => {
    Cookies.set(slug, settingState ? "1" : "0");
  }, [slug, settingState]);

  const handleToggle = () => {
    const newState = !settingState;
    setSettingState(newState);

    if (typeof callback === "function") {
      callback(newState);
    }
  };

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
          checked={settingState}
          onChange={handleToggle}
          className="my-auto ms-auto"
        />
      </Form>
    </Row>
  );
};

const DarkModeSetting: React.FC = ({}) => {
  useEffect(() => {
    const cookieValue = Cookie.get("dark-mode") === "1";
    const initialTheme = cookieValue ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", initialTheme);
  }, []);

  const handleDarkModeToggle = (value: boolean) => {
    const newTheme = value ? "dark" : "light";
    document.documentElement.setAttribute("data-bs-theme", newTheme);
  };

  return (
    <Setting
      name="Dark Mode"
      initialValue={false}
      description="Enable dark mode"
      callback={handleDarkModeToggle}
    />
  );
};

const SettingsPanel: React.FC = ({}) => {
  return (
    <Container>
      <DarkModeSetting />
    </Container>
  );
};

const SettingsModal: React.FC = ({}) => {
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
          className="list-group-item list-group-item-action"
          onClick={handleShow}
        >
          <Icon className="me-2" path={mdiTune} size={1} />
          Settings
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
