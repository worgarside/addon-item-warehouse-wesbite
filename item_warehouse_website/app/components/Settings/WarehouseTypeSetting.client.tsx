"use client";

import React from "react";
import styles from "styles/SettingsModal.module.scss";
import Icon from "@mdi/react";
import { mdiDrag, mdiRestart } from "@mdi/js";
import { Button, Form, Row } from "react-bootstrap";
import {
  FieldDisplayType,
  WarehouseSchemaProperty,
  resetDisplayType,
  setDisplayType,
} from "services/api";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

interface WarehouseTypeSettingProps {
  name: string;
  fieldDefinition: WarehouseSchemaProperty;
  warehouseName: string;
  setDisplayAsOption: (
    warehouseName: string,
    fieldName: string,
    displayAs: FieldDisplayType,
  ) => void;
  id: string;
}

export const WarehouseTypeSetting: React.FC<WarehouseTypeSettingProps> = ({
  name,
  fieldDefinition,
  warehouseName,
  setDisplayAsOption,
  id,
}) => {
  const handleDisplayTypeReset = () => {
    (async () => {
      const resetDisplayOption = await resetDisplayType(name, warehouseName);
      setDisplayAsOption(warehouseName, name, resetDisplayOption);
    })().catch((error) => console.error("Ah, bugger:", error));
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const handleDisplayTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const displayType = event.target.value as unknown as FieldDisplayType;
    setDisplayAsOption(warehouseName, name, displayType);

    (async () => {
      await setDisplayType(name, warehouseName, displayType);
    })().catch((error) => console.error("Ah, bugger:", error));
  };

  return (
    <Row
      className={`border-bottom ${styles.noCursor}`}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition ?? undefined,
      }}
      {...attributes}
    >
      <Form className="d-flex align-items-center my-2">
        <Icon
          path={mdiDrag}
          size={1}
          className={`${styles.icon} ${styles.iconDrag}`}
          {...listeners}
          data-dnd-handle
        />
        <Form.Label className="lh-lg ms-2 fs-5 my-0 pb-1">
          <code>{name}</code>
        </Form.Label>
        <div className={`flex-grow-1 ${styles.noCursor}`}></div>
        <span className="pe-3 text-muted">Display as:</span>
        <Form.Select
          defaultValue={fieldDefinition.display_as}
          className={`me-2 ${styles.displayTypeSelect}`}
          onChange={handleDisplayTypeChange}
        >
          {Object.values(FieldDisplayType).map((type) => (
            <option
              key={`displayType-${warehouseName}-${name}-${type}`}
              value={type}
            >
              {type}
            </option>
          ))}
        </Form.Select>
        <Button className={styles.button} onClick={handleDisplayTypeReset}>
          <Icon path={mdiRestart} size={1} className={styles.icon} />
        </Button>
      </Form>
    </Row>
  );
};
