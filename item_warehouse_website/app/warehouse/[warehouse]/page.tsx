import React from "react";
import Warehouse from "@/components/Warehouse.server";
import PageSizeDropdown from "@/components/PageSizeDropdown.client";
import {
  // ItemsResponse,
  // WarehouseType,
  getItemsFromWarehouse,
  getWarehouse,
} from "@/services/api";

import { cookies } from "next/headers";
import Paginator from "@/components/Paginator.client";

export default async function WarehousePage({
  params,
  searchParams,
}: {
  params: { warehouse: string };
  searchParams: { page: string };
}) {
  const warehouseName = params.warehouse;
  const page = searchParams.page;

  // let item_page: ItemsResponse;
  // let warehouse: WarehouseType;

  const getDefaultPageSize = () => {
    const pageSizeCookie = cookies().get("pageSize");

    let pageSize: string;
    if (!pageSizeCookie) {
      pageSize = "10";
      cookies().set("pageSize", "10");
    } else {
      pageSize = pageSizeCookie.value;
    }

    return pageSize;
  };

  const pageSize = getDefaultPageSize();

  const warehouse = await getWarehouse(warehouseName);
  const item_page = await getItemsFromWarehouse(warehouseName, pageSize, page);
  try {
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
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <h1 className="mb-0 mt-auto">{warehouseName}</h1>
              <span className="mb-1 mt-auto ms-3 text-muted">
                Viewing {item_page.count} of {item_page.total}{" "}
                {warehouse.item_name}s
              </span>
            </ul>
            <Paginator
              currentPage={item_page.page}
              totalPages={Math.ceil(item_page.total / parseInt(pageSize))}
              warehouseName={warehouseName}
            />
            <PageSizeDropdown
              currentPageSize={pageSize}
              warehouseName={warehouseName}
            />
          </div>
        </div>
      </nav>
      <Warehouse
        items={item_page.items}
        fields={fields}
        warehouseName={warehouseName}
        currentPage={item_page.page}
      />
    </>
  );
}
