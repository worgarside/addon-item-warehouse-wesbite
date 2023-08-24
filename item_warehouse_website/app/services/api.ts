type ItemValue = string | number | boolean | null;

interface ItemsResponse {
  count: number;
  page: number;
  total: number;
  items: Record<string, ItemValue>[];
}

interface WarehouseSchemaProperty {
  autoincrement: string;
  default: string;
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
): Promise<ItemsResponse> => {
  const res = await fetch(
    `${apiBaseUrl}/v1/warehouses/${warehouseName}/items?page_size=${count}&page=${
      pageNumber || 1
    }`,
  );

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

export { getItemsFromWarehouse, getWarehouse, getWarehouses };
export type { ItemsResponse, Warehouse as WarehouseType };
