import { useState, useEffect } from "react";
import { getDriverLocations } from "../../services/dashboardService";
import { UserIcon } from "../../icons";
import { DriverLocation } from "../../services/dashboardService";

interface DriverListProps {
  onDriverSelect: (driver: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
  } | null) => void;
}

export default function DriverList({ onDriverSelect }: DriverListProps) {
  const [drivers, setDrivers] = useState<DriverLocation[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<DriverLocation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const driversPerPage = 5;

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const data = await getDriverLocations();
        setDrivers(data);
        setFilteredDrivers(data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    const filtered = drivers.filter(driver =>
      driver.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDrivers(filtered);
    setCurrentPage(1);
  }, [searchQuery, drivers]);

  const indexOfLastDriver = currentPage * driversPerPage;
  const indexOfFirstDriver = indexOfLastDriver - driversPerPage;
  const currentDrivers = filteredDrivers.slice(indexOfFirstDriver, indexOfLastDriver);
  const totalPages = Math.ceil(filteredDrivers.length / driversPerPage);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="animate-pulse">
          <div className="h-10 w-full bg-gray-200 rounded dark:bg-gray-800"></div>
          <div className="mt-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 w-full bg-gray-200 rounded dark:bg-gray-800"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="relative">
        <input
          type="text"
          placeholder="Search drivers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-3 pl-11 pr-4 text-gray-800 placeholder:text-gray-400 focus:border-primary focus:outline-none dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-gray-500"
        />
        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
      </div>

      <div className="mt-4 space-y-3">
        {currentDrivers.map((driver) => (
          <div
            key={driver.id}
            onClick={() => onDriverSelect(driver)}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05]"
          >
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <span className="text-sm font-medium text-primary">
                  {driver.name.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white/90">
                  {driver.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {driver.status}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {driver.latitude.toFixed(4)}, {driver.longitude.toFixed(4)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm text-gray-800 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90"
          >
            Previous
          </button>
          <span className="flex items-center px-3 py-1 text-sm text-gray-800 dark:text-white/90">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm text-gray-800 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 