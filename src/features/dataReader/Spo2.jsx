import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateFilterDate } from "./dataReaderSlice";
import ChartDateNav from "./ChartDateNav";
import { filterByDate } from "../../common/utils/queryFilters";
import { findMinMax } from "../../common/utils/findMinMax";
import { unixToHours, unixToDateTime } from "../../common/utils/dateFormat";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const Spo2 = () => {
  const [filteredSpo2, setFilteredSpo2] = useState(null);
  const [minMaxSpo2, setMinMaxSpo2] = useState({});
  const [showRawData, setShowRawData] = useState(false);

  // Get data from Redux
  const { filterDate, navIsOpen, spo2 } = useSelector(
    (state) => state.dataReader
  );

  // Initializing hooks
  const dispatch = useDispatch();

  const handleDateChange = (date) => {
    dispatch(updateFilterDate(new Date(date)));
  };

  const CustomSpo2Tooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { start, value } = payload[0].payload;

      return (
        <div className="custom-tooltip">
          <p>{value} %</p>
          <p>{unixToHours(start)}</p>
        </div>
      );
    }

    return null;
  };

  // Update chart when date changes or when spo2 is populated
  useEffect(() => {
    if (spo2 && filterDate) {
      const filteredSpo2Data = filterByDate(spo2, filterDate);
      setFilteredSpo2(filteredSpo2Data);
      setMinMaxSpo2(findMinMax(filteredSpo2Data));
    }
  }, [filterDate, spo2]);

  return (
    <div
      className="app-wrapper"
      style={navIsOpen ? { marginLeft: "320px" } : { marginLeft: "60px" }}
    >
      <h1>
        Blood Oxygen Saturation (SpO<sub>2</sub>)
      </h1>
      {filteredSpo2 && (
        <>
          <div className="chart-wrapper">
            <ChartDateNav />
            <div>
              {filteredSpo2?.[0]?.start ? (
                <p>
                  Min: {minMaxSpo2.min}, Max: {minMaxSpo2.max}
                </p>
              ) : (
                <p>No data on chosen date.</p>
              )}
            </div>
            <LineChart
              width={filteredSpo2.length * 30}
              height={500}
              data={filteredSpo2}
              margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
              style={{ fontFamily: "sans-serif" }}
            >
              <Line
                type="monotone"
                dataKey="value"
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
                dataKey="start"
                tickFormatter={(start) => unixToHours(start)}
                tickMargin={10}
                angle={0}
                padding={{ left: 0 }}
                stroke="#787E91"
              />
              <YAxis
                unit={"%"}
                domain={[70, 105]}
                interval="preserveEnd"
                scale={"log"}
                tickMargin={10}
                stroke="#787E91"
              />
              <Tooltip content={<CustomSpo2Tooltip />} />
            </LineChart>
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
                      <th>Time</th>
                      <th>Oxygen Saturation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spo2 &&
                      spo2.map((record) => {
                        return (
                          <tr
                            key={record.id}
                            onClick={() =>
                              handleDateChange(new Date(record.start))
                            }
                            className="raw-data-tr"
                          >
                            <td>{unixToDateTime(record.start)}</td>
                            <td>{`${record.value} %`}</td>
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

export default Spo2;
