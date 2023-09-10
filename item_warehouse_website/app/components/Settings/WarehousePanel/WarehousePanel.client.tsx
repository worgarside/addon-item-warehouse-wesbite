"use client";

import React, { useState } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import WarehouseTypeSetting from "./WarehouseTypeSetting.client";
import { FieldDisplayType, WarehouseType } from "services/api";
import styles from "styles/Settings/WarehousePanel/WarehousePanel.module.scss";
import Icon from "@mdi/react";
import { mdiRestart } from "@mdi/js";

interface WarehousePanelProps {
  warehouse: WarehouseType;
  warehouseRefreshCount: number;
  setDisplayAsOption: (
    warehouseName: string,
    fieldName: string,
    displayAs: FieldDisplayType,
  ) => void;
  updateWarehouseColumnOrder: (
    warehouseName: string,
    oldIndex: number,
    newIndex: number,
    columns: string[] | null,
  ) => string[];
  warehouseColumnOrder: string[];
}

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

export const WarehousePanel: React.FC<WarehousePanelProps> = ({
  warehouse,
  setDisplayAsOption,
  updateWarehouseColumnOrder,
  warehouseColumnOrder,
}) => {
  const [columns, setColumns] = useState<string[]>(warehouseColumnOrder);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = columns.indexOf(String(active.id));
      const newIndex = columns.indexOf(String(over?.id || ""));

      const updatedItems = updateWarehouseColumnOrder(
        warehouse.name,
        oldIndex,
        newIndex,
        columns,
      );
      setColumns(updatedItems);
    }
  };

  return (
    <Accordion className={`pt-2`}>
      <Accordion.Item eventKey="displaySettings">
        <Accordion.Header>Display Settings</Accordion.Header>
        <Accordion.Body className="p-0">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={columns}
              strategy={verticalListSortingStrategy}
            >
              <Form>
                {columns.map((column) => (
                  <WarehouseTypeSetting
                    setDisplayAsOption={setDisplayAsOption}
                    name={column}
                    key={`warehouseTypeSetting-${warehouse.name}-${column}`}
                    fieldDefinition={warehouse.item_schema[column]}
                    warehouseName={warehouse.name}
                  />
                ))}
              </Form>
            </SortableContext>
          </DndContext>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="dangerZone">
        <Accordion.Header>Danger Zone</Accordion.Header>
        <Accordion.Body className="p-0">
          <Form>
            <DangerButtonSetting
              onClick={() => {
                if (window.confirm("Confirm column order reset?")) {
                  updateWarehouseColumnOrder(warehouse.name, 0, 0, null);
                }
              }}
              text="Reset Column Order"
            />
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
