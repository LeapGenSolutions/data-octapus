import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Database,
  Users,
  Activity,
  FileText,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "../layouts/dashboard-layout";
import { useSelector } from "react-redux";

export default function Home() {
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
    enabled: true,
  });

  const [activeTab, setActiveTab] = useState("Today");
  const [showExtras, setShowExtras] = useState(false);
  const [showSources, setShowSources] = useState(false);
  
  const user = useSelector((state) => state.me.me);

  const chartData = [
    { month: "Jan", blue: 4700, green: 2900 },
    { month: "Feb", blue: 5200, green: 3300 },
    { month: "Mar", blue: 5000, green: 3700 },
    { month: "Apr", blue: 5800, green: 4100 },
    { month: "May", blue: 7000, green: 4500 },
    { month: "Jun", blue: 7500, green: 4900 },
    { month: "Jul", blue: 8200, green: 5300 },
    { month: "Aug", blue: 8000, green: 5700 },
    { month: "Sep", blue: 8400, green: 6200 },
    { month: "Oct", blue: 9000, green: 6600 },
    { month: "Nov", blue: 9600, green: 7000 },
    { month: "Dec", blue: 10000, green: 7500 },
  ];

  const scheduledTasks = {
    Today: [
      { title: "System update", time: "Scheduled for 3:00 PM", status: "Pending" },
      { title: "Maintenance check", time: "Scheduled for 5:00 PM", status: "In Progress" },
      { title: "Data backup", time: "Scheduled for 11:00 PM", status: "Queued" },
    ],
    "This Week": [
      { title: "Security audit", time: "Wednesday at 2:00 PM", status: "Pending" },
      { title: "Report generation", time: "Friday at 9:00 AM", status: "Scheduled" },
    ],
    "This Month": [
      { title: "License renewal", time: "August 24", status: "Important" },
      { title: "Quarterly review", time: "August 31", status: "Scheduled" },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700";
      case "In Progress":
        return "bg-green-50 text-green-700";
      case "Queued":
        return "bg-blue-50 text-blue-700";
      case "Scheduled":
        return "bg-blue-50 text-blue-700";
      case "Planned":
        return "bg-purple-50 text-purple-700";
      case "Important":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  if (statsLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = dashboardStats || {
    totalSources: 12,
    totalReports: 16,
    activeSources: 28,
    recentActivity: [],
  };
  const greeting = user ? `Welcome, ${user.name}!` : "Welcome!";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#2196F3] rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{greeting}</h1>
                <p className="text-[#2196F3] mt-1">Your data insights are ready.</p>
                <p className="text-sm text-gray-600 mt-2">Your platform for secure, compliant, and modern data analytics.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Header */}
        <Card className="border border-[#e5e7eb] bg-white shadow-sm rounded-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 group">
                <TrendingUp className="h-6 w-6 text-[#2196F3]" />
                <CardTitle className="text-xl font-semibold text-[#2196F3]">Dashboard Overview</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-[#2196F3] text-[#2196F3] hover:bg-[#E3F2FD]">
                  Refresh
                </Button>
                <Badge variant="outline" className="border-[#4CAF50] text-[#4CAF50] rounded-md">
                  Last 30 days
                </Badge>
                <Button variant="outline" size="sm" className="border-[#2196F3] text-[#2196F3] hover:bg-[#E3F2FD]">
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Data Sources */}
          <Card className="border-gray-200 shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#2196F3] font-medium text-gray-600">Data Sources</p>
                  <p className="text-3xl font-bold text-gray-900">12</p>
                  <p className="text-xs text-gray-500 mt-1">↑ 2 from last period</p>
                </div>
                <div className="p-3 bg-[#FF9800] rounded-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card className="border-gray-200 shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-gray-900">28</p>
                  <p className="text-xs text-gray-500 mt-1">↑ 5 from last period</p>
                </div>
                <div className="p-3 bg-[#9C27B0] rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Health */}
          <Card className="border-gray-200 shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Data Health</p>
                  <p className="text-3xl font-bold text-gray-900">98%</p>
                  <p className="text-xs text-[#4CAF50] mt-1">Excellent</p>
                </div>
                <div className="p-3 bg-[#4CAF50] rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Reports */}
          <Card className="border-gray-200 shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Generated Reports</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalReports}</p>
                  <p className="text-xs text-gray-500 mt-1">↑ 3 from last period</p>
                </div>
                <div className="p-3 bg-[#F44336] rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Data Processed */}
          <Card className="border-gray-200 shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Data Processed</p>
                  <p className="text-3xl font-bold text-[#2196F3]">14.7GB</p>
                  <p className="text-xs text-[#2196F3] mt-1">↑ 2.5GB from last period</p>
                </div>
                <div className="p-3 bg-[#2196F3] rounded-full">
                  <Database className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Processing Speed */}
          <Card className="border-gray-200 shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Processing Speed</p>
                  <p className="text-3xl font-bold text-[#4CAF50]">245ms</p>
                  <p className="text-xs text-green-600 mt-1">↓ 15ms from last period</p>
                </div>
                <div className="p-3 bg-[#4CAF50] rounded-full">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Bytes Served */}
          <Card className="border-gray-200 shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bytes Served</p>
                  <p className="text-3xl font-bold text-[#FF9800]">1.2TB</p>
                  <p className="text-xs text-[#FF9800] mt-1">↑ 12% from last period</p>
                </div>
                <div className="p-3 bg-[#FF9800] rounded-full">
                  <Database className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Freshness */}
          <Card className="border-gray-200 shadow-sm transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Freshness</p>
                  <p className="text-3xl font-bold text-[#9C27B0]">99.2%</p>
                  <p className="text-xs text-[#9C27B0] mt-1">↑ 0.5% from last period</p>
                </div>
                <div className="p-3 bg-[#9C27B0] rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

