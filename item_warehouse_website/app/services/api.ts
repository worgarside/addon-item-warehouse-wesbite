type ItemValue = string | number | boolean | null;

interface ItemsResponse {
  count: number;
  page: number;
  total: number;
  items: Record<string, ItemValue>[];
  fields: string[];
}

enum FieldDisplayType {
  Text = "text",
  Number = "number",
  Date = "date",
  DateTime = "datetime",
  Boolean = "boolean",
  Json = "json",
}

interface WarehouseSchemaProperty {
  autoincrement: string;
  default: string;
  display_as: FieldDisplayType;
  index: boolean;
  key: string;
  nullable: number;
  primary_key: boolean;
  type_kwargs: Record<string, number>;
  type: string;
  unique: boolean;
}

interface Warehouse {
  name: string;
  created_at: string;
  item_name: string;
  item_schema: Record<string, WarehouseSchemaProperty>;
}

interface WarehousesResponse {
  count: number;
  page: number;
  total: number;
  warehouses: Warehouse[];
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const getItemsFromWarehouse = async (
  warehouseName: string,
  count: string,
  pageNumber: string,
  orderBy: string | null,
  ascending: boolean | null,
): Promise<ItemsResponse> => {
  let url = `${apiBaseUrl}/v1/warehouses/${warehouseName}/items?page_size=${count}&page=${
    pageNumber || 1
  }&include_fields=true`;

  if (orderBy) {
    url += `&order_by=${orderBy}`;
  }

  if (ascending !== null) {
    url += `&ascending=${ascending}`;
  }

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = (await res.json()) as ItemsResponse;
  return data;
};

const getWarehouse = async (warehouseName: string): Promise<Warehouse> => {
  const res = await fetch(`${apiBaseUrl}/v1/warehouses/${warehouseName}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const data = (await res.json()) as Warehouse;
  return data;
};

const getWarehouses = async (): Promise<Warehouse[]> => {
  const res = await fetch(`${apiBaseUrl}/v1/warehouses`);

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = (await res.json()) as WarehousesResponse;
  return data.warehouses;
};

const resetDisplayType = async (
  fieldName: string,
  warehouseName: string,
): Promise<FieldDisplayType> => {
  return await setDisplayType(fieldName, warehouseName, "reset");
};

const setDisplayType = async (
  fieldName: string,
  warehouseName: string,
  displayType: FieldDisplayType | "reset",
): Promise<FieldDisplayType> => {
  const res = await fetch(
    `${apiBaseUrl}/v1/warehouses/${warehouseName}/schema/${fieldName}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        display_as: displayType,
      }),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  if (displayType === "reset") {
    const data = (await res.json()) as Record<string, WarehouseSchemaProperty>;

    return data[fieldName].display_as;
  }

  return displayType;
};

export {
  getItemsFromWarehouse,
  getWarehouse,
  getWarehouses,
  apiBaseUrl,
  FieldDisplayType,
  resetDisplayType,
  setDisplayType,
};
export type {
  ItemsResponse,
  Warehouse as WarehouseType,
  WarehouseSchemaProperty,
};
