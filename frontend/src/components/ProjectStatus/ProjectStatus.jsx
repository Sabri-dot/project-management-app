import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

function ProjectStatus() {
  const data = [
    { name: "Active", value: 6, color: "#3b82f6" },
    { name: "Completed", value: 2, color: "#10b981" },
    { name: "Planning", value: 2, color: "#8b5cf6" },
    { name: "On Hold", value: 2, color: "#f59e0b" },
  ];

  return (
    <div
      className="bg-white border rounded-4 p-4 h-100"
    >
      <h4 className="fw-bold mb-4">
        Project Status
      </h4>

      <div
        style={{
          width: "100%",
          height: "260px",
        }}
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="row mt-3">
        {data.map((item) => (
          <div
            key={item.name}
            className="col-6 mb-3"
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: item.color,
                    display: "inline-block",
                    marginRight: "10px",
                  }}
                />

                <span>{item.name}</span>
              </div>

              <strong>{item.value}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectStatus;