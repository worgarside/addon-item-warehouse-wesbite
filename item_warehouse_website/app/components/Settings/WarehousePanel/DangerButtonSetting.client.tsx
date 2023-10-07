"use client";

import React from "react";
import { Button, Form } from "react-bootstrap";
import styles from "styles/Settings/WarehousePanel/WarehousePanel.module.scss";
import Icon from "@mdi/react";
import { mdiRestart } from "@mdi/js";

const DangerButtonSetting: React.FC<{
  onClick: () => void;
  text: string;
}> = ({ onClick, text }) => {
  return (
    <Form.Group className="border-bottom d-flex align-items-center p-2 mx-2">
      <Form.Label className="lh-lg ms-2 my-0 pb-1">{text}</Form.Label>
      <div className="flex-grow-1"></div>
      <Button className={`btn-danger ${styles.button}`} onClick={onClick}>
        <Icon path={mdiRestart} size={1} className={styles.icon} />
      </Button>
    </Form.Group>
  );
};

export default DangerButtonSetting;
