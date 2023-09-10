"use client";

import React from "react";
import Item from "./Item.client";
import { WarehouseSchemaProperty } from "services/api";
import { useSettings } from "../Settings/SettingsContext.client";
import { WarehouseFieldOrder } from "./WarehousePage.server";
import TableHeader from "./TableHeader.client";

interface WarehouseProps {
  items: Record<string, string | number | boolean | null>[];
  fields: string[];
  warehouseName: string;
  currentPage: number;
  warehouseSchema: Record<string, WarehouseSchemaProperty>;
  warehouseFieldOrder: WarehouseFieldOrder;
}

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

  const primaryKeys = Object.keys(warehouseSchema).filter(
    (key) => warehouseSchema[key]?.primary_key,
  );

  return (
    <div className="p-0 m-0 mt-3 overflow-scroll">
      <table className={`table table-hover table-striped table-bordered`}>
        <TableHeader
          fields={warehouseColumnOrderConfigs[warehouseName] || fields}
          updateWarehouseFieldOrder={updateWarehouseFieldOrder}
          warehouseName={warehouseName}
          warehouseColumnOrderConfigs={warehouseColumnOrderConfigs}
          updateWarehouseColumnOrder={updateWarehouseColumnOrder}
          currentWarehouseFieldOrder={currentWarehouseFieldOrder}
        />
        <tbody>
          {items.map(
            (item: Record<string, string | number | boolean | null>) => (
              <Item
                key={`${warehouseName}-${currentPage}-${JSON.stringify(
                  warehouseDisplayOptions,
                )}-${primaryKeys.map((key) => item[key]).join("-")}`}
                item={item}
                fields={warehouseColumnOrderConfigs[warehouseName] || fields}
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
    </div>
  );
};

export default Warehouse;