{/* Bottom Charts */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
  {/* Data Brewing Activity */}
  <Card className="border-[#2196F3] shadow-sm h-full">
    <div
      className="bg-[#f7f1eb] px-6 py-4 flex items-center justify-between border-b border-[#2196F3] rounded-t-md cursor-pointer"
      onClick={() => setShowExtras((prev) => !prev)}
    >
      <div>
        <h2 className="text-xl font-semibold text-[#2196F3]">Data Brewing Activity</h2>
        <p className="text-sm text-[#2196F3]">Tokenization and anonymization operations over time</p>
      </div>
      {showExtras ? (
        <ChevronUp className="text-[#2196F3] w-6 h-6" />
      ) : (
        <ChevronDown className="text-[#2196F3] w-6 h-6" />
      )}
    </div>

    <CardContent className="p-4">
      <div className="h-[300px] w-full bg-white rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#ddd" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            {showExtras && (
              <Legend
                verticalAlign="top"
                iconType="square"
                formatter={(value) => (
                  <span style={{ color: "#2196F3", fontSize: "0.875rem" }}>{value}</span>
                )}
              />
            )}
            <Line
              type="monotone"
              dataKey="blue"
              stroke="#2196F3"
              strokeWidth={3}
              dot={{ r: 3 }}
              name="API Requests"
            />
            <Line
              type="monotone"
              dataKey="green"
              stroke="#4CAF50"
              strokeWidth={3}
              dot={{ r: 3 }}
              name="Database Queries"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>

  {/* Data Sources */}
  <Card className="border-[#2196F3] shadow-sm h-full">
    <div
      className="bg-[#f7f1eb] px-6 py-4 flex items-center justify-between border-b border-[#2196F3] rounded-t-md cursor-pointer"
      onClick={() => setShowSources((prev) => !prev)}
    >
      <div>
        <h2 className="text-xl font-semibold text-[#2196F3]">Data Sources</h2>
        <p className="text-sm text-[#2196F3]">Source distribution by type</p>
      </div>
      {showSources ? (
        <ChevronUp className="text-[#2196F3] w-6 h-6" />
      ) : (
        <ChevronDown className="text-[#2196F3] w-6 h-6" />
      )}
    </div>

    <CardContent className="p-4">
      <div className="h-[300px] w-full bg-white rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[
              { source: "SQL", value: 11 },
              { source: "REST API", value: 8 },
              { source: "File System", value: 6 },
              { source: "Cloud Storage", value: 4 },
              { source: "GraphQL", value: 2 },
            ]}
            layout="vertical"
            margin={{ top: 5, right: 10, left: 40, bottom: 5 }}
          >
            <CartesianGrid stroke="#eee" />
            <XAxis type="number" hide={!showSources} />
            <YAxis type="category" dataKey="source" tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#2196F3" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
