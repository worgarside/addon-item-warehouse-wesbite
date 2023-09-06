"use client";

import React from "react";
import styles from "../styles/Warehouse.module.scss";
import Item from "./Item.client";
import { WarehouseSchemaProperty } from "../services/api";
import { useSettings } from "./SettingsContext.client";

interface WarehouseProps {
  fields: string[];
  items: Record<string, string | number | boolean | null>[];
  warehouseName: string;
  currentPage: number;
  warehouseSchema: Record<string, WarehouseSchemaProperty>;
}

const Warehouse: React.FC<WarehouseProps> = ({
  fields,
  items,
  warehouseName,
  currentPage,
  warehouseSchema,
}) => {
  const { warehouseRefreshCount, getDisplayAsOptions } = useSettings();
  const warehouseDisplayOptions = getDisplayAsOptions(warehouseName);

  return (
    <>
      <div className={`p-0 m-0 mt-3 ${styles.container}`}>
        <table className={`table table-hover table-striped table-bordered`}>
          <thead>
            <tr>
              {fields.map((header) => (
                <th
                  scope="col"
                  key={header}
                  className="font-monospace user-select-none"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(
              (
                item: Record<string, string | number | boolean | null>,
                index: number,
              ) => (
                <Item
                  item={item}
                  key={`${warehouseName}-${currentPage}-${index}`}
                  index={index}
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
