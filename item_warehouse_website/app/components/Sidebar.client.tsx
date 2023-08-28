"use client";

import React from "react";
import { apiBaseUrl } from "../services/api";
import styles from "../styles/Sidebar.module.css";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiWarehouse } from "@mdi/js";
import {
  ListGroup,
  OverlayTrigger,
  Tooltip,
  TooltipProps,
} from "react-bootstrap";
import { useRouter } from "next/navigation";

interface Warehouse {
  name: string;
}

const hassioRefererPath: string = process.env.NEXT_PUBLIC_HASSIO_REFERER_PATH
  ? "/" + process.env.NEXT_PUBLIC_HASSIO_REFERER_PATH.replace(/^\/|\/$/g, "")
  : "";

const Sidebar: React.FC<{
  warehouses: Warehouse[];
}> = ({ warehouses }) => {
  const router = useRouter();

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
      <ListGroup>
        {warehouses.map((warehouse: Warehouse) => (
          <ListGroup.Item
            key={warehouse.name}
            active={false}
            className={styles.warehouseItem}
            onClick={() => {
              router.push(`${hassioRefererPath}/?warehouse=${warehouse.name}`);
              router.refresh();
            }}
          >
            <Icon className="me-2" path={mdiWarehouse} size={1} />
            {warehouse.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Sidebar;
export const dynamic = "force-dynamic";
