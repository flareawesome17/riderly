import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

import Button from "../../components/ui/button/Button";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../components/auth/firebase"; // adjust path to your firebase config

interface Employee {
  id: string; // Firestore document ID
  fname: string;
  lname: string;
  email: string;
  username: string;
  role: string;
}

export default function EmployeeTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const snapshot = await getDocs(collection(db, "employee"));
        const employeeList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Employee[];
        setEmployees(employeeList);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
  
    fetchEmployees();
  }, []);

  const openDeleteModal = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };
  
  const handleDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await deleteDoc(doc(db, "employee", employeeToDelete.id));
      setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };
  

  const openModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setIsModalOpen(false);
  };

  const handleSave = async (updatedEmployee: Employee) => {
    try {
      await updateDoc(doc(db, "employee", updatedEmployee.id), {
        fname: updatedEmployee.fname,
        lname: updatedEmployee.lname,
        email: updatedEmployee.email,
        username: updatedEmployee.username,
        role: updatedEmployee.role,
      });

      const updatedList = employees.map(emp =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      );
      setEmployees(updatedList);
      closeModal();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    [emp.fname, emp.lname, emp.email, emp.role].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] p-4 space-y-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, email, or role..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:max-w-sm px-4 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      />

      {/* Table */}
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">Name</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">Email</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">Username</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">Role</TableCell>
              <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">Action</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">{emp.fname}</TableCell>
                  <TableCell className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">{emp.email}</TableCell>
                  <TableCell className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">{emp.username}</TableCell>
                  <TableCell className="px-5 py-3 text-start font-medium text-gray-700 text-theme-xs dark:text-gray-400">{emp.role}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openModal(emp)}>Edit</Button>
                    <Button size="sm" variant="primary" onClick={() => openDeleteModal(emp)}>Delete</Button>

                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-gray-500 dark:text-gray-400">
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && employeeToDelete && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">Delete Employee</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete <strong>{employeeToDelete.fname}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
              <Button variant="outline" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}


      {/* Modal */}
      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-400 dark:text-white">Edit Employee</h2>
            <div>
              <label className="text-lg font-semibold mb-4 text-gray-400 dark:text-white">Name</label>
              <input
                type="text"
                value={selectedEmployee.fname}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, fname: e.target.value })}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="mt-4">
              <label className="text-lg font-semibold mb-4 text-gray-400 dark:text-white">Email</label>
              <input
                type="email"
                value={selectedEmployee.email}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="mt-4">
              <label className="text-lg font-semibold mb-4 text-gray-400 dark:text-white">Role</label>
              <select
                value={selectedEmployee.role}
                onChange={(e) => setSelectedEmployee({ ...selectedEmployee, role: e.target.value })}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={closeModal}>Cancel</Button>
              <Button variant="primary" onClick={() => handleSave(selectedEmployee)}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
