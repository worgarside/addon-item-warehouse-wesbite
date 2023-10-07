"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DroppableColumnHeader from "./DroppableColumnHeader.client";
import { WarehouseFieldOrder } from "./WarehousePage.server";
import styles from "styles/Warehouse/TableHeader.module.scss";

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
  currentWarehouseFieldOrder: WarehouseFieldOrder | null;
  showActionsColumn: boolean;
  columnExclusions: string[];
}

const TableHeader: React.FC<TableHeaderProps> = ({
  fields,
  updateWarehouseFieldOrder,
  warehouseName,
  currentWarehouseFieldOrder,
  showActionsColumn,
  columnExclusions,
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

  useEffect(() => {
    if (currentWarehouseFieldOrder) {
      setOrderBy(currentWarehouseFieldOrder.fieldName);
      setAscending(currentWarehouseFieldOrder.ascending);
    }
  }, [currentWarehouseFieldOrder]);

  return (
    <thead>
      <tr>
        {fields.map((header) =>
          columnExclusions.includes(header) ? null : (
            <DroppableColumnHeader
              key={header}
              header={header}
              handleClick={handleHeaderClick}
              orderBy={orderBy}
              ascending={ascending}
            />
          ),
        )}
        {showActionsColumn && (
          <th scope="col" className="font-monospace user-select-none p-0">
            <div className={`d-flex align-items-center text-muted`}>
              <span className={`d-flex ${styles.actionsHeader} p-2`}>
                Actions
              </span>
            </div>
          </th>
        )}
      </tr>
    </thead>
  );
};

export default TableHeader;
