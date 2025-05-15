import { useState } from "react";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ComponentCard from "../components/common/ComponentCard";
import Map from "../components/map/Map";
import DriverList from "../components/drivers/DriverList";

export default function LiveTracking() {
  const [selectedDriver, setSelectedDriver] = useState<{
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  } | null>(null);

  return (
    <>
      <PageMeta
        title="Live Tracking | Riderly"
        description="Real-time tracking and monitoring of all active drivers in the Riderly system"
      />
      <PageBreadcrumb pageTitle="Live Tracking" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ComponentCard title="Live Map">
            <Map
              mapboxToken="pk.eyJ1IjoiZmxhcmVhd2Vzb21lIiwiYSI6ImNtOGR5MDh0MTAxMWoya3B2NG5iZTU3NHUifQ.3-Nca-D--n-gTft7zjjRdw"
              selectedDriver={selectedDriver}
            />
          </ComponentCard>
        </div>
        <div>
          <ComponentCard title="Active Drivers">
            <DriverList onDriverSelect={setSelectedDriver} />
          </ComponentCard>
        </div>
      </div>
    </>
  );
}
