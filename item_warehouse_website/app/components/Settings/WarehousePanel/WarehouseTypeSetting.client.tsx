"use client";

import React, { useState } from "react";
import styles from "styles/Settings/WarehousePanel/WarehouseTypeSetting.module.scss";
import Icon from "@mdi/react";
import { mdiDrag, mdiRestart } from "@mdi/js";
import { Button, Form } from "react-bootstrap";
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
  alreadyHidden: boolean;
  updateWarehouseColumnExclusions: (
    warehouseName: string,
    columnToHide: string,
    hide: boolean,
  ) => void;
}

const WarehouseTypeSetting: React.FC<WarehouseTypeSettingProps> = ({
  name,
  fieldDefinition,
  warehouseName,
  setDisplayAsOption,
  alreadyHidden,
  updateWarehouseColumnExclusions,
}) => {
  const [isHidden, setIsHidden] = useState<boolean>(alreadyHidden);

  const handleDisplayTypeReset = () => {
    (async () => {
      const resetDisplayOption = await resetDisplayType(name, warehouseName);
      setDisplayAsOption(warehouseName, name, resetDisplayOption);
    })().catch((error) => console.error("Ah, bugger:", error));
  };

  const handleDisplayTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const displayType = event.target.value as unknown as FieldDisplayType;
    setDisplayAsOption(warehouseName, name, displayType);

    (async () => {
      await setDisplayType(name, warehouseName, displayType);
    })().catch((error) => console.error("Ah, bugger:", error));
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: name });

  return (
    <Form.Group
      className={`border-bottom d-flex align-items-center p-2 mx-2 ${styles.noCursor}`}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition ?? undefined,
      }}
      {...attributes}
    >
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
      <Form.Check
        type="switch"
        id={name}
        checked={!isHidden}
        onChange={() => {
          updateWarehouseColumnExclusions(warehouseName, name, !isHidden);
          setIsHidden(!isHidden);
        }}
        className="my-auto ms-auto"
      />
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
    </Form.Group>
  );
};

export default WarehouseTypeSetting;
