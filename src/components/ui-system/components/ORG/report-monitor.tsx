import type { IReport } from "@/service/report-type";
import {
  BarChart3,
  Clock,
  Users,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";

// Sample data (would normally come from an API)
type props = {
  data: IReport;
};

export default function ReportMonitor({ data }: props) {
  // const [timeFrame, setTimeFrame] = useState<"today" | "week" | "month">(
  //   "today"
  // );
  const reportData = data;

  // Format minutes to hours and minutes
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-blue-100 rounded-2xl p-5 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl font-bold flex items-center text-gray-800">
            <BarChart3 className="mr-3 h-8 w-8" />
            Order Reports
          </h1>
        </div>

        {/* Time Frame Selector */}
        {/* <div className="bg-white p-4 rounded-2xl mb-8  ">
          <div className="flex flex-wrap gap-4">
            <Button
              variant={timeFrame === "today" ? "default" : "outline"}
              onClick={() => setTimeFrame("today")}
              className={`text-lg font-medium py-2 px-6 h-auto rounded-full ${
                timeFrame === "today"
                  ? "bg-blue-300 text-white hover:bg-blue-600"
                  : "bg-white text-gray-800 hover:bg-gray-100 "
              }`}
            >
              Today
            </Button>
            <Button
              variant={timeFrame === "week" ? "default" : "outline"}
              onClick={() => setTimeFrame("week")}
              className={`text-lg font-medium py-2 px-6 h-auto rounded-full ${
                timeFrame === "week"
                  ? "bg-blue-300 text-white hover:bg-blue-600"
                  : "bg-white text-gray-800 hover:bg-gray-100 "
              }`}
            >
              This Week
            </Button>
            <Button
              variant={timeFrame === "month" ? "default" : "outline"}
              onClick={() => setTimeFrame("month")}
              className={`text-lg font-medium py-2 px-6 h-auto rounded-full ${
                timeFrame === "month"
                  ? "bg-blue-300 text-white hover:bg-blue-600"
                  : "bg-white text-gray-800 hover:bg-gray-100 "
              }`}
            >
              This Month
            </Button>
          </div>
        </div> */}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white p-5 rounded-2xl  ">
            <div className="text-gray-600 text-lg mb-2">Total Orders</div>
            <div className="text-4xl font-bold text-gray-800">
              {reportData.total}
            </div>
          </div>

          <div className="bg-yellow-50 p-5 rounded-2xl  ">
            <div className="text-yellow-700 text-lg mb-2">Pending Orders</div>
            <div className="text-4xl font-bold text-yellow-600">
              {reportData.totalByStatus.PENDING ?? 0}
            </div>
          </div>

          <div className="bg-green-50 p-5 rounded-2xl  ">
            <div className="text-green-700 text-lg mb-2">Completed Orders</div>
            <div className="text-4xl font-bold text-green-600">
              {reportData.totalByStatus.COMPLETED ?? 0}
            </div>
          </div>

          <div className="bg-blue-50 p-5 rounded-2xl  ">
            <div className="text-blue-700 text-lg mb-2">Dine in @ToGo</div>
            <div className="text-4xl font-bold text-blue-600">
              {reportData.waitingInStore ?? 0}
            </div>
          </div>
        </div>

        {/* Order Types */}
        <div className="grid grid-cols-1  gap-3 ">
          <div className="bg-white p-5 rounded-2xl  ">
            <div className="text-xl font-bold flex items-center mb-6 text-gray-800">
              <ShoppingBag className="mr-2 h-6 w-6" />
              Orders by Type
            </div>
            <div className="space-y-8">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-300 rounded-md mr-2"></div>
                    <span className="text-lg text-gray-800">To-Go Orders</span>
                  </div>
                  <span className="text-lg font-bold text-gray-800">
                    {reportData.totalByType.TOGO ?? 0}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-6">
                  <div
                    className="bg-green-300 h-6 rounded-full"
                    style={{
                      width: `${
                        (reportData.totalByType.TOGO / reportData.total) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-300 rounded-md mr-2"></div>
                    <span className="text-lg text-gray-800">
                      Dine-In Orders
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-800">
                    {reportData.totalByType.DINEIN ?? 0}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-6">
                  <div
                    className="bg-red-300 h-6 rounded-full"
                    style={{
                      width: `${
                        (reportData.totalByType.DINEIN / reportData.total) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl  ">
            <div className="text-xl font-bold flex items-center mb-6 text-gray-800">
              <Clock className="mr-2 h-6 w-6" />
              Order Time Statistics
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-sm text-blue-700 mb-1">Minimum</div>
                <div className="text-lg font-bold text-blue-700">
                  {formatTime(reportData.orderTimeMinutes.min)}
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-sm text-blue-700 mb-1">Average</div>
                <div className="text-lg font-bold text-blue-700">
                  {formatTime(reportData.orderTimeMinutes.avg)}
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-sm text-blue-700 mb-1">Maximum</div>
                <div className="text-lg font-bold text-blue-700">
                  {formatTime(reportData.orderTimeMinutes.max)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status and Top Tables */}
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-white p-5 rounded-2xl  ">
            <div className="text-xl font-bold flex items-center mb-6 text-gray-800">
              <AlertCircle className="mr-2 h-6 w-6" />
              Orders by Status
            </div>
            <div className="space-y-8">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-300 rounded-md mr-2"></div>
                    <span className="text-lg text-gray-800">Pending</span>
                  </div>
                  <span className="text-lg font-bold text-gray-800">
                    {reportData.totalByStatus.PENDING ?? 0}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-6">
                  <div
                    className="bg-yellow-300 h-6 rounded-full"
                    style={{
                      width: `${
                        (reportData.totalByStatus.PENDING / reportData.total) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-300 rounded-md mr-2"></div>
                    <span className="text-lg text-gray-800">Completed</span>
                  </div>
                  <span className="text-lg font-bold text-gray-800">
                    {reportData.totalByStatus.COMPLETED ?? 0}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-6">
                  <div
                    className="bg-green-300 h-6 rounded-full"
                    style={{
                      width: `${
                        (reportData.totalByStatus.COMPLETED /
                          reportData.total) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl  ">
            <div className="text-xl font-bold flex items-center mb-6 text-gray-800">
              <Users className="mr-2 h-6 w-6" />
              Top Dine-In Tables
            </div>
            <div className="space-y-4">
              {reportData.topDineInTables.map((table, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0
                          ? "bg-yellow-300"
                          : index === 1
                          ? "bg-gray-300"
                          : "bg-orange-300"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="ml-3 text-lg text-gray-800">
                      Table #{table.orderNumber}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    {table.count} orders
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
