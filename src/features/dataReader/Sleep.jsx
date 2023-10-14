import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ChartDateNav from "./ChartDateNav";
import { filterSleepByDate } from "../../common/utils/queryFilters";
import { format } from "date-fns";
import { formatSeconds, unixToHours } from "../../common/utils/dateFormat";
import { updateFilterDate } from "./dataReaderSlice";
import { prepareSleepData, sleepStateToText } from "../../common/utils/sleepUtils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const CustomSleepTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { duration, sleepState, start, end } = payload[0].payload;

    return (
      <div className="custom-tooltip">
        <h3>{sleepStateToText(sleepState)}</h3>
        <p>
          From {unixToHours(start)} to {unixToHours(end)}
        </p>
        <p>{duration / 60} minutes</p>
      </div>
    );
  }

  return null;
};

const Sleep = () => {
  const [filteredSleepState, setFilteredSleepState] = useState(null);
  const [filteredSleep, setFilteredSleep] = useState(null);
  const [showRawData, setShowRawData] = useState(false);

  // Get data from Redux
  const { filterDate, navIsOpen, sleepState, sleep } = useSelector(
    (state) => state.dataReader
  );

  // Initializing hooks
  const dispatch = useDispatch();

  // Format the tick for y-axis
  const formatTickY = (value) => sleepStateToText(value);

  const handleDateChange = (date) => {
    dispatch(updateFilterDate(new Date(date)));
  };

  // Update chart when date changes or when sleepState is populated
  useEffect(() => {
    if (sleepState && filterDate && sleep) {
      // Filter data by filterDate
      const filteredSleepStateData = filterSleepByDate(sleepState, filterDate);
      const filteredSleepData = filterSleepByDate(sleep, filterDate);

      setFilteredSleep(filteredSleepData[0]);

      const sleepStart = filteredSleepData[0]?.start;

      // Prepare sleep data
      const durations = filteredSleepStateData[0]?.duration;

      if (durations) {
        setFilteredSleepState(
          prepareSleepData(durations, filteredSleepStateData, sleepStart)
        );
      }
    }
  }, [filterDate, sleepState, sleep]);

  return (
    <div
      className="app-wrapper"
      style={navIsOpen ? { marginLeft: "320px" } : { marginLeft: "60px" }}
    >
      <h1>Sleep State</h1>
      {filterDate && (
        <>
          <div className="chart-wrapper">
            <ChartDateNav />
            <div>
              {filteredSleepState?.[0]?.start && filteredSleep?.start ? (
                <p></p>
              ) : (
                <p>No data on chosen date.</p>
              )}
            </div>
            {filteredSleepState && filteredSleep && (
              <>
                <div className="chart-stats">
                  <p></p>
                  <p>
                    You got{" "}
                    <strong>
                      {formatSeconds(
                        (filteredSleep.end - filteredSleep.start) / 1000
                      )}
                    </strong>{" "}
                    of sleep.{" "}
                    <strong>{formatSeconds(filteredSleep.deep)}</strong> of this
                    was deep sleep,{" "}
                    <strong>{formatSeconds(filteredSleep.light)}</strong> was
                    light sleep and you were awake for{" "}
                    <strong>{formatSeconds(filteredSleep.awake)}</strong>. You
                    fell asleep at{" "}
                    <strong>{unixToHours(filteredSleep.start)}</strong>, and got
                    up at <strong>{unixToHours(filteredSleep.end)}</strong>.
                  </p>
                  <p>
                    Your average heart rate during the night was{" "}
                    <strong>{filteredSleep.avgHr}</strong> bpm. The highest
                    heart rate measured was{" "}
                    <strong>{filteredSleep.hrMax}</strong> bpm and the lowest
                    was <strong>{filteredSleep.hrMin}</strong> bpm.
                  </p>
                </div>
                <AreaChart
                  width={filteredSleepState.length * 30}
                  height={300}
                  data={filteredSleepState}
                  margin={{
                    top: 50,
                    right: 30,
                    left: 20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3" vertical={false} />
                  <XAxis
                    dataKey="start"
                    type="number"
                    domain={[filteredSleep.start, filteredSleep.end]}
                    scale="time"
                    tickFormatter={(time) => format(new Date(time), "HH:mm")}
                    tick={{ fill: "snow" }}
                    stroke="#787E91"
                  />
                  <YAxis
                    tickCount={4}
                    tickFormatter={formatTickY}
                    tickMargin={10}
                    tick={{ fill: "snow" }}
                    stroke="#787E91"
                  />
                  <Tooltip content={<CustomSleepTooltip />} />
                  <Area
                    type="stepAfter"
                    dataKey="sleepState"
                    stroke=""
                    fill="#C736E7"
                    fillOpacity={0.6}
                  />
                </AreaChart>

                <p
                  onClick={() => setShowRawData((prev) => !prev)}
                  className="show-raw-data"
                >
                  Raw data
                </p>
              </>
            )}
          </div>

          {showRawData && (
            <div className="raw-data">
              <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Duration</th>
                      <th>Light</th>
                      <th>Deep</th>
                      <th>Awake</th>
                      <th>Avg. HR</th>
                      <th>Min. HR</th>
                      <th>Max. HR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sleep &&
                      sleep.map((record) => {
                        return (
                          <tr
                            key={record.id}
                            onClick={() =>
                              handleDateChange(new Date(record.date))
                            }
                            className="raw-data-tr"
                          >
                            <td>{record.date}</td>
                            <td>{format(record.start, "HH:mm")}</td>
                            <td>{format(record.end, "HH:mm")}</td>
                            <td>
                              {formatSeconds(
                                (record.end - record.start) / 1000
                              )}
                            </td>
                            <td>{formatSeconds(record.light)}</td>
                            <td>{formatSeconds(record.deep)}</td>
                            <td>{formatSeconds(record.awake)}</td>
                            <td>{record.avgHr} bpm</td>
                            <td>{record.hrMin} bpm</td>
                            <td>{record.hrMax} bpm</td>
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

export default Sleep;
