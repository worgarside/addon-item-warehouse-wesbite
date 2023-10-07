import React from "react";
import Warehouse from "./Warehouse.client";
import {
  ItemsResponse,
  WarehouseType,
  getItemsFromWarehouse,
  getWarehouse,
} from "services/api";
import { cookies } from "next/headers";

import NavBar from "./NavBar/NavBar.client";

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

  console.log(
    `warehouseFieldOrderCookieCookie: ${JSON.stringify(
      warehouseFieldOrderCookie,
    )}`,
  );

  const warehouseColumnOrderCookie = cookies().get(
    `${warehouseName}ColumnOrder`,
  );

  const warehouseColumnOrder: string[] | null = warehouseColumnOrderCookie
    ? (JSON.parse(warehouseColumnOrderCookie.value) as string[])
    : null;

  const warehouseColumnExclusionsCookie = cookies().get(
    `${warehouseName}ColumnExclusions`,
  );

  const warehouseColumnExclusions: string[] = warehouseColumnExclusionsCookie
    ? (JSON.parse(warehouseColumnExclusionsCookie.value) as string[])
    : [];

  let itemPage: ItemsResponse;
  let warehouse: WarehouseType;
  let fields = null;

  try {
    warehouse = await getWarehouse(warehouseName);

    if (warehouseColumnOrder) {
      fields = warehouseColumnOrder;
    }

    if (warehouseColumnExclusions.length > 0) {
      fields = (fields || Object.keys(warehouse.item_schema)).filter(
        (fieldName) => !warehouseColumnExclusions.includes(fieldName),
      );
    }

    itemPage = await getItemsFromWarehouse(
      warehouseName,
      pageSize,
      page,
      warehouseFieldOrder.fieldName,
      warehouseFieldOrder.ascending,
      fields,
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

  fields = fields ?? itemPage.fields;

  const showActionsColumnCookie =
    cookies().get("showActionsColumn")?.value === "1";

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
        itemName={warehouse.item_name}
        warehouseName={warehouseName}
        currentPage={itemPage.page}
        warehouseSchema={warehouse.item_schema}
        warehouseFieldOrder={warehouseFieldOrder}
        showActionsColumnCookie={showActionsColumnCookie}
      />
    </>
  );
};

export default WarehousePage;
