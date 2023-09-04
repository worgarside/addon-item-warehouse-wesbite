"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

import styles from "../styles/Cell.module.scss";

import FullContentModal from "./FullContentModal.client";
import { FieldDisplayType } from "../services/api";

interface CellProps {
  value: boolean | number | string | null;
  header: string;
  type: string;
  displayAsOption?: FieldDisplayType;
}

const cellHeightInPixels = 64;
const cellWidthInPixels = 480;

const Cell: React.FC<CellProps> = ({
  value,
  header,
  displayAsOption,
  type,
}) => {
  const codeRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const contentString = value === null ? "null" : String(value);

  const formatContent = useCallback(
    (content: string) => {
      if (displayAsOption === FieldDisplayType.Number) {
        return Number(content).toLocaleString();
      } else if (displayAsOption === FieldDisplayType.Boolean) {
        return content === "true" ? "✅" : "❌";
      } else if (displayAsOption === FieldDisplayType.DateTime) {
        if (type === "float") {
          return new Date(Number(content) * 1000).toISOString();
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
    if (codeRef.current) {
      const { clientHeight, clientWidth } = codeRef.current;
      const overflowCondition =
        clientHeight > cellHeightInPixels || clientWidth > cellWidthInPixels;
      console.log("Is it overflowing?", overflowCondition); // Debug line
      setIsOverflowing(overflowCondition);
    }
  }, []);

  useEffect(() => {
    setFormattedContent(formatContent(contentString));
  }, [formatContent, contentString]);

  return (
    <td className="position-relative p-0">
      <div className={styles.cellOuter}>
        <div className={styles.cellContent}>
          <pre className={styles.preFullHeight}>
            <code className="p-1" ref={codeRef}>
              {formattedContent}
            </code>
          </pre>
        </div>
      </div>
      {isOverflowing && (
        <FullContentModal content={formattedContent} header={header} />
      )}
    </td>
  );
};

export default Cell;
