"use client";

import Dropdown from "react-bootstrap/Dropdown";
import Cookie from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "styles/Warehouse/NavBar/PageSizeDropdown.module.scss";

const hassioRefererPath: string = process.env.NEXT_PUBLIC_HASSIO_REFERER_PATH
  ? "/" +
    process.env.NEXT_PUBLIC_HASSIO_REFERER_PATH.replace(/(^\/+)|(\/+$)/g, "") +
    "/"
  : "";

interface PageSizeDropdownProps {
  currentPageSize: string;
  warehouseName: string;
}

const PageSizeDropdown: React.FC<PageSizeDropdownProps> = ({
  currentPageSize,
  warehouseName,
}) => {
  const router = useRouter();

  const pageNumber = useSearchParams().get("page");
  const pageSizes = [5, 10, 20, 30, 40, 50, 100];

  return (
    <>
      <div>
        <Dropdown
          className={styles.dropdown}
          onSelect={(eventKey: string | null) => {
            if (eventKey === null) {
              return;
            }
            Cookie.set("pageSize", eventKey);

            if (pageNumber !== null) {
              router.push(`${hassioRefererPath}/?warehouse=${warehouseName}`);
            }

            router.refresh();
          }}
        >
          <Dropdown.Toggle
            id="page-size-dropdown"
            className={`cursor-pointer ${styles.dropdownToggle}`}
            size="sm"
            variant="secondary"
          >
            Page size: {currentPageSize}
          </Dropdown.Toggle>

          <Dropdown.Menu className={styles.dropdownMenu}>
            {process.env.NODE_ENV !== "production" ? (
              <Dropdown.Item className={styles.dropdownItem} eventKey="1">
                1
              </Dropdown.Item>
            ) : null}
            {pageSizes.map((pageSize) => (
              <Dropdown.Item
                active={currentPageSize === pageSize.toString()}
                className={`${styles.dropdownItem} ${
                  currentPageSize === pageSize.toString()
                    ? styles.dropdownItemActive
                    : null
                }`}
                eventKey={pageSize.toString()}
                key={`pageSize-${pageSize}`}
              >
                {pageSize}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
};

export default PageSizeDropdown;
