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

  let item_page: ItemsResponse;
  let warehouse: WarehouseType;

  try {
    warehouse = await getWarehouse(warehouseName);
    item_page = await getItemsFromWarehouse(
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

  const fields =
    item_page.fields.length === 0
      ? Object.keys(warehouse.item_schema)
      : item_page.fields;

  return (
    <>
      <NavBar warehouse={warehouse} item_page={item_page} pageSize={pageSize} />
      <Warehouse
        items={item_page.items}
        fields={fields}
        warehouseName={warehouseName}
        currentPage={item_page.page}
        warehouseSchema={warehouse.item_schema}
        warehouseFieldOrder={warehouseFieldOrder}
      />
    </>
  );
};

export default WarehousePage;
