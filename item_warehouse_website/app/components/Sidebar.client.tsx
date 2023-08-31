"use client";

import React from "react";
import { apiBaseUrl } from "../services/api";
import styles from "../styles/Sidebar.module.scss";
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
import SettingsModal from "./SettingsModal.client";

interface Warehouse {
  name: string;
}

const hassioRefererPath: string = process.env.NEXT_PUBLIC_HASSIO_REFERER_PATH
  ? "/" +
    process.env.NEXT_PUBLIC_HASSIO_REFERER_PATH.replace(/(^\/+)|(\/+$)/g, "") +
    "/"
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
        delay={{ show: 250, hide: 1000 }}
        overlay={renderTooltip}
      >
        <h2
          className={`text-center my-1 fw-bold user-select-none ${styles.header}`}
        >
          Warehouses
        </h2>
      </OverlayTrigger>
      <ListGroup className={`list-group-flush mb-auto`}>
        {warehouses.map((warehouse: Warehouse) => (
          <ListGroup.Item
            key={warehouse.name}
            active={false}
            className={`list-group-item list-group-item-action ${styles.warehouseItem}`}
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

      <SettingsModal />
    </div>
  );
};

export default Sidebar;
