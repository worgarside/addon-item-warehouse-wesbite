"use client";

import React from "react";
import Cell from "./Cell.client";
import { FieldDisplayType, WarehouseSchemaProperty } from "services/api";
import ActionsCell from "./ActionsCell.client";

interface ItemProps {
  item: Record<string, boolean | number | string | null>;
  fields: string[];
  currentPage: number;
  warehouseName: string;
  primaryKeyNames: string[];
  warehouseSchema: Record<string, WarehouseSchemaProperty>;
  warehouseRefreshCount: number;
  warehouseDisplayOptions: Record<string, FieldDisplayType>;
}

const Item: React.FC<ItemProps> = ({
  item,
  fields,
  currentPage,
  warehouseName,
  primaryKeyNames,
  warehouseSchema,
  warehouseRefreshCount,
  warehouseDisplayOptions,
}) => {
  return (
    <tr>
      {fields.map((header) => (
        <Cell
          value={item[header]}
          header={header}
          key={`${warehouseName}-${currentPage}-${header}-${warehouseRefreshCount}`}
          displayAsOption={
            warehouseDisplayOptions[header] ||
            warehouseSchema[header].display_as
          }
          type={warehouseSchema[header].type}
        />
      ))}
      <ActionsCell
        item={item}
        primaryKeyNames={primaryKeyNames}
        warehouseName={warehouseName}
      />
    </tr>
  );
};

export default Item;
