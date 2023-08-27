"use client";

import React, { useEffect, useState } from "react";
import { apiBaseUrl, getWarehouses } from "../services/api";
import styles from "../styles/Sidebar.module.css";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiWarehouse } from "@mdi/js";
import { OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";

interface Warehouse {
  name: string;
}

const Sidebar: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  const renderTooltip = (
    props: React.JSX.IntrinsicAttributes &
      TooltipProps &
      React.RefAttributes<HTMLDivElement>,
  ) => (
    <Tooltip id="button-tooltip" {...props}>
      <Link
        className={styles.tooltip}
        target="_blank"
        href={`${apiBaseUrl}/docs`}
      >
        {apiBaseUrl}
      </Link>
    </Tooltip>
  );

  useEffect(() => {
    getWarehouses()
      .then((warehouses) => {
        setWarehouses(warehouses);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className={styles.sidebar}>
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 250, hide: 400 }}
        overlay={renderTooltip}
      >
        <h2 className={`text-center my-1 fw-bold ${styles.header}`}>
          Warehouses
        </h2>
      </OverlayTrigger>
      <div className="list-group">
        {warehouses.map((warehouse: Warehouse) => (
          <Link
            key={warehouse.name}
            className="list-group-item text-decoration-none"
            href={`/warehouse/${encodeURIComponent(warehouse.name)}`}
          >
            <Icon className="me-2" path={mdiWarehouse} size={1} />
            {warehouse.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
export const dynamic = "force-dynamic";
