"use client";

import React, { useEffect } from "react";
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
    warehouseColumnExclusions,
    currentWarehouseFieldOrder,
    updateWarehouseColumnOrder,
    warehouseColumnOrderConfigs,
  } = useSettings();

  const warehouseDisplayOptions = getDisplayAsOptions(warehouseName);

  const [currentColumnOrder, setCurrentColumnOrder] = React.useState(
    warehouseColumnOrderConfigs[warehouseName] || fields,
  );

  const primaryKeys = Object.keys(warehouseSchema).filter(
    (key) => warehouseSchema[key]?.primary_key,
  );

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  useEffect(() => {
    setCurrentColumnOrder(warehouseColumnOrderConfigs[warehouseName] || fields);
  }, [warehouseColumnOrderConfigs, fields, warehouseName]);

  const sensors = useSensors(pointerSensor);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentColumnOrder.indexOf(String(active.id));
      const newIndex = currentColumnOrder.indexOf(String(over.id));

      console.debug(
        `Column ${active.id} (#${oldIndex}) dropped to ${over.id} (#${newIndex})`,
      );

      updateWarehouseColumnOrder(
        warehouseName,
        oldIndex,
        newIndex,
        currentColumnOrder,
      );
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
              fields={currentColumnOrder}
              updateWarehouseFieldOrder={updateWarehouseFieldOrder}
              warehouseName={warehouseName}
              currentWarehouseFieldOrder={currentWarehouseFieldOrder}
              showActionsColumn={
                useFallbackActionsColumn
                  ? showActionsColumnCookie
                  : showActionsColumn
              }
              columnExclusions={warehouseColumnExclusions[warehouseName] || []}
            />
            <tbody>
              {items.map(
                (item: Record<string, string | number | boolean | null>) => (
                  <Item
                    key={`${warehouseName}-${currentPage}-${JSON.stringify(
                      warehouseDisplayOptions,
                    )}-${primaryKeys.map((key) => item[key]).join("-")}`}
                    item={item}
                    fields={currentColumnOrder}
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
                    columnExclusions={
                      warehouseColumnExclusions[warehouseName] || []
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
