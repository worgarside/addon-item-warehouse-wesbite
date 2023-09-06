"use client";

import React from "react";
import Cell from "./Cell.client";
import { FieldDisplayType, WarehouseSchemaProperty } from "../services/api";

interface ItemProps {
  item: Record<string, boolean | number | string | null>;
  index: number;
  currentPage: number;
  warehouseName: string;
  warehouseSchema: Record<string, WarehouseSchemaProperty>;
  warehouseRefreshCount: number;
  warehouseDisplayOptions: Record<string, FieldDisplayType>;
}

const Item: React.FC<ItemProps> = ({
  item,
  index,
  currentPage,
  warehouseName,
  warehouseSchema,
  warehouseRefreshCount,
  warehouseDisplayOptions,
}) => {
  return (
    <tr>
      {Object.entries(item).map(([header, value], cellIndex) => (
        <Cell
          value={value}
          header={header}
          key={`${warehouseName}-${currentPage}-${index}-${cellIndex}-${warehouseRefreshCount}`}
          displayAsOption={
            warehouseDisplayOptions[header] ||
            warehouseSchema[header].display_as
          }
          type={warehouseSchema[header].type}
        />
      ))}
    </tr>
  );
};

export default Item;
