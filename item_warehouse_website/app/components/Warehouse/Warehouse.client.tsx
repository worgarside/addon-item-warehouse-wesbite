"use client";

import React from "react";
import Item from "./Item.client";
import { WarehouseSchemaProperty } from "services/api";
import { useSettings } from "components/Settings/SettingsContext.client";
import { WarehouseFieldOrder } from "./WarehousePage.server";
import TableHeader from "./TableHeader.client";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

interface WarehouseProps {
  items: Record<string, string | number | boolean | null>[];
  fields: string[];
  itemName: string;
  warehouseName: string;
  currentPage: number;
  warehouseSchema: Record<string, WarehouseSchemaProperty>;
  warehouseFieldOrder: WarehouseFieldOrder;
  showActionsColumnCookie: boolean;
}

const Warehouse: React.FC<WarehouseProps> = ({
  items,
  fields,
  itemName,
  warehouseName,
  currentPage,
  warehouseSchema,
  showActionsColumnCookie,
}) => {
  const {
    showActionsColumn,
    getDisplayAsOptions,
    warehouseRefreshCount,
    useFallbackActionsColumn,
    updateWarehouseFieldOrder,
    currentWarehouseFieldOrder,
    updateWarehouseColumnOrder,
    warehouseColumnOrderConfigs,
  } = useSettings();

  const warehouseDisplayOptions = getDisplayAsOptions(warehouseName);

  const primaryKeys = Object.keys(warehouseSchema).filter(
    (key) => warehouseSchema[key]?.primary_key,
  );

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const sensors = useSensors(pointerSensor);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = fields.indexOf(String(active.id));
      const newIndex = fields.indexOf(String(over?.id || ""));

      updateWarehouseColumnOrder(warehouseName, oldIndex, newIndex, fields);
    }
  };

  return (
    <div className="p-0 m-0 mt-3 overflow-scroll">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields}
          strategy={horizontalListSortingStrategy}
        >
          <table className={`table table-hover table-striped table-bordered`}>
            <TableHeader
              fields={warehouseColumnOrderConfigs[warehouseName] || fields}
              updateWarehouseFieldOrder={updateWarehouseFieldOrder}
              warehouseName={warehouseName}
              warehouseColumnOrderConfigs={warehouseColumnOrderConfigs}
              updateWarehouseColumnOrder={updateWarehouseColumnOrder}
              currentWarehouseFieldOrder={currentWarehouseFieldOrder}
              showActionsColumn={
                useFallbackActionsColumn
                  ? showActionsColumnCookie
                  : showActionsColumn
              }
            />
            <tbody>
              {items.map(
                (item: Record<string, string | number | boolean | null>) => (
                  <Item
                    key={`${warehouseName}-${currentPage}-${JSON.stringify(
                      warehouseDisplayOptions,
                    )}-${primaryKeys.map((key) => item[key]).join("-")}`}
                    item={item}
                    fields={
                      warehouseColumnOrderConfigs[warehouseName] || fields
                    }
                    itemName={itemName}
                    currentPage={currentPage}
                    primaryKeyNames={primaryKeys}
                    warehouseName={warehouseName}
                    warehouseSchema={warehouseSchema}
                    warehouseRefreshCount={warehouseRefreshCount}
                    warehouseDisplayOptions={warehouseDisplayOptions}
                    showActionsColumn={
                      useFallbackActionsColumn
                        ? showActionsColumnCookie
                        : showActionsColumn
                    }
                  />
                ),
              )}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Warehouse;
