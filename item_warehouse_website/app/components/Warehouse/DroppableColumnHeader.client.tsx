"use client";
import React from "react";
import styles from "styles/Warehouse.module.scss";
import Icon from "@mdi/react";
import { mdiMenuDown, mdiMenuUp, mdiCircleSmall } from "@mdi/js";
import { Button } from "react-bootstrap";
import { useDrag, useDrop } from "react-dnd";

export interface DraggableHeaderProps {
  header: string;
  onDrop: (from: string, to: string) => void;
  handleClick: (header: string) => void;
  orderBy: string | null;
  ascending: boolean | null;
}

const DroppableColumnHeader: React.FC<DraggableHeaderProps> = ({
  header,
  onDrop,
  handleClick,
  orderBy,
  ascending,
}) => {
  const [, refDrag] = useDrag({
    type: "COLUMN",
    item: { header },
  });

  const [, refDrop] = useDrop({
    accept: "COLUMN",
    drop: (item: { header: string }) => onDrop(item.header, header),
  });

  return (
    <th
      scope="col"
      ref={(el) => refDrag(refDrop(el))}
      key={header}
      className="font-monospace user-select-none p-0"
    >
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => handleClick(header)}
        className={`d-flex justify-content-between align-items-center text-muted cursor-pointer ${styles.headerButton}`}
      >
        <span>{header}</span>
        <Icon
          className={`${styles.headerIcon} ${
            header === orderBy && styles.headerIconActive
          }`}
          path={
            header == orderBy
              ? ascending
                ? mdiMenuUp
                : mdiMenuDown
              : mdiCircleSmall
          }
          size={1.25}
        />
      </Button>
    </th>
  );
};

export default DroppableColumnHeader;
