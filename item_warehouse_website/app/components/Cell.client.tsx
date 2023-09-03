"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

import styles from "../styles/Cell.module.scss";

import FullContentModal from "./FullContentModal.client";
import { FieldDisplayType } from "../services/api";

const epochToCustomFormat = (epoch: number): string => {
  const d = new Date(epoch * 1000);
  return `${d.toISOString().split("T")[1].split(".")[0]} ${
    d.toISOString().split("T")[0]
  }`;
};

interface CellProps {
  value: boolean | number | string | null;
  header: string;
  type: string;
  displayAsOption?: FieldDisplayType;
}

const Cell: React.FC<CellProps> = ({
  value,
  header,
  displayAsOption,
  type,
}) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const cellRef = useRef<HTMLDivElement | null>(null);

  const contentString = value === null ? "null" : String(value);

  const formatContent = useCallback(
    (content: string) => {
      if (displayAsOption === FieldDisplayType.Number) {
        return Number(content).toLocaleString();
      } else if (displayAsOption === FieldDisplayType.Boolean) {
        return content === "true" ? "✅" : "❌";
      } else if (displayAsOption === FieldDisplayType.DateTime) {
        if (type === "float") {
          return epochToCustomFormat(Number(content));
        }
      }

      return content;
    },
    [displayAsOption, type],
  );

  const [formattedContent, setFormattedContent] = useState<string>(
    formatContent(contentString),
  );

  useEffect(() => {
    if (cellRef.current) {
      const element = cellRef.current;
      if (element.scrollHeight > element.clientHeight) {
        setIsOverflowing(true);
      } else {
        setIsOverflowing(false);
      }
    }
  }, [contentString]);

  useEffect(() => {
    setFormattedContent(formatContent(contentString));
  }, [formatContent, contentString]);

  return (
    <td className="px-1 py-1">
      <div className={styles.cellInner} ref={cellRef} key={displayAsOption}>
        {isOverflowing ? (
          <>
            <div className={styles.scrollable}>
              <pre>
                <code
                  className={
                    contentString == "null" ? "text-muted" : styles.code
                  }
                >
                  {formattedContent}
                </code>
              </pre>
            </div>
            <FullContentModal content={formattedContent} header={header} />
          </>
        ) : (
          <code
            className={contentString == "null" ? "text-muted" : styles.code}
          >
            {formattedContent}
          </code>
        )}
      </div>
    </td>
  );
};

export default Cell;
