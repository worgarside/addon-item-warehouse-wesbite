"use client";

import React, { useRef, useState, useEffect } from "react";

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

const TimeSince: React.FC<{ dttm: Date | undefined }> = ({ dttm }) => {
  if (!dttm) {
    return null;
  }

  const now = new Date();
  let secondsPast = (now.getTime() - dttm.getTime()) / 1000;
  let value: number = secondsPast;
  let unit: string = "";

  const timeUnits = [
    { unit: "second", factor: 60 },
    { unit: "minute", factor: 60 },
    { unit: "hour", factor: 24 },
    { unit: "day", factor: 30.44 },
    { unit: "month", factor: 12 },
    { unit: "year", factor: Infinity },
  ];

  for (const { unit: u, factor } of timeUnits) {
    if (secondsPast < factor || factor === Infinity) {
      unit = u;
      value = secondsPast;
      break;
    }
    secondsPast /= factor;
  }

  const roundedValue = Math.round(value);
  return (
    <span className="text-muted">{`${roundedValue} ${unit}${
      roundedValue > 1 ? "s" : ""
    } ago`}</span>
  );
};

const Cell: React.FC<CellProps> = ({
  value,
  header,
  displayAsOption,
  type,
}) => {
  const codeRef = useRef<HTMLDivElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  let formattedContent: string;
  const displayAsDateTime = displayAsOption === FieldDisplayType.DateTime;

  let dttm: Date | undefined = undefined;

  if (value === null) {
    formattedContent = "null";
  } else if (displayAsDateTime) {
    dttm = new Date(Number(value) * 1000);
    if (type === "float") {
      formattedContent = dttm.toISOString();
    } else {
      formattedContent = String(value);
    }
  } else if (displayAsOption === FieldDisplayType.Number) {
    formattedContent = Number(value).toLocaleString();
  } else if (displayAsOption === FieldDisplayType.Boolean) {
    formattedContent = value === "true" ? "✅" : "❌";
  } else {
    formattedContent = String(value);
  }

  useEffect(() => {
    if (codeRef.current) {
      const { clientHeight, clientWidth } = codeRef.current;
      const overflowCondition =
        clientHeight > cellHeightInPixels || clientWidth > cellWidthInPixels;
      setIsOverflowing(overflowCondition);
    }
  }, []);

  return (
    <td className="position-relative p-0">
      <div className={styles.cellOuter}>
        <div className={styles.cellContent}>
          <pre className={styles.preFullHeight}>
            <code className="p-1" ref={codeRef}>
              {formattedContent}
              {displayAsDateTime && (
                <>
                  <br />
                  <TimeSince dttm={dttm} />
                </>
              )}
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
