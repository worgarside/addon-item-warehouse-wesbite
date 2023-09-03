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
import {
  FieldDisplayType,
  WarehouseType,
  getWarehouses,
} from "../services/api";
import _ from "lodash";

interface SettingsContextProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  showTooltip: boolean;
  toggleShowTooltip: () => void;
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

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // *** Dark Mode *** //

  const [darkMode, setDarkMode] = useState<boolean>(
    Cookie.get("darkMode") === "1" || false,
  );

  const toggleDarkMode = useCallback(() => setDarkMode(!darkMode), [darkMode]);

  useEffect(() => {
    Cookie.set("darkMode", darkMode ? "1" : "0");
    document.documentElement.setAttribute(
      "data-bs-theme",
      darkMode ? "dark" : "light",
    );
  }, [darkMode]);

  // *** API Documentation Tooltip *** //

  const [showTooltip, setShowTooltip] = useState<boolean>(
    Cookie.get("showTooltip") === "1" || false,
  );

  const toggleShowTooltip = useCallback(
    () => setShowTooltip(!showTooltip),
    [showTooltip],
  );

  useEffect(() => {
    Cookie.set("showTooltip", showTooltip ? "1" : "0");
  }, [showTooltip]);

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

  // *** Initialisation *** //

  useEffect(() => {
    const initialDarkMode = Cookie.get("darkMode") === "1";
    const initialShowTooltip = Cookie.get("showTooltip") === "1";

    setDarkMode(initialDarkMode);
    setShowTooltip(initialShowTooltip);
  }, []);

  useEffect(() => {
    refreshWarehouses()
      .then(() => {})
      .catch((error) => {
        console.error("Couldn't refresh warehouses:", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // *** Values Export *** //

  const value = useMemo(
    () => ({
      darkMode,
      showTooltip,
      toggleDarkMode,
      toggleShowTooltip,
      warehouses,
      setWarehouses,
      refreshWarehouses,
      warehouseRefreshCount,
      setDisplayAsOption,
      setWarehouseRefreshCount,
      getDisplayAsOptions,
    }),
    [
      darkMode,
      showTooltip,
      toggleDarkMode,
      toggleShowTooltip,
      warehouses,
      refreshWarehouses,
      warehouseRefreshCount,
      setDisplayAsOption,
      getDisplayAsOptions,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
