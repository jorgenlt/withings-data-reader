import { useSelector } from "react-redux";
import { useState } from "react";
import { format } from "date-fns";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const Weight = () => {
  const [showRawData, setShowRawData] = useState(false);

  // Get data from Redux
  const { navIsOpen, weight } = useSelector((state) => state.dataReader);

  // Function to generate ticks on the Y-axis
  const ticksY = () => {
    const minWeight = weight.reduce(
      (min, p) => (p.weight < min ? p.weight : min),
      weight[0].weight
    );

    const maxWeight = weight.reduce(
      (max, p) => (p.weight > max ? p.weight : max),
      weight[0].weight
    );

    const ticksArray = Array.from(
      { length: maxWeight + 1 - (minWeight - 1) + 1 },
      (_, i) => minWeight - 1 + i
    );

    return ticksArray;
  };

  return (
    <div
      className="app-wrapper"
      style={navIsOpen ? { marginLeft: "320px" } : { marginLeft: "60px" }}
    >
      <h1>Weight</h1>
      {weight && (
        <>
          <div className="chart-wrapper">
            <ResponsiveContainer width={weight.length * 150} aspect={2.5}>
              <LineChart
                data={weight}
                margin={{ top: 40, right: 60, bottom: 40, left: 20 }}
                style={{ fontFamily: "sans-serif" }}
              >
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#C736E7"
                  strokeWidth={2}
                  dot={{
                    stroke: "#C736E7",
                    strokeWidth: 2,
                    background: "#C736E7",
                  }}
                />
                <CartesianGrid stroke="#787E91" strokeDasharray="5 5" />
                <XAxis
                  dataKey="date"
                  type="number"
                  domain={["auto", "auto"]}
                  scale="time"
                  tickFormatter={(time) => format(new Date(time), "LLL d y")}
                  tick={{ fill: "snow" }}
                  tickMargin={10}
                  interval={0}
                  angle={0}
                  padding={{ left: 0 }}
                  stroke="#787E91"
                />
                <YAxis
                  stroke="#787E91"
                  unit={"kg"}
                  domain={["auto", "auto"]}
                  interval="preserveStart"
                  tickMargin={10}
                  ticks={ticksY()}
                  tick={{ fill: "snow" }}
                />
                <Tooltip
                  cursor={{ stroke: "#C736E7", strokeWidth: 1 }}
                  contentStyle={{
                    backgroundColor: "#1214167a",
                    border: "none",
                    borderRadius: "5px",
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
            <p
              onClick={() => setShowRawData((prev) => !prev)}
              className="show-raw-data"
            >
              Raw data
            </p>
          </div>

          {showRawData && (
            <div className="raw-data">
              <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weight &&
                      weight.map((record) => {
                        console.log(record);
                        return (
                          <tr key={record.id}>
                            <td>{format(new Date(record.date), "MMMM d y")}</td>
                            <td>{`${record.weight} kg`}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Weight;
