import { useEffect, useState } from "react";
import { collection, onSnapshot, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "../../components/auth/firebase";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
  } from "../../components/ui/table";
  
  import { Badge } from "../../components/ui/badge/index";
  import { Modal } from "../../components/ui/modal";
  import { Button } from "../../components/ui/button/index";
  import { format } from "date-fns";
  import PageMeta from "../../components/common/PageMeta";
  import PageBreadcrumb from "../../components/common/PageBreadCrumb";
  
  interface Driver {
    id: string;
    address: string;
    age: number;
    contactNumber: string;
    createdAt?: any;
    email: string;
    first_name: string;
    franchise_expiration_date?: string;
    franchise_number: string;
    gender: string;
    lastUpdated?: any;
    last_login_location?: {
      latitude: number;
      longitude: number;
    };
    last_name: string;
    license_back_url?: string;
    license_expiration_date?: string;
    license_front_url?: string;
    middle_name?: string;
    password?: string;
    profile_picture?: string;
    timestamp?: any;
    user_type?: string;
    username?: string;
  }
  
  export default function DriversTable() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const formatDate = (dateString: string | undefined | null) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return format(date, 'MMMM dd, yyyy');
      } catch (error) {
        return 'N/A';
      }
    };
  
    useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, "driver_users"), (snapshot) => {
        const driversData = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
        })) as Driver[];
        setDrivers(driversData);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching drivers:", error);
        setLoading(false);
      });
      return () => unsubscribe();
    }, []);
  
    const handlePrint = () => {
      const printWindow = window.open('', '_blank');
      if (!printWindow || !selectedDriver) return;
  
      const content = `
        <html>
          <head>
            <title>Driver Information - ${selectedDriver.first_name} ${selectedDriver.last_name}</title>
            <style>
              @media print {
                @page { margin: 2cm; }
              }
              body { 
                font-family: Arial, sans-serif; 
                line-height: 1.6;
                color: #333;
                max-width: 1200px;
                margin: 0 auto;
                padding: 40px;
              }
              .header { 
                text-align: center; 
                margin-bottom: 40px;
                padding-bottom: 20px;
                border-bottom: 2px solid #eee;
              }
              .header img {
                height: 60px;
                width: auto;
                margin-bottom: 20px;
              }
              .header img.logo {
                width: 300px;
                height: auto;
                object-fit: contain;
              }
              .driver-info { 
                display: grid;
                grid-template-columns: 1fr 2fr;
                gap: 40px;
                margin-bottom: 40px;
              }
              @media (max-width: 768px) {
                .driver-info {
                  grid-template-columns: 1fr;
                }
                body {
                  padding: 20px;
                }
              }
              .profile-section {
                text-align: center;
              }
              .driver-photo { 
                width: 200px; 
                height: 200px; 
                object-fit: cover; 
                border-radius: 10px;
                margin-bottom: 20px;
                border: 1px solid #eee;
              }
              .details-section {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
              }
              .detail-item {
                margin-bottom: 15px;
              }
              .detail-label {
                font-weight: 600;
                color: #666;
                display: block;
                font-size: 0.9em;
                margin-bottom: 4px;
              }
              .detail-value {
                font-size: 1.1em;
              }
              .license-section {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #eee;
              }
              .license-images { 
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 30px;
                margin-top: 20px;
              }
              @media (max-width: 768px) {
                .license-images {
                  grid-template-columns: 1fr;
                }
              }
              .license-images img { 
                width: 100%;
                height: 250px;
                object-fit: contain;
                border: 1px solid #eee;
                border-radius: 8px;
                padding: 10px;
              }
              .license-label {
                font-weight: 600;
                margin-bottom: 10px;
                color: #666;
              }
              @media print {
                .license-images img {
                  max-height: 200px;
                }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <img src="/images/logo/riderly-logo.png" alt="Riderly Logo" class="logo"/>
              <h1>Driver Information</h1>
            </div>
            <div class="driver-info">
              <div class="profile-section">
                <img src="${selectedDriver.profile_picture || "/images/user/user-default.png"}" alt="Profile" class="driver-photo"/>
                <h2>${selectedDriver.first_name} ${selectedDriver.middle_name} ${selectedDriver.last_name}</h2>
                <p class="franchise-number">Franchise #: ${selectedDriver.franchise_number}</p>
              </div>
              <div class="details-section">
                <div class="detail-item">
                  <span class="detail-label">Age</span>
                  <span class="detail-value">${selectedDriver.age} years old</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Gender</span>
                  <span class="detail-value">${selectedDriver.gender}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Contact Number</span>
                  <span class="detail-value">${selectedDriver.contactNumber}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">License Expiration</span>
                  <span class="detail-value">${selectedDriver.license_expiration_date ? format(new Date(selectedDriver.license_expiration_date), 'MMMM dd, yyyy') : 'N/A'}</span>
                </div>
                <div class="detail-item" style="grid-column: span 2;">
                  <span class="detail-label">Address</span>
                  <span class="detail-value">${selectedDriver.address}</span>
                </div>
              </div>
            </div>
            <div class="license-section">
              <h3>License Information</h3>
              <div class="license-images">
                <div>
                  <p class="license-label">License Front</p>
                  <img src="${selectedDriver.license_front_url}" alt="License Front"/>
                </div>
                <div>
                  <p class="license-label">License Back</p>
                  <img src="${selectedDriver.license_back_url}" alt="License Back"/>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
  
      printWindow.document.open();
      printWindow.document.write(content);
      printWindow.document.close();
      printWindow.print();
    };
  
    if (loading) {
      return <div className="p-4 text-center">Loading drivers data...</div>;
    }
  
    return (
      <>
        <PageMeta
          title="Drivers Management | Riderly"
          description="Manage and view all registered drivers in the Riderly system"
        />
        <PageBreadcrumb pageTitle="Drivers Management" />
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Driver
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Franchise Number
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Contact
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    License Status
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    View
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {drivers.map((driver) => (
                  <TableRow 
                    key={driver.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <img
                            width={40}
                            height={40}
                            src={driver.profile_picture || "/images/user/user-default.png"}
                            alt={`${driver.first_name} ${driver.last_name}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {`${driver.first_name} ${driver.last_name}`}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {driver.age} years old
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {driver.franchise_number}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {driver.contactNumber}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge
                        size="md"
                        color={
                          driver.license_expiration_date && new Date(driver.license_expiration_date) > new Date()
                            ? "success"
                            : "error"
                        }
                      >
                        {driver.license_expiration_date && new Date(driver.license_expiration_date) > new Date() ? "Valid" : "Expired"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      <Button size="sm" variant="outline" onClick={() => { setSelectedDriver(driver); setIsModalOpen(true); }}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
  
        <Modal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="max-w-6xl w-[98%] mx-auto relative mt-4 sm:mt-8"
        >
          {selectedDriver && (
            <div className="p-4 sm:p-8 h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-boxdark">
              <div className="flex flex-col items-center mb-6 sm:mb-8 pb-4 border-b dark:border-gray-700">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white mb-4">Driver Information</h2>
                <Button 
                  onClick={handlePrint} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div className="text-center">
                  <div className="relative mb-4 mx-auto">
                    <img
                      src={selectedDriver.profile_picture || "/images/user/user-default.png"}
                      alt="Profile"
                      className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-lg shadow-md mx-auto"
                    />
                    <Badge
                      size="md"
                      color={selectedDriver.license_expiration_date && new Date(selectedDriver.license_expiration_date) > new Date() ? "success" : "error"}
                      className="absolute top-2 right-2"
                    >
                      {selectedDriver.license_expiration_date && new Date(selectedDriver.license_expiration_date) > new Date() ? "Active" : "Expired"}
                    </Badge>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                    {`${selectedDriver.first_name} ${selectedDriver.middle_name || ''} ${selectedDriver.last_name}`}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Franchise #: {selectedDriver.franchise_number}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Username: {selectedDriver.username}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    User Type: {selectedDriver.user_type}
                  </p>
                </div>
                <div className="md:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-base text-gray-900 dark:text-white">{selectedDriver.email}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Number</p>
                      <p className="text-base text-gray-900 dark:text-white">{selectedDriver.contactNumber}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Age</p>
                      <p className="text-base text-gray-900 dark:text-white">{selectedDriver.age} years old</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</p>
                      <p className="text-base text-gray-900 dark:text-white">{selectedDriver.gender}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                      <p className="text-base text-gray-900 dark:text-white">{selectedDriver.address}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Franchise Number</p>
                      <p className="text-base text-gray-900 dark:text-white">{selectedDriver.franchise_number}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Franchise Expiration Date</p>
                      <p className="text-base text-gray-900 dark:text-white">{formatDate(selectedDriver.franchise_expiration_date)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">License Expiration Date</p>
                      <p className="text-base text-gray-900 dark:text-white">{formatDate(selectedDriver.license_expiration_date)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</p>
                      <p className="text-base text-gray-900 dark:text-white">{formatDate(selectedDriver.createdAt)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</p>
                      <p className="text-base text-gray-900 dark:text-white">{formatDate(selectedDriver.lastUpdated)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Login Location</p>
                      <p className="text-base text-gray-900 dark:text-white">
                        {selectedDriver.last_login_location ? `Lat: ${selectedDriver.last_login_location.latitude}, Lng: ${selectedDriver.last_login_location.longitude}` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="border-t dark:border-gray-700 pt-6 mt-6">
                    <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">License Images</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">License Front</p>
                        <img
                          src={selectedDriver.license_front_url}
                          alt="License Front"
                          className="w-full h-40 sm:h-48 object-contain rounded-lg border dark:border-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">License Back</p>
                        <img
                          src={selectedDriver.license_back_url}
                          alt="License Back"
                          className="w-full h-40 sm:h-48 object-contain rounded-lg border dark:border-gray-700"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border-t dark:border-gray-700 pt-6 mt-6">
                    <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Other Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Password</p>
                        <p className="text-base text-gray-900 dark:text-white">{selectedDriver.password || 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</p>
                        <p className="text-base text-gray-900 dark:text-white">{formatDate(selectedDriver.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </>
    );
  }
  