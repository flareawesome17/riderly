import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import DevicesTable from "./Tables/DevicesTable";

export default function Devices() {
  return (
    <>
      <PageMeta
        title="Devices | Riderly"
        description="Manage and monitor all connected devices in the Riderly system"
      />
      <PageBreadcrumb pageTitle="Devices" />
      <div className="space-y-6">
        <ComponentCard title="Devices">
          <DevicesTable />
        </ComponentCard>
      </div>
    </>
  );
}
