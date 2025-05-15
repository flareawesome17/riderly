import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import EmergencyTable from "./Tables/EmergencyTable";

export default function Emergencies() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Emergencies" />
      <div className="space-y-6">
        <ComponentCard title="Emergencies">
          <EmergencyTable />
        </ComponentCard>
      </div>
    </>
  );
}
