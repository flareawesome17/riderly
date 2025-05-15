import { useEffect, useState } from "react";
import {
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { getDashboardMetrics } from "../../services/dashboardService";

export default function EcommerceMetrics() {
  const [metrics, setMetrics] = useState({
    totalDrivers: 0,
    totalDevices: 0,
    activeDrivers: 0,
    activeDevices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
            <div className="mt-5">
              <div className="h-4 w-24 bg-gray-200 rounded dark:bg-gray-800"></div>
              <div className="mt-2 h-6 w-16 bg-gray-200 rounded dark:bg-gray-800"></div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-xl dark:bg-gray-800"></div>
            <div className="mt-5">
              <div className="h-4 w-24 bg-gray-200 rounded dark:bg-gray-800"></div>
              <div className="mt-2 h-6 w-16 bg-gray-200 rounded dark:bg-gray-800"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const driversPercentage = metrics.totalDrivers > 0 
    ? ((metrics.activeDrivers / metrics.totalDrivers) * 100).toFixed(2)
    : "0.00";
  const devicesPercentage = metrics.totalDevices > 0
    ? ((metrics.activeDevices / metrics.totalDevices) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Drivers Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Active Drivers
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.activeDrivers} / {metrics.totalDrivers}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {driversPercentage}%
          </Badge>
        </div>
      </div>

      {/* Devices Metric */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Active Devices
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {metrics.activeDevices} / {metrics.totalDevices}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            {devicesPercentage}%
          </Badge>
        </div>
      </div>
    </div>
  );
}
