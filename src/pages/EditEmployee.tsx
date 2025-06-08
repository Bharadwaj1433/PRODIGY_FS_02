
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployees } from '../contexts/EmployeeContext';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Employee } from '../types';

type EmployeeFormData = Omit<Employee, 'id'>;

const EditEmployee: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { employees, updateEmployee, loading } = useEmployees();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);

  const form = useForm<EmployeeFormData>();

  useEffect(() => {
    if (id && employees.length > 0) {
      const foundEmployee = employees.find(emp => emp.id === id);
      if (foundEmployee) {
        setEmployee(foundEmployee);
        form.reset({
          firstName: foundEmployee.firstName,
          lastName: foundEmployee.lastName,
          email: foundEmployee.email,
          phone: foundEmployee.phone,
          department: foundEmployee.department,
          role: foundEmployee.role,
          status: foundEmployee.status,
          dateJoined: foundEmployee.dateJoined,
        });
      } else {
        navigate('/employees');
      }
    }
  }, [id, employees, form, navigate]);

  const onSubmit = async (data: EmployeeFormData) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      const success = await updateEmployee(id, data);
      if (success) {
        navigate('/employees');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const roles = ['Manager', 'Senior Developer', 'Developer', 'Designer', 'Analyst', 'Coordinator', 'Representative'];

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/employees')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Employees
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Employee</h1>
          <p className="text-gray-600">Update {employee.firstName} {employee.lastName}'s information</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  rules={{ required: 'First name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  rules={{ required: 'Last name is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                rules={{ required: 'Phone number is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  rules={{ required: 'Department is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  rules={{ required: 'Role is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateJoined"
                  rules={{ required: 'Date joined is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Joined</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={isSubmitting || loading}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Employee
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/employees')}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditEmployee;
