import React from "react";
import Warehouse from "./Warehouse.client";
import {
  ItemsResponse,
  WarehouseType,
  getItemsFromWarehouse,
  getWarehouse,
} from "../services/api";
import { cookies } from "next/headers";

import NavBar from "./Navbar.client";
import _ from "lodash";

interface WarehousePageProps {
  warehouseName: string;
  page: string;
}

export interface WarehouseFieldOrder {
  ascending: boolean | null;
  fieldName: string | null;
}

const WarehousePage: React.FC<WarehousePageProps> = async ({
  warehouseName,
  page,
}) => {
  const pageSize = cookies().get("pageSize")?.value || "10";

  const warehouseFieldOrderCookie = cookies().get(`${warehouseName}FieldOrder`);

  const warehouseFieldOrder: WarehouseFieldOrder = warehouseFieldOrderCookie
    ? (JSON.parse(warehouseFieldOrderCookie.value) as WarehouseFieldOrder)
    : {
        fieldName: null,
        ascending: null,
      };

  let itemPage: ItemsResponse;
  let warehouse: WarehouseType;

  try {
    warehouse = await getWarehouse(warehouseName);
    itemPage = await getItemsFromWarehouse(
      warehouseName,
      pageSize,
      page,
      warehouseFieldOrder.fieldName,
      warehouseFieldOrder.ascending,
    );
  } catch (error) {
    return (
      <div className="alert alert-warning" role="alert">
        <h1>TODO: Error Page :(</h1>
        <pre>
          <code>{JSON.stringify(error, null, 2)}</code>
        </pre>
      </div>
    );
  }

  const columnOrderCookie = cookies().get(`${warehouseName}ColumnOrder`);

  let fields: string[];

  if (columnOrderCookie) {
    fields = JSON.parse(columnOrderCookie.value) as string[];

    // Check for new/removed columns, preserve existing order
    if (!_.isEqual([...fields].sort(), [...itemPage.fields].sort())) {
      fields = fields
        .filter((field) => itemPage.fields.includes(field))
        .concat(itemPage.fields.filter((field) => !fields.includes(field)));

      cookies().set(`${warehouseName}ColumnOrder`, JSON.stringify(fields));
    }
  } else if (itemPage.fields.length === 0) {
    fields = Object.keys(warehouse.item_schema);
  } else {
    fields = itemPage.fields;
  }

  return (
    <>
      <NavBar
        pageSize={pageSize}
        currentPage={itemPage.page}
        itemCount={itemPage.count}
        itemTotal={itemPage.total}
        itemName={warehouse.item_name}
        warehouseName={warehouseName}
      />
      <Warehouse
        items={itemPage.items}
        fields={fields}
        warehouseName={warehouseName}
        currentPage={itemPage.page}
        warehouseSchema={warehouse.item_schema}
        warehouseFieldOrder={warehouseFieldOrder}
      />
    </>
  );
};

export default WarehousePage;
