"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DroppableColumnHeader from "./DroppableColumnHeader.client";
import { WarehouseFieldOrder } from "./WarehousePage.server";

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

export interface TableHeaderProps {
  fields: string[];
  updateWarehouseFieldOrder: (
    warehouseName: string,
    fieldName: string | null,
    ascending: boolean | null,
  ) => void;
  warehouseName: string;
  warehouseColumnOrderConfigs: Record<string, string[]>;
  updateWarehouseColumnOrder: (
    warehouseName: string,
    oldIndex: number,
    newIndex: number,
    columns: string[],
  ) => string[];
  currentWarehouseFieldOrder: WarehouseFieldOrder | null;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  fields,
  updateWarehouseFieldOrder,
  warehouseName,
  warehouseColumnOrderConfigs,
  updateWarehouseColumnOrder,
  currentWarehouseFieldOrder,
}) => {
  const router = useRouter();

  const [orderBy, setOrderBy] = useState<string | null>(null);
  const [ascending, setAscending] = useState<boolean | null>(null);

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
    const columns = warehouseColumnOrderConfigs[warehouseName];

    const fromIndex = columns.indexOf(from);
    const toIndex = columns.indexOf(to);

    updateWarehouseColumnOrder(warehouseName, fromIndex, toIndex, columns);
  };

  useEffect(() => {
    if (currentWarehouseFieldOrder) {
      setOrderBy(currentWarehouseFieldOrder.fieldName);
      setAscending(currentWarehouseFieldOrder.ascending);
    }
  }, [currentWarehouseFieldOrder]);

  return (
    <thead>
      <tr>
        {fields.map((header) => (
          <DroppableColumnHeader
            key={header}
            header={header}
            onDrop={handleHeaderDrop}
            handleClick={handleHeaderClick}
            orderBy={orderBy}
            ascending={ascending}
          />
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
