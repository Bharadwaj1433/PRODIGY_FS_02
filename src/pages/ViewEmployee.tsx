
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEmployees } from '../contexts/EmployeeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Mail, Phone, Calendar, User, Building } from 'lucide-react';
import { Employee } from '../types';

const ViewEmployee: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { employees } = useEmployees();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    if (id && employees.length > 0) {
      const foundEmployee = employees.find(emp => emp.id === id);
      if (foundEmployee) {
        setEmployee(foundEmployee);
      } else {
        navigate('/employees');
      }
    }
  }, [id, employees, navigate]);

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
          <p className="text-gray-600">Please wait while we fetch the employee details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/employees')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Employees
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {employee.firstName} {employee.lastName}
            </h1>
            <p className="text-gray-600">{employee.role} • {employee.department}</p>
          </div>
        </div>
        <Button asChild>
          <Link to={`/employees/${employee.id}/edit`}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Employee
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {employee.firstName[0]}{employee.lastName[0]}
              </div>
              <h3 className="text-lg font-semibold">
                {employee.firstName} {employee.lastName}
              </h3>
              <p className="text-gray-600">{employee.role}</p>
              <Badge variant={employee.status === 'active' ? 'default' : 'secondary'} className="mt-2">
                {employee.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{employee.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="w-5 h-5" />
              <span>Work Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-medium">{employee.department}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">{employee.role}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Date Joined</p>
                <p className="font-medium">{new Date(employee.dateJoined).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewEmployee;
