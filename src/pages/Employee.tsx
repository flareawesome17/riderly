import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import EmployeeTable from "./Tables/EmployeeTable";

export default function Employee() {
  return (
    <>
      <PageMeta
        title="Employee Management | Riderly"
        description="Manage your employees efficiently with our comprehensive employee management system."
      />
      <PageBreadcrumb pageTitle="Employee" />
      <div className="space-y-6">
        <ComponentCard title="Employee">
          <EmployeeTable />
        </ComponentCard>
      </div>
    </>
  );
}
