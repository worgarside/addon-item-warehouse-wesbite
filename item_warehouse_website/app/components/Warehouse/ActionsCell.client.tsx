"use client";

import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import Icon from "@mdi/react";
import { mdiAlertCircleOutline, mdiLoading, mdiTrashCan } from "@mdi/js";
import styles from "styles/Warehouse/ActionsCell.module.scss";
import { deleteItem } from "services/api";
import { useRouter } from "next/navigation";

interface ActionsCellProps {
  item: Record<string, string | number | boolean | null>;
  itemName: string;
  warehouseName: string;
  primaryKeyNames: string[];
}

const ActionsCell: React.FC<ActionsCellProps> = ({
  item,
  itemName,
  warehouseName,
  primaryKeyNames,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);

  const router = useRouter();

  const handleDeleteClick = () => {
    const deleteConfirm = confirm(
      `Are you sure you want to delete this ${itemName}?`,
    );

    if (deleteConfirm) {
      setLoading(true);
      setError(false);

      const itemPkDict = primaryKeyNames.reduce(
        (acc, key) => {
          acc[key] = item[key];
          return acc;
        },
        {} as Record<string, string | number | boolean | null>,
      );

      deleteItem(warehouseName, itemPkDict)
        .then((result) => {
          setLoading(false);
          if (result) {
            setError(false);
            router.refresh();
          } else {
            setError(true);

            setTimeout(() => {
              setError(false);
            }, 5000);
          }
        })
        .catch((error) => {
          alert(error);
          setLoading(false);
          setError(true);

          setTimeout(() => {
            setError(false);
          }, 5000);
        });
    }
  };

  return (
    <td className="p-0 position-relative">
      <Container
        className={`d-flex justify-content-center align-items-center ${styles.container}`}
        fluid
      >
        <Button
          variant="outline-danger"
          size="sm"
          className="d-flex"
          onClick={handleDeleteClick}
        >
          <Icon
            path={
              loading ? mdiLoading : error ? mdiAlertCircleOutline : mdiTrashCan
            }
            size={1}
            spin={loading}
          />
        </Button>
      </Container>
    </td>
  );
};

export default ActionsCell;
