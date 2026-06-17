import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function ActivityChart() {
  const data = [
    { month: "Jan", planned: 18, completed: 12 },
    { month: "Feb", planned: 22, completed: 19 },
    { month: "Mar", planned: 20, completed: 15 },
    { month: "Apr", planned: 28, completed: 25 },
    { month: "May", planned: 26, completed: 22 },
    { month: "Jun", planned: 32, completed: 30 },
  ];

  return (
    <div
      className="bg-white border rounded-4 p-4 h-100"
    >
      <h4 className="fw-bold mb-4">
        Task Activity
      </h4>

      <div style={{ height: "320px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis dataKey="month" />

            <YAxis />

            <Bar
              dataKey="planned"
              fill="#c7d2fe"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="completed"
              fill="#3b82f6"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ActivityChart;