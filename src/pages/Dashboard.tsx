
import React from 'react';
import { useEmployees } from '../contexts/EmployeeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { employees } = useEmployees();

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'active').length;
  const inactiveEmployees = employees.filter(emp => emp.status === 'inactive').length;
  
  const departments = [...new Set(employees.map(emp => emp.department))];
  const departmentCounts = departments.map(dept => ({
    name: dept,
    count: employees.filter(emp => emp.department === dept).length
  }));

  const recentEmployees = employees
    .sort((a, b) => new Date(b.dateJoined).getTime() - new Date(a.dateJoined).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: 'Total Employees',
      value: totalEmployees,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Employees',
      value: activeEmployees,
      icon: UserCheck,
      color: 'bg-green-500',
    },
    {
      title: 'Inactive Employees',
      value: inactiveEmployees,
      icon: UserX,
      color: 'bg-red-500',
    },
    {
      title: 'Departments',
      value: departments.length,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your Employee Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Employees */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Employees</CardTitle>
            <CardDescription>Latest additions to your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEmployees.map((employee) => (
                <div key={employee.id} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                    {employee.firstName[0]}{employee.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{employee.role}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(employee.dateJoined).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Employees by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentCounts.map((dept) => (
                <div key={dept.name} className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">{dept.name}</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${(dept.count / totalEmployees) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{dept.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
