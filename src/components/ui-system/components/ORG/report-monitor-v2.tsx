"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Users, ShoppingBag, Calendar } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Sample data (would normally come from an API)
const reportData = {
  total: 20,
  totalByType: {
    TOGO: 6,
    DINEIN: 14,
  },
  totalByStatus: {
    PENDING: 17,
    COMPLETED: 3,
  },
  waitingInStore: 2,
  archived: 20,
  orderTimeMinutes: {
    min: 629,
    max: 1427,
    avg: 1258.5,
  },
  topDineInTables: [
    {
      orderNumber: "2",
      count: 3,
    },
    {
      orderNumber: "5",
      count: 2,
    },
    {
      orderNumber: "74",
      count: 2,
    },
  ],
};

export default function ReportMonitorV2() {
  const [timeFrame, setTimeFrame] = useState<"day" | "week" | "month" | "year">(
    "day"
  );

  // Format minutes to hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  // Get current date in format "15 April, 2023"
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Calculate percentage for circular progress
  const calculatePercentage = (value: number, total: number) => {
    return Math.round((value / total) * 100);
  };

  // Pending percentage
  const pendingPercentage = calculatePercentage(
    reportData.totalByStatus.PENDING,
    reportData.total
  );

  // To-Go percentage
  const toGoPercentage = calculatePercentage(
    reportData.totalByType.TOGO,
    reportData.total
  );

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto">
        <div className="bg-white rounded-3xl p-8 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-8">
            <Link to="/">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Statistics</h1>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span className="text-sm">{getCurrentDate()}</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6">Orders</h2>

          {/* Time Frame Selector */}
          <div className="flex bg-gray-100 p-1 rounded-full mb-8 w-full max-w-md mx-auto">
            <Button
              variant="ghost"
              onClick={() => setTimeFrame("day")}
              className={`flex-1 rounded-full text-sm ${
                timeFrame === "day" ? "bg-white shadow-sm" : "hover:bg-gray-200"
              }`}
            >
              Day
            </Button>
            <Button
              variant="ghost"
              onClick={() => setTimeFrame("week")}
              className={`flex-1 rounded-full text-sm ${
                timeFrame === "week"
                  ? "bg-white shadow-sm"
                  : "hover:bg-gray-200"
              }`}
            >
              Week
            </Button>
            <Button
              variant="ghost"
              onClick={() => setTimeFrame("month")}
              className={`flex-1 rounded-full text-sm ${
                timeFrame === "month"
                  ? "bg-white shadow-sm"
                  : "hover:bg-gray-200"
              }`}
            >
              Month
            </Button>
            <Button
              variant="ghost"
              onClick={() => setTimeFrame("year")}
              className={`flex-1 rounded-full text-sm ${
                timeFrame === "year"
                  ? "bg-white shadow-sm"
                  : "hover:bg-gray-200"
              }`}
            >
              Year
            </Button>
          </div>

          {/* Main Circular Progress */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative w-48 h-48 mb-8">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#EEEEEE"
                  strokeWidth="10"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="10"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * pendingPercentage) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl font-bold">{reportData.total}</span>
                  <div className="text-sm text-gray-500">Total Orders</div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-16 text-center">
              <div>
                <div className="text-4xl font-bold">
                  {reportData.totalByStatus.PENDING}
                </div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
              <div>
                <div className="text-4xl font-bold">
                  {reportData.totalByType.TOGO}
                </div>
                <div className="text-sm text-gray-500">To-Go</div>
              </div>
              <div>
                <div className="text-4xl font-bold">
                  {reportData.totalByType.DINEIN}
                </div>
                <div className="text-sm text-gray-500">Dine-In</div>
              </div>
            </div>
          </div>

          {/* Order Time Statistics */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Order Time
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-100 p-4 rounded-2xl">
                <div className="text-sm text-gray-500 mb-1">Minimum</div>
                <div className="text-xl font-bold">
                  {formatTime(reportData.orderTimeMinutes.min)}
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-2xl">
                <div className="text-sm text-gray-500 mb-1">Average</div>
                <div className="text-xl font-bold">
                  {formatTime(reportData.orderTimeMinutes.avg)}
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-2xl">
                <div className="text-sm text-gray-500 mb-1">Maximum</div>
                <div className="text-xl font-bold">
                  {formatTime(reportData.orderTimeMinutes.max)}
                </div>
              </div>
            </div>
          </div>

          {/* Order Types */}
          <div className="mb-12">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Order Types
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-100 p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg">To-Go Orders</span>
                  <span className="text-lg font-bold">
                    {reportData.totalByType.TOGO}
                  </span>
                </div>
                <div className="relative h-4 bg-white rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-black rounded-full"
                    style={{ width: `${toGoPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="bg-gray-100 p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg">Dine-In Orders</span>
                  <span className="text-lg font-bold">
                    {reportData.totalByType.DINEIN}
                  </span>
                </div>
                <div className="relative h-4 bg-white rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-black rounded-full"
                    style={{ width: `${100 - toGoPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Tables */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Top Dine-In Tables
            </h3>
            <div className="space-y-4">
              {reportData.topDineInTables.map((table, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-2xl"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold mr-3">
                      {index + 1}
                    </div>
                    <span className="text-lg">Table #{table.orderNumber}</span>
                  </div>
                  <div className="text-lg font-bold">{table.count} orders</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
