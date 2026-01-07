import { Card, CardContent, CardHeader, CardTitle } from "../ui/card/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const weeklyData = [
  { name: "Mon", value: 20 },
  { name: "Tue", value: 35 },
  { name: "Wed", value: 30 },
  { name: "Thu", value: 45 },
  { name: "Fri", value: 25 },
  { name: "Sat", value: 15 },
  { name: "Sun", value: 10 },
];

const activitiesData = [
  { name: "training-completed", value: 57, color: "#ec4899" },
  { name: "training-all", value: 24, color: "#e2e8f0" },
];

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Activities Chart */}
      <Card className="bg-white shadow-lg rounded-xl border-0">
        <CardHeader>
          <CardTitle>Training Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="relative">
              <ResponsiveContainer width={300} height={300}>
                <PieChart>
                  <Pie
                    data={activitiesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={1}
                    dataKey="value"
                  >
                    {activitiesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl">76%</span>
                <span className="text-sm text-gray-500">Complete</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}