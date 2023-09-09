"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Pagination from "react-bootstrap/Pagination";
import styles from "../../../styles/Paginator.module.scss";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";

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

interface PaginationItemProps {
  number: number;
  currentPage: number;
  warehouseName: string;
  router: AppRouterInstance;
}

const PaginationItem: React.FC<PaginationItemProps> = ({
  number,
  currentPage,
  warehouseName,
  router,
}) => (
  <Pagination.Item
    linkClassName={`${styles.paginatorItemLink} ${
      number === currentPage ? styles.paginatorItemLinkActive : ""
    }`}
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
  const items = [];

  if (totalPages <= config.maxShowPages) {
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <PaginationItem
          key={`paginator-item-${number}`}
          number={number}
          currentPage={currentPage}
          warehouseName={warehouseName}
          router={router}
        />,
      );
    }
  } else {
    items.push(
      <PaginationItem
        key={"paginator-item-1"}
        number={1}
        currentPage={currentPage}
        warehouseName={warehouseName}
        router={router}
      />,
    );

    if (currentPage < config.maxShowPages) {
      for (
        let number = 2;
        number <= Math.max(config.maxShowPages, currentPage + 1);
        number++
      ) {
        items.push(
          <PaginationItem
            key={`paginator-item-${number}`}
            number={number}
            currentPage={currentPage}
            warehouseName={warehouseName}
            router={router}
          />,
        );
      }

      items.push(
        <Pagination.Ellipsis
          key="ellipsis-last"
          linkClassName={styles.paginatorItemLink}
        />,
      );

      items.push(
        <PaginationItem
          key={`paginator-item-${totalPages}`}
          number={totalPages}
          currentPage={currentPage}
          warehouseName={warehouseName}
          router={router}
        />,
      );
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
        items.push(
          <PaginationItem
            key={`paginator-item-${number}`}
            number={number}
            currentPage={currentPage}
            warehouseName={warehouseName}
            router={router}
          />,
        );
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
        items.push(
          <PaginationItem
            key={`paginator-item-${number}`}
            number={number}
            currentPage={currentPage}
            warehouseName={warehouseName}
            router={router}
          />,
        );
      }

      items.push(
        <Pagination.Ellipsis
          key="ellipsis-last"
          linkClassName={styles.paginatorItemLink}
        />,
      );

      items.push(
        <PaginationItem
          key={`paginator-item-${totalPages}`}
          number={totalPages}
          currentPage={currentPage}
          warehouseName={warehouseName}
          router={router}
        />,
      );
    }
  }

  return (
    <Pagination size="sm" className="mt-3 me-3">
      {items}
    </Pagination>
  );
};

export default Paginator;
