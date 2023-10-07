"use client";

import React from "react";
import Cell from "./Cell.client";
import { FieldDisplayType, WarehouseSchemaProperty } from "services/api";
import ActionsCell from "./ActionsCell.client";

interface ItemProps {
  item: Record<string, boolean | number | string | null>;
  fields: string[];
  itemName: string;
  currentPage: number;
  warehouseName: string;
  primaryKeyNames: string[];
  warehouseSchema: Record<string, WarehouseSchemaProperty>;
  columnExclusions: string[];
  showActionsColumn: boolean;
  warehouseRefreshCount: number;
  warehouseDisplayOptions: Record<string, FieldDisplayType>;
}

const Item: React.FC<ItemProps> = ({
  item,
  fields,
  itemName,
  currentPage,
  warehouseName,
  primaryKeyNames,
  warehouseSchema,
  columnExclusions,
  showActionsColumn,
  warehouseRefreshCount,
  warehouseDisplayOptions,
}) => {
  return (
    <tr>
      {fields.map((header) =>
        columnExclusions.includes(header) ? null : (
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
        ),
      )}
      {showActionsColumn && (
        <ActionsCell
          item={item}
          itemName={itemName}
          warehouseName={warehouseName}
          primaryKeyNames={primaryKeyNames}
        />
      )}
    </tr>
  );
};

export default Item;
