import { db } from "../components/auth/firebase";
import { collection, getDocs, query, where, limit } from "firebase/firestore";

export interface DashboardMetrics {
  totalDrivers: number;
  totalDevices: number;
  activeDrivers: number;
  activeDevices: number;
}

export interface MonthlyData {
  month: string;
  value: number;
}

export interface DriverLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: "active" | "inactive";
}

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  try {
    const driversSnapshot = await getDocs(collection(db, "drivers"));
    const devicesSnapshot = await getDocs(collection(db, "devices"));
    
    const totalDrivers = driversSnapshot.size;
    const totalDevices = devicesSnapshot.size;
    
    const activeDrivers = driversSnapshot.docs.filter(
      doc => doc.data().status === "active"
    ).length;
    
    const activeDevices = devicesSnapshot.docs.filter(
      doc => doc.data().status === "active"
    ).length;

    return {
      totalDrivers,
      totalDevices,
      activeDrivers,
      activeDevices
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return {
      totalDrivers: 0,
      totalDevices: 0,
      activeDrivers: 0,
      activeDevices: 0
    };
  }
};

export const getMonthlyData = async (): Promise<MonthlyData[]> => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const monthlyData: MonthlyData[] = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (let i = 0; i < 12; i++) {
      const month = (currentMonth - i + 12) % 12;
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
      
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      const tripsQuery = query(
        collection(db, "trips"),
        where("date", ">=", startDate),
        where("date", "<=", endDate)
      );
      
      const tripsSnapshot = await getDocs(tripsQuery);
      monthlyData.unshift({
        month: months[month],
        value: tripsSnapshot.size
      });
    }
    
    return monthlyData;
  } catch (error) {
    console.error("Error fetching monthly data:", error);
    return [];
  }
};

export const getDriverLocations = async (): Promise<DriverLocation[]> => {
  try {
    const driversQuery = query(
      collection(db, "drivers"),
      where("status", "==", "active"),
      limit(10)
    );
    
    const driversSnapshot = await getDocs(driversQuery);
    return driversSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DriverLocation[];
  } catch (error) {
    console.error("Error fetching driver locations:", error);
    return [];
  }
}; 