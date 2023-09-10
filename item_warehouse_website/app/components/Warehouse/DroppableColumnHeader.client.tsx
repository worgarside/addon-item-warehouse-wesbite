"use client";

import React from "react";
import styles from "styles/Warehouse/DroppableColumnHeader.module.scss";
import Icon from "@mdi/react";
import { mdiMenuDown, mdiMenuUp, mdiCircleSmall } from "@mdi/js";
import { Button } from "react-bootstrap";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface DraggableHeaderProps {
  header: string;
  onDrop: (from: string, to: string) => void;
  handleClick: (header: string) => void;
  orderBy: string | null;
  ascending: boolean | null;
}

const DroppableColumnHeader: React.FC<DraggableHeaderProps> = ({
  header,
  handleClick,
  orderBy,
  ascending,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: header });

  return (
    <th
      scope="col"
      className="font-monospace user-select-none p-0"
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition ?? undefined,
      }}
      {...attributes}
      {...listeners}
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
