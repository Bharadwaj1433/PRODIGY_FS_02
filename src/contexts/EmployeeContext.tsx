
import React, { createContext, useContext, useState, useEffect } from 'react';
import { EmployeeContextType, Employee } from '../types';
import { toast } from '@/hooks/use-toast';

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};

// Mock data
const mockEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    role: 'Senior Developer',
    status: 'active',
    dateJoined: '2023-01-15',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    phone: '+1 (555) 234-5678',
    department: 'Marketing',
    role: 'Marketing Manager',
    status: 'active',
    dateJoined: '2023-03-20',
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@company.com',
    phone: '+1 (555) 345-6789',
    department: 'Sales',
    role: 'Sales Representative',
    status: 'inactive',
    dateJoined: '2023-02-10',
  },
];

export const EmployeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load employees from localStorage or use mock data
    const storedEmployees = localStorage.getItem('employees');
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    } else {
      setEmployees(mockEmployees);
      localStorage.setItem('employees', JSON.stringify(mockEmployees));
    }
  }, []);

  const saveEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees);
    localStorage.setItem('employees', JSON.stringify(newEmployees));
  };

  const addEmployee = async (employeeData: Omit<Employee, 'id'>): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEmployee: Employee = {
        ...employeeData,
        id: Date.now().toString(),
      };
      
      const updatedEmployees = [...employees, newEmployee];
      saveEmployees(updatedEmployees);
      
      toast({
        title: "Employee Added",
        description: `${employeeData.firstName} ${employeeData.lastName} has been added successfully.`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedEmployees = employees.map(emp => 
        emp.id === id ? { ...emp, ...employeeData } : emp
      );
      
      saveEmployees(updatedEmployees);
      
      toast({
        title: "Employee Updated",
        description: "Employee information has been updated successfully.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update employee. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedEmployees = employees.filter(emp => emp.id !== id);
      saveEmployees(updatedEmployees);
      
      toast({
        title: "Employee Deleted",
        description: "Employee has been removed successfully.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getEmployee = (id: string): Employee | undefined => {
    return employees.find(emp => emp.id === id);
  };

  return (
    <EmployeeContext.Provider value={{
      employees,
      loading,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      getEmployee
    }}>
      {children}
    </EmployeeContext.Provider>
  );
};
