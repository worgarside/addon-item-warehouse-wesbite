"use client";

import React, { useState } from "react";
import styles from "../styles/Warehouse.module.scss";
import Item from "./Item.client";
import { WarehouseSchemaProperty } from "../services/api";
import { useSettings } from "./SettingsContext.client";
import Icon from "@mdi/react";
import { mdiMenuDown, mdiMenuUp, mdiCircleSmall } from "@mdi/js";
import Cookie from "js-cookie";
import { WarehouseFieldOrder } from "./WarehousePage.server";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface WarehouseProps {
  fields: string[];
  items: Record<string, string | number | boolean | null>[];
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
          className={styles.headerIcon}
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
  fields,
  items,
  warehouseName,
  currentPage,
  warehouseSchema,
}) => {
  const {
    warehouseRefreshCount,
    getDisplayAsOptions,
    updateWarehouseFieldOrder,
  } = useSettings();
  const warehouseDisplayOptions = getDisplayAsOptions(warehouseName);
  const router = useRouter();

  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [ascending, setAscending] = useState<boolean | null>(null);

  const handleClick = (fieldName: string) => {
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

  const primaryKeys = Object.keys(warehouseSchema).filter(
    (key) => warehouseSchema[key]?.primary_key,
  );

  const [columns, setColumns] = useState(fields);

  const handleDrop = (from: string, to: string) => {
    const newColumns = [...columns];

    const fromIndex = columns.indexOf(from);
    const toIndex = columns.indexOf(to);

    newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, from);

    setColumns(newColumns);
    Cookie.set(`${warehouseName}ColumnOrder`, JSON.stringify(newColumns));
  };

  return (
    <>
      <div className="p-0 m-0 mt-3 overflow-scroll">
        <DndProvider backend={HTML5Backend}>
          <table className={`table table-hover table-striped table-bordered`}>
            <thead>
              <tr>
                {columns.map((header) => (
                  <DroppableColumnHeader
                    key={header}
                    header={header}
                    onDrop={handleDrop}
                    handleClick={handleClick}
                    orderBy={orderBy}
                    ascending={ascending}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(
                (item: Record<string, string | number | boolean | null>) => (
                  <Item
                    key={`${currentPage}-${JSON.stringify(
                      warehouseDisplayOptions,
                    )}-${primaryKeys.map((key) => item[key]).join("-")}`}
                    item={item}
                    fields={columns}
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
