"use client";

import React, { useState } from "react";
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
    warehouseRefreshCount,
    getDisplayAsOptions,
    currentWarehouseFieldOrder,
    updateWarehouseFieldOrder,
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
