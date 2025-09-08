"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { directusService } from "@/lib/directus-service";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      redirect("/login");
      return;
    }

    fetchAppointments();
  }, [session, status]);

  const fetchAppointments = async () => {
    if (!session) return;
    
    try {
      setLoading(true);
      const response = await directusService.getCollection('appointments', (session as any).accessToken, {
        filter: JSON.stringify({
          user_id: { _eq: (session.user as any).id }
        }),
        sort: ['-date_created']
      });
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back, {session.user?.name}!</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900">Total Appointments</h3>
                <p className="text-3xl font-bold text-blue-600">{appointments.length}</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900">Completed</h3>
                <p className="text-3xl font-bold text-green-600">
                  {appointments.filter((appointment: any) => appointment.status === 'completed').length}
                </p>
              </div>
              
              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-900">Pending</h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {appointments.filter((appointment: any) => appointment.status === 'pending').length}
                </p>
              </div>
            </div>

            <div className="bg-white">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Appointments</h2>
              
              {error ? (
                <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                  {error}
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No appointments found</p>
                  <a
                    href="/home-collection"
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Book Your First Test
                  </a>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tests
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment: any) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {new Date(appointment.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appointment.tests}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appointment.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              appointment.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : appointment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : appointment.status === 'confirmed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {appointment.address}, {appointment.city}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appointment.total_amount ? `₹${appointment.total_amount}` : 'TBD'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
