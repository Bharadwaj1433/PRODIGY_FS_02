
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  status: 'active' | 'inactive';
  dateJoined: string;
  avatar?: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<boolean>;
}

export interface EmployeeContextType {
  employees: Employee[];
  loading: boolean;
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<boolean>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<boolean>;
  deleteEmployee: (id: string) => Promise<boolean>;
  getEmployee: (id: string) => Employee | undefined;
}
