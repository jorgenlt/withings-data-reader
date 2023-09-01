import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { filterByDate } from "../../common/utils/queryFilters";
import { addDays, format, formatDistanceStrict } from "date-fns";
import { formatSeconds } from "../../common/utils/dateFormat";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { updateFilterDate } from "./dataReaderSlice";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

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

  // Navigate date
  const handleNavigateDate = (direction) => {
    if (direction === "prev") {
      const prevDate = addDays(filterDate, -1);
      dispatch(updateFilterDate(prevDate));
    } else {
      const nextDate = addDays(filterDate, 1);
      dispatch(updateFilterDate(nextDate));
    }
  };

  const prepareData = (durations, filteredSleepStateData, prevTime) => {
    let data = [];

    durations.forEach((duration, i) => {
      // Convert duration to milliseconds
      const durationInMilliseconds = duration * 1000;
      const start = prevTime;
      const end = prevTime + durationInMilliseconds;

      let value;
      // Assign values based on filteredSleepStateData
      switch (filteredSleepStateData[0].values[i]) {
        case 2:
          value = 1;
          break;
        case 1:
          value = 2;
          break;
        default:
          value = 3;
      }

      // Push data into array
      data.push({
        start,
        end,
        duration,
        sleepState: value,
      });

      prevTime += durationInMilliseconds;
    });

    return data;
  };

  const unixToHours = (unix) => format(new Date(unix), "HH:mm");

  const sleepStateToText = (value) => {
    switch (value) {
      case 3:
        return "Awake";
      case 2:
        return "Light sleep";
      case 1:
        return "Deep sleep";
      default:
        return "";
    }
  };

  const formatTickY = (value) => sleepStateToText(value);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { duration, sleepState, start, end } = payload[0].payload;

      return (
        <div className="custom-tooltip">
          <p className="sleep-state">{sleepStateToText(sleepState)}</p>
          <p>
            From {unixToHours(start)} to {unixToHours(end)}
          </p>
          <p>{duration / 60} minutes</p>
        </div>
      );
    }

    return null;
  };

  const handleDateChange = date => {
    dispatch(updateFilterDate(new Date(date)));
  };

  // Update chart when date changes or when sleepState is populated
  useEffect(() => {
    if (sleepState && filterDate && sleep) {
      // Filter data by date
      const filteredSleepStateData = filterByDate(sleepState, filterDate);
      const filteredSleepData = filterByDate(sleep, filterDate);

      if (filteredSleepData) {
        setFilteredSleep(filteredSleepData[0]);
      }

      let sleepStart = filteredSleepData[0]
        ? filteredSleepData[0].start
        : 1693174080000;

      let prevTime = sleepStart;

      // Loop durations
      const durations = filteredSleepStateData[0]?.duration;

      if (durations) {
        setFilteredSleepState(
          prepareData(durations, filteredSleepStateData, prevTime)
        );
      }
    }
  }, [filterDate, sleepState, sleep]);

  useEffect(() => {
    if (filteredSleepState) {
      // console.log('filteredSleepState:', filteredSleepState);
      // console.log('sleepState', sleepState);
    }

    if (filteredSleep) {
      // console.log("filteredSleep", filteredSleep);
    }
  }, [filteredSleepState, sleepState]);

  return (
    <div
      className="app-wrapper"
      style={navIsOpen ? { marginLeft: "320px" } : { marginLeft: "60px" }}
    >
      <h1>Sleep State</h1>
      <>
        <div className="chart-wrapper">
          <div className="chart--date">
            <div
              className="chart--date-icon"
              onClick={() => handleNavigateDate("prev")}
            >
              <FaAngleLeft />
            </div>
            <div
              className="chart--date-icon"
              onClick={() => handleNavigateDate("right")}
            >
              <FaAngleRight />
            </div>
            {filterDate && <h3>{format(filterDate, "MMMM d y")}</h3>}
            {filteredSleepState?.[0]?.start && filteredSleep?.start ? (
              <p></p>
            ) : (
              <p>No data on chosen date.</p>
            )}
          </div>
          {filteredSleepState && filteredSleep && (
            <>
              <div className="sleep-stats">
                <p></p>
                <p>
                  You got{" "}
                  <strong>
                    {formatDistanceStrict(
                      new Date(filteredSleep.start),
                      new Date(filteredSleep.end),
                      { unit: "hour" }
                    )}
                  </strong>{" "}
                  of sleep. <strong>{formatSeconds(filteredSleep.deep)}</strong>{" "}
                  of this was deep sleep,{" "}
                  <strong>{formatSeconds(filteredSleep.light)}</strong> was
                  light sleep and you were awake for{" "}
                  <strong>{formatSeconds(filteredSleep.awake)}</strong>. You
                  fell asleep at{" "}
                  <strong>{unixToHours(filteredSleep.start)}</strong>, and got
                  up at <strong>{unixToHours(filteredSleep.end)}</strong>.
                </p>
                <p>
                  Your average heart rate during the night was{" "}
                  <strong>{filteredSleep.avgHr}</strong> bpm. The highest heart
                  rate measured was <strong>{filteredSleep.hrMax}</strong> bpm
                  and the lowest was <strong>{filteredSleep.hrMin}</strong> bpm.
                </p>
              </div>
              <AreaChart
                width={filteredSleepState.length * 20}
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
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "", strokeWidth: 2 }}
                />
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
                          onClick={() => handleDateChange(new Date(record.start))}
                          className="sleep-table-row"
                        >
                          <td>{format(record.start, "MMMM d y")}</td>
                          <td>{format(record.start, "HH:mm")}</td>
                          <td>{format(record.end, "HH:mm")}</td>
                          <td>
                            {formatSeconds((record.end - record.start) / 1000)}
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
    </div>
  );
};

export default Sleep;
