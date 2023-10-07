"use client";

import React, { useState } from "react";
import { Accordion, Form } from "react-bootstrap";
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
import DangerButtonSetting from "./DangerButtonSetting.client";

interface WarehousePanelProps {
  warehouse: WarehouseType;
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
  columnExclusions: string[];
  updateWarehouseColumnExclusions: (
    warehouseName: string,
    columnToHide: string | null,
    hide: boolean | null,
  ) => void;
}

export const WarehousePanel: React.FC<WarehousePanelProps> = ({
  warehouse,
  setDisplayAsOption,
  updateWarehouseColumnOrder,
  warehouseColumnOrder,
  columnExclusions,
  updateWarehouseColumnExclusions,
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
                    alreadyHidden={columnExclusions.includes(column)}
                    updateWarehouseColumnExclusions={
                      updateWarehouseColumnExclusions
                    }
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
              confirmMessage="Confirm column order reset?"
              onClick={() => {
                updateWarehouseColumnOrder(warehouse.name, 0, 0, null);
              }}
              text="Reset column order"
            />
            <DangerButtonSetting
              confirmMessage="Confirm rest all hide toggles?"
              onClick={() => {
                updateWarehouseColumnExclusions(warehouse.name, null, null);
              }}
              text="Show all columns"
            />
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};
