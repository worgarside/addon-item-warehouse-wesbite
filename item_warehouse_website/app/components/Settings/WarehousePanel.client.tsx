"use client";

import React, { useState } from "react";
import { Container } from "react-bootstrap";
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
import { WarehouseTypeSetting } from "./WarehouseTypeSetting.client";
import { FieldDisplayType, WarehouseType } from "services/api";

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
    columns: string[],
  ) => string[];
  warehouseColumnOrder: string[];
}

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={columns} strategy={verticalListSortingStrategy}>
        <Container>
          {columns.map((column) => (
            <WarehouseTypeSetting
              setDisplayAsOption={setDisplayAsOption}
              id={column}
              name={column}
              key={`warehouseTypeSetting-${warehouse.name}-${column}`}
              fieldDefinition={warehouse.item_schema[column]}
              warehouseName={warehouse.name}
            />
          ))}
        </Container>
      </SortableContext>
    </DndContext>
  );
};