</div>

        {/* Activity Log Card */}
<Card className="border-[#2196F3] shadow-sm">
  <CardHeader className="bg-[#f7f1eb] flex flex-row justify-between items-center px-6 py-4 border-b border-[#2196F3]">
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-semibold text-[#2196F3]">Data Brewing Activity Log</h2>
      <Badge className="bg-[#2196F3] text-[#2196F3] text-xs">5 New</Badge>
    </div>
    <Button variant="ghost" className="text-[#2196F3] text-sm hover:underline">View All</Button>
  </CardHeader>
<CardContent className="p-4">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[
      {
        text: "New source added",
        time: "3 hours ago by Madhu Chanthati",
        border: "border-l-[4px] border-green-700",
        hover: "hover:bg-green-50",
      },
      {
        text: "User account created",
        time: "Yesterday by Admin",
        border: "border-l-[4px] border-blue-700",
        hover: "hover:bg-blue-50",
      },
      {
        text: "System backup completed",
        time: "2 days ago by System",
        border: "border-l-[4px] border-yellow-700",
        hover: "hover:bg-yellow-50",
      },
      {
        text: "Report published",
        time: "4 days ago by Sarah Johnson",
        border: "border-l-[4px] border-red-700",
        hover: "hover:bg-red-50",
      },
      {
        text: "Failed login attempt",
        time: "1 week ago from 192.168.1.105",
        border: "border-l-[4px] border-rose-800",
        hover: "hover:bg-rose-50",
      },
      {
        text: "Data batch processed",
        time: "1 week ago by System",
        border: "border-l-[4px] border-purple-800",
        hover: "hover:bg-purple-50",
      },
    ].map((log, index) => (
      <div
        key={index}
        className={`bg-white p-4 shadow-sm ${log.border} ${log.hover} rounded-r-md transition-colors duration-200`}
      >
        <p className="font-semibold text-[#1e3a8a]">{log.text}</p>
        <p className="text-sm text-gray-600 mt-1">{log.time}</p>
      </div>
    ))}
  </div>
</CardContent>
</Card>

 {/* Coffee Bean Tasks */}
        <Card className="border-[#2196F3] shadow-sm">
          <CardHeader className="bg-blue-50 px-6 py-4 border-b border-[#2196F3]">
            <h2 className="text-xl font-semibold text-[#2196F3]">Scheduled Tasks</h2>
          </CardHeader>
          <CardContent className="p-0">
            {/* Tab Switcher */}
            <div className="flex bg-blue-100 rounded-t-md overflow-hidden">
              {["Today", "This Week", "This Month"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-sm py-2 font-medium transition-all ${
                    activeTab === tab
                      ? "bg-[#2196F3] text-white"
                      : "text-[#2196F3] hover:bg-blue-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Task List */}
            <ul className="divide-y divide-blue-100 px-6 py-4">
              {scheduledTasks[activeTab].map((task, idx) => (
                <li key={idx} className="flex justify-between items-center py-3">
                  <div>
                    <p className="text-[#2196F3] font-medium">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.time}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(task.status)}`}>{task.status}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-[#2196F3] pt-6 border-t border-[#e6d5c5]">
          © 2025 Data Coffee. All rights reserved. | Privacy Policy | Terms of Service
        </div>
      </div>
    </DashboardLayout>
  );
}