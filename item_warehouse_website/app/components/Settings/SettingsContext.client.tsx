"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cookie from "js-cookie";
import { FieldDisplayType, WarehouseType, getWarehouses } from "services/api";
import _ from "lodash";
import { WarehouseFieldOrder } from "components/Warehouse/WarehousePage.server";
import { arrayMove } from "@dnd-kit/sortable";
import { useSearchParams } from "next/navigation";

export interface UpdateWarehouseColumnOrderProps {
  warehouseName: string;
  oldIndex: number;
  newIndex: number;
  columns: string[];
}

interface SettingsContextProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  showTooltip: boolean;
  toggleShowTooltip: () => void;
  showActionsColumn: boolean;
  toggleShowActionsColumn: () => void;
  warehouses: WarehouseType[];
  setWarehouses: (warehouses: WarehouseType[]) => void;
  refreshWarehouses: () => void;
  warehouseRefreshCount: number;
  setDisplayAsOption: (
    warehouseName: string,
    fieldName: string,
    displayAs: FieldDisplayType,
  ) => void;
  setWarehouseRefreshCount: (count: number) => void;
  getDisplayAsOptions: (
    warehouseName: string,
  ) => Record<string, FieldDisplayType>;
  currentWarehouseFieldOrder: WarehouseFieldOrder | null;
  updateWarehouseFieldOrder: (
    warehouseName: string,
    fieldName: string | null,
    ascending: boolean | null,
  ) => void;
  warehouseColumnOrderConfigs: Record<string, string[]>;
  setWarehouseColumnOrderConfigs: (configs: Record<string, string[]>) => void;
  updateWarehouseColumnOrder: (
    warehouseName: string,
    oldIndex: number,
    newIndex: number,
    columns: string[] | null,
  ) => string[];
  useFallbackActionsColumn: boolean;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined,
);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};

const getCookie = (name: string, debugLog: string | null = null) => {
  const cookie = Cookie.get(name);

  console.debug(
    `Getting ${name} cookie ${debugLog ? `for '${debugLog}'` : ""}: ${cookie}`,
  );
  return cookie;
};

const setCookie = (
  name: string,
  value: string | null,
  debugLog: string | null = null,
) => {
  console.debug(
    `Setting ${name} cookie to ${value} ${
      debugLog ? `for '${debugLog}'` : null
    }`,
  );
  if (value === null) {
    Cookie.remove(name);
  } else {
    Cookie.set(name, value);
  }
};

