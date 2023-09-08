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

const TimeSince: React.FC<{
  displayAsOption: FieldDisplayType.Date | FieldDisplayType.DateTime;
  dttm: Date | undefined;
}> = ({ displayAsOption, dttm }) => {
  if (!dttm) {
    return null;
  }

  const now = new Date();
  let secondsPast = (now.getTime() - dttm.getTime()) / 1000;
  let value: number = secondsPast;
  let unit: string = "";

  const timeUnits = [
    { unit: "second", factor: 60, showForDate: false },
    { unit: "minute", factor: 60, showForDate: false },
    { unit: "hour", factor: 24, showForDate: false },
    { unit: "day", factor: 30.44, showForDate: true },
    { unit: "month", factor: 12, showForDate: true },
    { unit: "year", factor: Infinity, showForDate: true },
  ];

  for (const { unit: u, factor, showForDate } of timeUnits) {
    if (
      (secondsPast < factor || factor === Infinity) &&
      (showForDate || displayAsOption === FieldDisplayType.DateTime)
    ) {
      unit = u;
      value = secondsPast;

      break;
    }
    secondsPast /= factor;
  }

  const roundedValue = Math.round(value);
  return (
    <span className="text-muted">{`${roundedValue} ${unit}${
      roundedValue != 1 ? "s" : ""
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
  const displayTimeSince =
    displayAsOption === FieldDisplayType.Date ||
    displayAsOption === FieldDisplayType.DateTime;

  let dttm: Date | undefined = undefined;

  if (value === null) {
    formattedContent = "null";
  } else if (displayTimeSince) {
    if (type === "float" || type === "integer") {
      dttm = new Date(Number(value) * 1000);
    } else {
      dttm = new Date(String(value));
    }

    if (displayAsOption === FieldDisplayType.Date) {
      try {
        formattedContent = dttm.toISOString().split("T")[0];
      } catch (e) {
        formattedContent = type + String(value);
      }
    } else {
      if (type === "float") {
        formattedContent = dttm.toISOString();
      } else {
        formattedContent = String(value);
      }
    }
  } else if (displayAsOption === FieldDisplayType.Number) {
    formattedContent = Number(value).toLocaleString();
  } else if (displayAsOption === FieldDisplayType.Boolean) {
    formattedContent = value ? "✅" : "❌";
  } else if (displayAsOption === FieldDisplayType.Json) {
    formattedContent = JSON.stringify(value, null, 2);
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
  }, [value]);

  return (
    <td className="position-relative p-0">
      <div className={styles.cellOuter}>
        <div className={styles.cellContent}>
          <pre className={styles.preFullHeight}>
            <code className="p-1" ref={codeRef}>
              {formattedContent}
              {displayTimeSince && (
                <>
                  <br />
                  <TimeSince displayAsOption={displayAsOption} dttm={dttm} />
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
