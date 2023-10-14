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

const HeartRate = () => {
  const [filteredHr, setFilteredHr] = useState(null);
  const [minMaxHr, setMinMaxHr] = useState({});
  const [showRawData, setShowRawData] = useState(false);

  // Get data from Redux
  const { filterDate, navIsOpen, hr } = useSelector(
    (state) => state.dataReader
  );

  // Initializing hooks
  const dispatch = useDispatch();

  const handleDateChange = (date) => {
    dispatch(updateFilterDate(new Date(date)));
  };

  const CustomHrTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { start, value } = payload[0].payload;

      return (
        <div className="custom-tooltip">
          <p>{value} bpm</p>
          <p>{unixToHours(start)}</p>
        </div>
      );
    }

    return null;
  };

  // Update chart when date changes or when hr is populated
  useEffect(() => {
    if (hr && filterDate) {
      const filteredHrData = filterByDate(hr, filterDate);
      setFilteredHr(filteredHrData);
      setMinMaxHr(findMinMax(filteredHrData));
    }
  }, [filterDate, hr]);

  return (
    <div
      className="app-wrapper"
      style={navIsOpen ? { marginLeft: "320px" } : { marginLeft: "60px" }}
    >
      <h1>Heart Rate</h1>
      {filterDate && (
        <>
          <div className="chart-wrapper">
            <ChartDateNav />
            <div>
              {filteredHr?.[0]?.start ? (
                <p>
                  Min: {minMaxHr.min}, Max: {minMaxHr.max}
                </p>
              ) : (
                <p>No data on chosen date.</p>
              )}
            </div>
            <LineChart
              width={filteredHr ? filteredHr.length * 30 : null}
              height={500}
              data={filteredHr}
              margin={{ top: 20, right: 40, bottom: 20, left: 20 }}
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
                tick={{ fill: "snow" }}
              />
              <YAxis
                unit={" bpm"}
                domain={["dataMin", "dataMax"]}
                interval="preserveEnd"
                tickMargin={10}
                stroke="#787E91"
                tick={{ fill: "snow" }}
              />
              <Tooltip content={<CustomHrTooltip />} />
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
                      <th>Heart rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hr &&
                      hr.map((record) => {
                        return (
                          <tr
                            key={record.id}
                            onClick={() =>
                              handleDateChange(new Date(record.start))
                            }
                            className="raw-data-tr"
                          >
                            <td>{unixToDateTime(record.start)}</td>
                            <td>{`${record.value} bpm`}</td>
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

export default HeartRate;
