import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/globals.scss";
import { apiBaseUrl, getWarehouses } from "services/api";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Sidebar from "./components/Sidebar.client";
import styles from "./styles/layout.module.scss";
import { cookies } from "next/headers";
import { SettingsProvider } from "./components/SettingsContext.client";
const poppins = Poppins({ subsets: ["latin"], weight: "300" });

export const metadata: Metadata = {
  title: "Item Warehouse",
  description: "A database with an API in front of it.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!apiBaseUrl) {
    return (
      <html lang="en">
        <body className={poppins.className}>
          <div className="alert alert-warning" role="alert">
            <h1>API Base URL not set</h1>
            <p>
              The API base URL is not set. Please set the{" "}
              <code>NEXT_PUBLIC_API_BASE_URL</code> environment variable.
            </p>
          </div>
        </body>
      </html>
    );
  }

  const warehouses = await getWarehouses();

  const colorMode = cookies().get("darkMode")?.value === "1" ? "dark" : "light";

  return (
    <html lang="en" data-bs-theme={colorMode}>
      <body className={poppins.className}>
        <div className={styles.container}>
          <SettingsProvider>
            <Sidebar warehouses={warehouses} />
            <div className={styles.content}>{children}</div>
          </SettingsProvider>
        </div>
      </body>
    </html>
  );
}
