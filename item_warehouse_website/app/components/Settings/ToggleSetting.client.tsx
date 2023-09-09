"use client";

import React from "react";
import styles from "styles/SettingsModal.module.scss";
import { Form, Row } from "react-bootstrap";

interface ToggleSettingProps {
  name: string;
  initialValue: boolean;
  description: string;
  callback?: () => void;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({
  name,
  initialValue,
  description,
  callback,
}) => {
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

export default ToggleSetting;
