"use client";

import React, { useEffect, useState } from "react";
import styles from "../styles/Warehouse.module.scss";
import Item from "./Item.client";
import { WarehouseSchemaProperty } from "../services/api";
import { useSettings } from "./SettingsContext.client";
import Icon from "@mdi/react";
import { mdiMenuDown, mdiMenuUp, mdiCircleSmall } from "@mdi/js";
import { WarehouseFieldOrder } from "./WarehousePage.server";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

interface WarehouseProps {
  fields: string[];
  items: Record<string, string | number | boolean | null>[];
  warehouseName: string;
  currentPage: number;
  warehouseSchema: Record<string, WarehouseSchemaProperty>;
  warehouseFieldOrder: WarehouseFieldOrder;
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

const Warehouse: React.FC<WarehouseProps> = ({
  fields,
  items,
  warehouseName,
  currentPage,
  warehouseSchema,
}) => {
  const {
    currentWarehouseFieldOrder,
    warehouseRefreshCount,
    getDisplayAsOptions,
    updateWarehouseFieldOrder,
  } = useSettings();
  const warehouseDisplayOptions = getDisplayAsOptions(warehouseName);
  const router = useRouter();

  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [ascending, setAscending] = useState<boolean | null>(null);

  useEffect(() => {
    const newOrderBy = currentWarehouseFieldOrder?.fieldName || null;
    const newAscending =
      currentWarehouseFieldOrder?.ascending === true
        ? true
        : currentWarehouseFieldOrder?.ascending === false
        ? false
        : null;

    setOrderBy(newOrderBy);
    setAscending(newAscending);

    router.refresh();
  }, [currentWarehouseFieldOrder, router]);

  const handleClick = (fieldName: string) => {
    const newAscending = getNextSortOrder(ascending);
    const newOrderBy = newAscending === null ? null : fieldName;

    updateWarehouseFieldOrder(warehouseName, newOrderBy, newAscending);
  };

  const primaryKeys = Object.keys(warehouseSchema).filter(
    (key) => warehouseSchema[key]?.primary_key,
  );

  return (
    <>
      <div className="p-0 m-0 mt-3 overflow-scroll">
        <table className={`table table-hover table-striped table-bordered`}>
          <thead>
            <tr>
              {fields.map((header) => (
                <th
                  scope="col"
                  key={header}
                  className="font-monospace user-select-none p-1"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="me-2">{header}</span>
                    <div className={`cursor-pointer ${styles.iconContainer}`}>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className={`text-muted ${styles.orderByIcon} ${styles.iconDefault}`}
                      >
                        <Icon
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
                      <Button
                        onClick={() => handleClick(header)}
                        variant="outline-secondary"
                        size="sm"
                        className={`text-muted ${styles.orderByIcon} ${styles.iconHover}`}
                      >
                        <Icon
                          path={
                            header == orderBy
                              ? ascending
                                ? mdiCircleSmall
                                : mdiMenuUp
                              : mdiMenuDown
                          }
                          size={1.25}
                        />
                      </Button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(
              (item: Record<string, string | number | boolean | null>) => (
                <Item
                  item={item}
                  key={`${currentPage}-${JSON.stringify(
                    warehouseDisplayOptions,
                  )}-${primaryKeys.map((key) => item[key]).join("-")}`}
                  warehouseName={warehouseName}
                  currentPage={currentPage}
                  warehouseSchema={warehouseSchema}
                  warehouseRefreshCount={warehouseRefreshCount}
                  warehouseDisplayOptions={warehouseDisplayOptions}
                />
              ),
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Warehouse;
