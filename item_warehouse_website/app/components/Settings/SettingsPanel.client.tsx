"use client";

import React from "react";
import { Container } from "react-bootstrap";
import ToggleSetting from "./ToggleSetting.client";

interface SettingsPanelProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  showTooltip: boolean;
  toggleShowTooltip: () => void;
  showActionsColumn: boolean;
  toggleShowActionsColumn: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  darkMode,
  toggleDarkMode,
  showTooltip,
  toggleShowTooltip,
  showActionsColumn,
  toggleShowActionsColumn,
}) => {
  return (
    <Container>
      <ToggleSetting
        name="Dark Mode"
        initialValue={darkMode}
        description="Enable dark mode"
        callback={toggleDarkMode}
      />
      <ToggleSetting
        name="API Documentation Tooltip"
        initialValue={showTooltip}
        description='Display a tooltip with a link to the API documentation when you hover over "Warehouses"'
        callback={toggleShowTooltip}
      />
      <ToggleSetting
        name="Show Actions"
        initialValue={showActionsColumn}
        description="Show the actions column in the warehouse tables"
        callback={toggleShowActionsColumn}
      />
    </Container>
  );
};
