"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Pagination from "react-bootstrap/Pagination";
import styles from "../styles/Paginator.module.scss";

const hassioRefererPath: string = process.env.NEXT_PUBLIC_HASSIO_REFERER_PATH
  ? "/" +
    process.env.NEXT_PUBLIC_HASSIO_REFERER_PATH.replace(/(^\/+)|(\/+$)/g, "") +
    "/"
  : "";

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  warehouseName: string;
}

const Paginator: React.FC<PaginatorProps> = ({
  currentPage,
  totalPages,
  warehouseName,
}) => {
  const router = useRouter();
  const config = {
    maxShowPages: 5,
    showEitherSideOfCurrent: 1,
  };

  const PaginationItem: React.FC<{ number: number }> = ({ number }) => (
    <Pagination.Item
      linkClassName={`${styles.paginatorItemLink} ${
        number === currentPage ? styles.paginatorItemLinkActive : ""
      }`}
      key={number}
      active={number === currentPage}
      onClick={() => {
        router.push(
          `${hassioRefererPath}/?warehouse=${warehouseName}&page=${number}`,
        );
        router.refresh();
      }}
      className={styles.paginatorItem}
    >
      {number}
    </Pagination.Item>
  );

  const items = [];

  if (totalPages <= config.maxShowPages) {
    for (let number = 1; number <= totalPages; number++) {
      items.push(<PaginationItem number={number} />);
    }
  } else {
    items.push(<PaginationItem number={1} />);

    if (currentPage < config.maxShowPages) {
      for (
        let number = 2;
        number <= Math.max(config.maxShowPages, currentPage + 1);
        number++
      ) {
        items.push(<PaginationItem number={number} />);
      }

      items.push(
        <Pagination.Ellipsis
          key="ellipsis-last"
          linkClassName={styles.paginatorItemLink}
        />,
      );

      items.push(<PaginationItem number={totalPages} />);
    } else if (currentPage > totalPages - config.maxShowPages + 1) {
      items.push(
        <Pagination.Ellipsis
          key="ellipsis-first"
          linkClassName={styles.paginatorItemLink}
        />,
      );

      for (
        let number = Math.min(
          totalPages - config.maxShowPages + 1,
          currentPage - 1,
        );
        number <= totalPages;
        number++
      ) {
        items.push(<PaginationItem number={number} />);
      }
    } else {
      items.push(
        <Pagination.Ellipsis
          key="ellipsis-first"
          linkClassName={styles.paginatorItemLink}
        />,
      );

      for (
        let number = currentPage - config.showEitherSideOfCurrent;
        number <= currentPage + config.showEitherSideOfCurrent;
        number++
      ) {
        items.push(<PaginationItem number={number} />);
      }

      items.push(
        <Pagination.Ellipsis
          key="ellipsis-last"
          linkClassName={styles.paginatorItemLink}
        />,
      );

      items.push(<PaginationItem number={totalPages} />);
    }
  }

  return (
    <Pagination size="sm" className="mt-3 me-3">
      {items}
    </Pagination>
  );
};

export default Paginator;
