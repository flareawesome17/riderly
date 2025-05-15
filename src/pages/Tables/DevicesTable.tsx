import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc} from "firebase/firestore";
import { db } from "../../components/auth/firebase";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../components/ui/table";
  
  import Badge from "../../components/ui/badge/Badge";
  import { Button } from "../../components/ui/button";
  import { Modal } from "../../components/ui/modal";
  
  interface Device {
    id: string;
    deviceName: string;
    gpsId: string;
    assignedDriver: {
      id: string;
      name: string;
    } | null;
    timestamp: any;
  }
  
  interface Driver {
    id: string;
    first_name: string;
    middle_name: string;
    last_name: string;
  }
  
  export default function DevicesTable() {
    const [devices, setDevices] = useState<Device[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [newDevice, setNewDevice] = useState({
      deviceName: "",
      gpsId: "",
      assignedDriver: null as { id: string; name: string; } | null,
    });
    const [selectedDriverId, setSelectedDriverId] = useState("");
  
    // Fetch devices and drivers
    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch devices
          const devicesSnapshot = await getDocs(collection(db, "devices"));
          const devicesData = devicesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Device[];
          setDevices(devicesData);
  
          // Fetch drivers from the specific franchise owner's collection
          const franchiseOwnerDocRef = doc(db, "driver_users", "B9cZshLfyehLYVm3bLHJNgNM4eR2");
          const actualFranchiseCollection = collection(franchiseOwnerDocRef, "Actual_Franchise_Owner");
          const driversSnapshot = await getDocs(actualFranchiseCollection);
          const driversData = driversSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Driver[];
          setDrivers(driversData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    const handleAddDevice = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const selectedDriver = drivers.find(driver => driver.id === selectedDriverId);
        const deviceData = {
          ...newDevice,
          assignedDriver: selectedDriver ? {
            id: selectedDriver.id,
            name: `${selectedDriver.first_name} ${selectedDriver.last_name}`
          } : null,
          timestamp: new Date()
        };
  
        const docRef = await addDoc(collection(db, "devices"), deviceData);
        const newDeviceWithId = {
          id: docRef.id,
          ...deviceData
        };
  
        setDevices(prev => [...prev, newDeviceWithId]);
        setIsAddModalOpen(false);
        setNewDevice({
          deviceName: "",
          gpsId: "",
          assignedDriver: null
        });
        setSelectedDriverId("");
      } catch (error) {
        console.error("Error adding device:", error);
      }
    };
  
    const handleDeleteDevice = async (deviceId: string) => {
      if (window.confirm("Are you sure you want to delete this device?")) {
        try {
          await deleteDoc(doc(db, "devices", deviceId));
          setDevices(prev => prev.filter(device => device.id !== deviceId));
        } catch (error) {
          console.error("Error deleting device:", error);
        }
      }
    };
  
    // Filter devices based on search query
    const filteredDevices = devices.filter(device => 
      device.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.gpsId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (device.assignedDriver?.name.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );
  
    if (loading) {
      return <div className="p-4 text-center">Loading devices data...</div>;
    }
  
    return (
      <>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-1">Devices List</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your GPS tracking devices and driver assignments</p>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              variant="primary"
              size="sm"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium shadow-sm hover:opacity-90 transition-opacity w-full sm:w-auto justify-center bg-primary-500 text-dark rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Device
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search devices by name, GPS ID, or driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white text-sm"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700">
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <TableRow>
                    <TableCell isHeader className="px-6 py-4 font-medium text-gray-600 text-start dark:text-gray-300">
                      Device Name
                    </TableCell>
                    <TableCell isHeader className="px-6 py-4 font-medium text-gray-600 text-start dark:text-gray-300">
                      GPS ID
                    </TableCell>
                    <TableCell isHeader className="px-6 py-4 font-medium text-gray-600 text-start dark:text-gray-300">
                      Assigned Driver
                    </TableCell>
                    <TableCell isHeader className="px-6 py-4 font-medium text-gray-600 text-start dark:text-gray-300">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDevices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center justify-center">
                          {searchQuery ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <p className="text-lg font-medium mb-2">No matching devices found</p>
                              <p className="text-sm">Try adjusting your search query</p>
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <p className="text-lg font-medium mb-2">No devices found</p>
                              <p className="text-sm">Add your first GPS tracking device to get started</p>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDevices.map((device) => (
                      <TableRow key={device.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <TableCell className="px-6 py-4 text-gray-800 dark:text-white">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">{device.deviceName}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Added {new Date(device.timestamp.seconds * 1000).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-gray-600 dark:text-gray-400">
                          <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono">
                            {device.gpsId}
                          </code>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {device.assignedDriver ? (
                            <Badge size="md" color="success">
                              {device.assignedDriver.name}
                            </Badge>
                          ) : (
                            <Badge size="md" color="error">
                              Unassigned
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Button
                            onClick={() => handleDeleteDevice(device.id)}
                            variant="danger"
                            size="sm"
                            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          className="max-w-md w-[95%] mx-auto relative mt-4 sm:mt-8"
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Add New Device</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter the device details and optionally assign it to a driver.</p>
            <form onSubmit={handleAddDevice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Device Name
                </label>
                <input
                  type="text"
                  value={newDevice.deviceName}
                  onChange={(e) => setNewDevice({ ...newDevice, deviceName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter device name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  GPS ID
                </label>
                <input
                  type="text"
                  value={newDevice.gpsId}
                  onChange={(e) => setNewDevice({ ...newDevice, gpsId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter GPS ID"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assign Driver (Optional)
                </label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select a driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>
                      {`${driver.first_name} ${driver.last_name}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-gray-700">
                <Button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  variant="outline"
                  size="sm"
                  className="px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium shadow-sm hover:opacity-90 transition-opacity w-full sm:w-auto justify-center bg-primary-500 text-dark rounded-lg"
                >
                  Add Device
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </>
    );
  }
  