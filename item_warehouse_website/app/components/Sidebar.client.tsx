"use client";

import React, { useState } from "react";
import { apiBaseUrl } from "../services/api";
import styles from "../styles/Sidebar.module.scss";
import Link from "next/link";
import Icon from "@mdi/react";
import {
  mdiWarehouse,
  mdiArrowCollapseLeft,
  mdiArrowCollapseRight,
} from "@mdi/js";
import {
  Button,
  Col,
  Container,
  ListGroup,
  OverlayTrigger,
  Row,
  Tooltip,
  TooltipProps,
} from "react-bootstrap";
import { useRouter } from "next/navigation";
import SettingsModal from "./SettingsModal.client";
import { useSettings } from "./SettingsContext.client";

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const router = useRouter();

  const { showTooltip } = useSettings();

  const renderTooltip = (
    props: React.JSX.IntrinsicAttributes &
      TooltipProps &
      React.RefAttributes<HTMLDivElement>,
  ) => (
    <Tooltip id="api-docs-tooltip" className={styles.tooltip} {...props}>
      <Link
        className={styles.tooltipLink}
        target="_blank"
        href={`${apiBaseUrl}/docs`}
      >
        {apiBaseUrl}
      </Link>
    </Tooltip>
  );

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
      <Container>
        <Row className="flex-nowrap d-flex align-items-center">
          <Col className="px-0" xs="auto">
            <Button
              className={`px-0 ${styles.collapseButton} ${
                isCollapsed ? styles.collapsed : null
              }`}
              onClick={toggleSidebar}
            >
              <Icon
                className={`${styles.collapseIcon} ${
                  isCollapsed ? styles.collapsed : null
                }`}
                path={
                  isCollapsed ? mdiArrowCollapseRight : mdiArrowCollapseLeft
                }
                size={1}
              />
            </Button>
          </Col>
          <Col className="flex-grow-1 ">
            <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 1000 }}
              overlay={showTooltip ? renderTooltip : <></>}
            >
              <h3 className={`text-center my-0 fw-bold user-select-none`}>
                Warehouses
              </h3>
            </OverlayTrigger>
          </Col>
        </Row>
      </Container>
      <ListGroup className={`list-group-flush mb-auto`}>
        {warehouses.map((warehouse: Warehouse) => (
          <ListGroup.Item
            key={warehouse.name}
            active={false}
            className={`d-flex flex-nowrap list-group-item list-group-item-action ${
              isCollapsed ? styles.collapsed : null
            } ${styles.warehouseItem}`}
            onClick={() => {
              router.push(`${hassioRefererPath}/?warehouse=${warehouse.name}`);
              router.refresh();
            }}
          >
            <Col xs="auto">
              <Icon
                className={`flex-shrink-0 ${styles.warehouseIcon}`}
                path={mdiWarehouse}
                size={1}
              />
            </Col>
            <Col
              className={`ps-2 ${styles.warehouseItemNameCol} ${
                isCollapsed ? styles.collapsed : null
              }`}
            >
              {warehouse.name}
            </Col>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <SettingsModal isCollapsed={isCollapsed} />
    </div>
  );
};

export default Sidebar;
