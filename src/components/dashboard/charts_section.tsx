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
  { name: "Study", value: 57, color: "#ec4899" },
  { name: "Exams", value: 19, color: "#f97316" },
  { name: "Other", value: 24, color: "#e2e8f0" },
];

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Chart */}
      <Card className="bg-white shadow-lg rounded-xl border-0">
        <CardHeader>
          <CardTitle>This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis hide />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 0, 0]}
                  fill="url(#pinkGradient)"
                />
                <defs>
                  <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Activities Chart */}
      <Card className="bg-white shadow-lg rounded-xl border-0">
        <CardHeader>
          <CardTitle>Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="relative">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={activitiesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
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
            <div className="ml-8 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span className="text-sm">Study (57%)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm">Exams (19%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}