const getWarehouseFieldOrder = (warehouseName: string | null) => {
  const defaultFieldOrder: WarehouseFieldOrder = {
    fieldName: null,
    ascending: null,
  };

  if (!warehouseName) {
    return defaultFieldOrder;
  }

  const warehouseFieldOrderCookie = getCookie(
    `${warehouseName}FieldOrder`,
    "getWarehouseFieldOrder",
  );

  const warehouseFieldOrder: WarehouseFieldOrder = warehouseFieldOrderCookie
    ? (JSON.parse(warehouseFieldOrderCookie) as WarehouseFieldOrder)
    : defaultFieldOrder;

  return warehouseFieldOrder;
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // *** Dark Mode *** //

  const [darkMode, setDarkMode] = useState<boolean>(
    getCookie("darkMode", "variable instantiation") === "1" || false,
  );

  const toggleDarkMode = useCallback(() => setDarkMode(!darkMode), [darkMode]);

  useEffect(() => {
    setCookie("darkMode", darkMode ? "1" : "0", "darkMode changed");
    document.documentElement.setAttribute(
      "data-bs-theme",
      darkMode ? "dark" : "light",
    );
  }, [darkMode]);

  // *** API Documentation Tooltip *** //

  const [showTooltip, setShowTooltip] = useState<boolean>(
    getCookie("showTooltip", "variable instantiation") === "1" || false,
  );

  const toggleShowTooltip = useCallback(
    () => setShowTooltip(!showTooltip),
    [showTooltip],
  );

  useEffect(() => {
    setCookie("showTooltip", showTooltip ? "1" : "0");
  }, [showTooltip]);

  // *** Actions Column *** //

  const [useFallbackActionsColumn, setUseFallbackActionsColumn] =
    useState<boolean>(true);

  const [showActionsColumn, setShowActionsColumn] = useState<boolean>(
    getCookie("showActionsColumn", "variable instantiation") === "1" || false,
  );

  const toggleShowActionsColumn = useCallback(() => {
    const newShowActionsColumn = !showActionsColumn;
    setShowActionsColumn(newShowActionsColumn);
    setCookie("showActionsColumn", newShowActionsColumn ? "1" : "0");
    setUseFallbackActionsColumn(false);
  }, [showActionsColumn]);

  // *** Warehouses *** //

  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [warehouseRefreshCount, setWarehouseRefreshCount] = useState(0);

  const refreshWarehouses = useCallback(async () => {
    const freshWarehouses = await getWarehouses();
    setWarehouses(freshWarehouses);
    setWarehouseRefreshCount(warehouseRefreshCount + 1);
  }, [warehouseRefreshCount]);

  // *** Display As Options *** //

  const setDisplayAsOption = useCallback(
    (warehouseName: string, fieldName: string, displayAs: FieldDisplayType) => {
      const updatedWarehouses: WarehouseType[] = _.cloneDeep(warehouses);
      const warehouse = updatedWarehouses.find(
        (warehouse) => warehouse.name === warehouseName,
      );

      if (!warehouse) {
        return;
      }

      console.debug(
        `Setting ${warehouseName}.${fieldName} display as ${displayAs}`,
      );

      warehouse.item_schema[fieldName].display_as = displayAs;
      setWarehouses(updatedWarehouses);
      setWarehouseRefreshCount(warehouseRefreshCount + 1);
    },
    [warehouseRefreshCount, warehouses],
  );

  const getDisplayAsOptions = useCallback(
    (warehouseName: string) => {
      const displayAsOptions: Record<string, FieldDisplayType> = {};

      if (warehouses.length === 0) {
        return displayAsOptions;
      }

      const warehouse = warehouses.find(
        (warehouse) => warehouse.name === warehouseName,
      );

      if (!warehouse) {
        return displayAsOptions;
      }

      Object.entries(warehouse.item_schema).forEach(
        ([fieldName, fieldDefinition]) => {
          displayAsOptions[fieldName] = fieldDefinition.display_as;
        },
      );

      return displayAsOptions;
    },
    [warehouses],
  );

  // *** Current Warehouse Field Order *** //

  const [currentWarehouseFieldOrder, setCurrentWarehouseFieldOrder] =
    useState<WarehouseFieldOrder | null>(null);

  const updateWarehouseFieldOrder = useCallback(
    (
      warehouseName: string,
      fieldName: string | null,
      ascending: boolean | null,
    ) => {
      const newFieldOrder = {
        fieldName: fieldName,
        ascending: ascending,
      };
      setCurrentWarehouseFieldOrder(newFieldOrder);

      setCookie(
        `${warehouseName}FieldOrder`,
        fieldName ? JSON.stringify(newFieldOrder) : null,
        "updateWarehouseFieldOrder",
      );
    },
    [],
  );

  // *** Current Warehouse Column Order *** //

  const [warehouseColumnOrderConfigs, setWarehouseColumnOrderConfigs] =
    useState<Record<string, string[]>>({});

  const updateWarehouseColumnOrder = useCallback(
    (
      warehouseName: string,
      oldIndex: number,
      newIndex: number,
      columns: string[] | null,
    ) => {
      let newColumnOrder: string[];

      if (!columns) {
        newColumnOrder = [...warehouseColumnOrderConfigs[warehouseName]].sort(
          (a, b) => a.localeCompare(b),
        );
      } else {
        newColumnOrder = arrayMove(columns, oldIndex, newIndex);
      }

      const newWarehouseColumnOrderConfigs = {
        ...warehouseColumnOrderConfigs,
        [warehouseName]: newColumnOrder,
      };

      setWarehouseColumnOrderConfigs(newWarehouseColumnOrderConfigs);

      setCookie(
        `${warehouseName}ColumnOrder`,
        JSON.stringify(newColumnOrder),
        "updateWarehouseColumnOrder",
      );

      return newWarehouseColumnOrderConfigs[warehouseName];
    },
    [warehouseColumnOrderConfigs],
  );

  // *** Initialisation *** //

  const searchParams = useSearchParams();

  const currentWarehouseName = searchParams.get("warehouse") || null;

  useEffect(() => {
    const initialWarehouseFieldOrder =
      getWarehouseFieldOrder(currentWarehouseName);

    setCurrentWarehouseFieldOrder(initialWarehouseFieldOrder);
  }, [currentWarehouseName]);

  useEffect(() => {
    refreshWarehouses()
      .then(() => {})
      .catch((error) => {
        console.error("Couldn't refresh warehouses:", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (warehouses) {
      const newWarehouseColumnOrderConfigs: Record<string, string[]> = {};

      warehouses.forEach((warehouse: WarehouseType) => {
        const columnOrderCookie = getCookie(`${warehouse.name}ColumnOrder`);
        if (columnOrderCookie) {
          let cookieFields: string[] = [];
          try {
            cookieFields = JSON.parse(columnOrderCookie) as string[];
          } catch (error) {
            console.error(
              `Couldn't parse ${warehouse.name}ColumnOrder cookie: ${columnOrderCookie}`,
            );
          }
          const warehouseFields = Object.keys(warehouse.item_schema);

          if (
            !_.isEqual(
              [...cookieFields].sort((a, b) => a.localeCompare(b)),
              [...warehouseFields].sort((a, b) => a.localeCompare(b)),
            )
          ) {
            const fields = cookieFields
              .filter((field) => warehouseFields.includes(field))
              .concat(
                warehouseFields.filter(
                  (field) => !cookieFields.includes(field),
                ),
              );

            setCookie(`${warehouse.name}ColumnOrder`, JSON.stringify(fields));
            newWarehouseColumnOrderConfigs[warehouse.name] = fields;
          } else {
            newWarehouseColumnOrderConfigs[warehouse.name] = cookieFields;
          }
        }
      });

      setWarehouseColumnOrderConfigs(newWarehouseColumnOrderConfigs);
    }
  }, [warehouses]);

  // *** Values Export *** //

  const value = useMemo(
    () => ({
      darkMode,
      showTooltip,
      showActionsColumn,
      toggleDarkMode,
      toggleShowTooltip,
      toggleShowActionsColumn,
      warehouses,
      setWarehouses,
      refreshWarehouses,
      warehouseRefreshCount,
      setDisplayAsOption,
      setWarehouseRefreshCount,
      getDisplayAsOptions,
      updateWarehouseFieldOrder,
      currentWarehouseFieldOrder,
      warehouseColumnOrderConfigs,
      setWarehouseColumnOrderConfigs,
      updateWarehouseColumnOrder,
      useFallbackActionsColumn,
    }),
    [
      darkMode,
      showTooltip,
      showActionsColumn,
      toggleDarkMode,
      toggleShowTooltip,
      toggleShowActionsColumn,
      warehouses,
      refreshWarehouses,
      warehouseRefreshCount,
      setDisplayAsOption,
      getDisplayAsOptions,
      updateWarehouseFieldOrder,
      currentWarehouseFieldOrder,
      warehouseColumnOrderConfigs,
      setWarehouseColumnOrderConfigs,
      updateWarehouseColumnOrder,
      useFallbackActionsColumn,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
