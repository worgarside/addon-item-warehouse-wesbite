"use client";

import React, { useEffect, useState } from "react";
import styles from "styles/Warehouse.module.scss";
import Item from "./Item.client";
import { WarehouseSchemaProperty } from "services/api";
import { useSettings } from "../Settings/SettingsContext.client";
import Icon from "@mdi/react";
import { mdiMenuDown, mdiMenuUp, mdiCircleSmall } from "@mdi/js";
import { WarehouseFieldOrder } from "./WarehousePage.server";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface WarehouseProps {
  items: Record<string, string | number | boolean | null>[];
  fields: string[];
  warehouseName: string;
  currentPage: number;
  warehouseSchema: Record<string, WarehouseSchemaProperty>;
  warehouseFieldOrder: WarehouseFieldOrder;
}

interface DraggableHeaderProps {
  header: string;
  onDrop: (from: string, to: string) => void;
  handleClick: (header: string) => void;
  orderBy: string | null;
  ascending: boolean | null;
}

const getNextSortOrder = (current: boolean | null): boolean | null => {
  switch (current) {
    case true:
      return false;
    case false:
      return null;
    case null:
      return true;
  }
};

const DroppableColumnHeader: React.FC<DraggableHeaderProps> = ({
  header,
  onDrop,
  handleClick,
  orderBy,
  ascending,
}) => {
  const [, refDrag] = useDrag({
    type: "COLUMN",
    item: { header },
  });

  const [, refDrop] = useDrop({
    accept: "COLUMN",
    drop: (item: { header: string }) => onDrop(item.header, header),
  });

  return (
    <th
      scope="col"
      ref={(el) => refDrag(refDrop(el))}
      key={header}
      className="font-monospace user-select-none p-0"
    >
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => handleClick(header)}
        className={`d-flex justify-content-between align-items-center text-muted cursor-pointer ${styles.headerButton}`}
      >
        <span>{header}</span>
        <Icon
          className={`${styles.headerIcon} ${
            header === orderBy && styles.headerIconActive
          }`}
          path={
            header == orderBy
              ? ascending
                ? mdiMenuUp
                : mdiMenuDown
              : mdiCircleSmall
          }
          size={1.25}
        />
      </Button>
    </th>
  );
};

const Warehouse: React.FC<WarehouseProps> = ({
  items,
  fields,
  warehouseName,
  currentPage,
  warehouseSchema,
}) => {
  const {
    warehouseRefreshCount,
    getDisplayAsOptions,
    currentWarehouseFieldOrder,
    updateWarehouseFieldOrder,
    warehouseColumnOrderConfigs,
    updateWarehouseColumnOrder,
  } = useSettings();

  const warehouseDisplayOptions = getDisplayAsOptions(warehouseName);
  const router = useRouter();

  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [ascending, setAscending] = useState<boolean | null>(null);

  useEffect(() => {
    if (currentWarehouseFieldOrder) {
      setOrderBy(currentWarehouseFieldOrder.fieldName);
      setAscending(currentWarehouseFieldOrder.ascending);
    }
  }, [currentWarehouseFieldOrder]);

  const handleHeaderClick = (fieldName: string) => {
    let newOrderBy: string | null = null;
    let newAscending: boolean | null = null;

    if (fieldName === orderBy) {
      newAscending = getNextSortOrder(ascending);
      newOrderBy = newAscending === null ? null : fieldName;
      setOrderBy(newOrderBy);
      setAscending(newAscending);
    } else {
      newOrderBy = fieldName;
      newAscending = true;
      setOrderBy(newOrderBy);
      setAscending(newAscending);
    }
    updateWarehouseFieldOrder(warehouseName, newOrderBy, newAscending);
    router.refresh();
  };

  const handleHeaderDrop = (from: string, to: string) => {
    const thing = warehouseColumnOrderConfigs[warehouseName];

    const fromIndex = thing.indexOf(from);
    const toIndex = thing.indexOf(to);

    updateWarehouseColumnOrder(warehouseName, fromIndex, toIndex, thing);
  };

  const primaryKeys = Object.keys(warehouseSchema).filter(
    (key) => warehouseSchema[key]?.primary_key,
  );

  return (
    <>
      <div className="p-0 m-0 mt-3 overflow-scroll">
        <DndProvider backend={HTML5Backend}>
          <table className={`table table-hover table-striped table-bordered`}>
            <thead>
              <tr>
                {(warehouseColumnOrderConfigs[warehouseName] || fields).map(
                  (header) => (
                    <DroppableColumnHeader
                      key={header}
                      header={header}
                      onDrop={handleHeaderDrop}
                      handleClick={handleHeaderClick}
                      orderBy={orderBy}
                      ascending={ascending}
                    />
                  ),
                )}
              </tr>
            </thead>
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
                    currentPage={currentPage}
                    warehouseName={warehouseName}
                    warehouseSchema={warehouseSchema}
                    warehouseRefreshCount={warehouseRefreshCount}
                    warehouseDisplayOptions={warehouseDisplayOptions}
                  />
                ),
              )}
            </tbody>
          </table>
        </DndProvider>
      </div>
    </>
  );
};

export default Warehouse;
