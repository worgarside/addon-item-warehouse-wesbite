import WarehousePage from "./components/WarehousePage.server";

export default function Page({
  searchParams,
}: {
  searchParams: { warehouse: string; page: string };
}) {
  if (!searchParams.warehouse) {
    return (
      <>
        <h1>Welcome to the Item Warehouse</h1>
        <p>Select a warehouse from the sidebar to view its items.</p>
      </>
    );
  }

  const warehouseName = searchParams.warehouse;
  const page = searchParams.page;

  return <WarehousePage warehouseName={warehouseName} page={page} />;
}
