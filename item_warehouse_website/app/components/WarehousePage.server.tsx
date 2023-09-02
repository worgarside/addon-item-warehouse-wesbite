import React from "react";
import Warehouse from "./Warehouse.server";
import {
  ItemsResponse,
  WarehouseType,
  getItemsFromWarehouse,
  getWarehouse,
} from "../services/api";
import { cookies } from "next/headers";

import NavBar from "./Navbar.client";

const WarehousePage: React.FC<{
  warehouseName: string;
  page: string;
}> = async ({ warehouseName, page }) => {
  const pageSize = cookies().get("pageSize")?.value || "10";

  let item_page: ItemsResponse;
  let warehouse: WarehouseType;

  try {
    warehouse = await getWarehouse(warehouseName);
    item_page = await getItemsFromWarehouse(warehouseName, pageSize, page);
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

  const fields = Object.keys(warehouse.item_schema);

  return (
    <>
      <NavBar warehouse={warehouse} item_page={item_page} pageSize={pageSize} />
      <Warehouse
        items={item_page.items}
        fields={fields}
        warehouseName={warehouseName}
        currentPage={item_page.page}
      />
    </>
  );
};

export default WarehousePage;
