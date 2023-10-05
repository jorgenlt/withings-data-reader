import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import {
  updateHr,
  updateSpo2,
  updateFilterDate,
  updateSleepState,
  updateSleep,
  updateWeight,
} from "./features/dataReader/dataReaderSlice";
import { format, addDays } from "date-fns";
import Spo2 from "./features/dataReader/Spo2";
import HeartRate from "./features/dataReader/HeartRate";
import Nav from "./components/Nav";
import Home from "./components/Home";
import User from "./features/dataReader/User";
import Weight from "./features/dataReader/Weight";
import Instructions from "./features/dataReader/Instructions";
import Sleep from "./features/dataReader/Sleep";

function App() {
  const { rawSpo2AutoSpo2, rawHrHr, rawTrackerSleepState, sleep, weight } =
    useSelector((state) => state.dataReader.files);
  // console.log(rawTrackerSleepState);

  const dispatch = useDispatch();

  // Populate sp02 state
  useEffect(() => {
    if (rawSpo2AutoSpo2) {
      // Process raw data
      let rawData = [...rawSpo2AutoSpo2];

      // Remove headers
      rawData.shift();

      // Creating an array of objects
      const data = rawData.map((row) => {
        const start = row[0] ? new Date(row[0]).getTime() : "";
        const value = row[2] ? parseInt(row[2].replace(/[[\]]/g, "")) : "";

        return {
          start,
          value,
          id: start,
        };
      });

      // Sort by date
      const sortedData = data.sort((a, b) => a.start - b.start);

      // Updating spo2 in state
      dispatch(updateSpo2(sortedData));

      // Set most recent date
      dispatch(updateFilterDate(sortedData[sortedData.length - 1].start));
    }
  }, [rawSpo2AutoSpo2]);

  // Populate hr state
  useEffect(() => {
    if (rawHrHr) {
      // Process raw data
      let rawData = [...rawHrHr];

      // Remove headersResponsiveContainer
      rawData.shift();

      // Creating an array of objects
      const data = rawData.map((row) => {
        const start = row[0] ? new Date(row[0]).getTime() : "";
        const value = row[2] ? parseInt(row[2].replace(/[[\]]/g, "")) : "";

        return {
          start,
          value,
          id: start,
        };
      });

      // Sort by date
      const sortedData = data.sort((a, b) => a.start - b.start);

      // Updating hr in state
      dispatch(updateHr(sortedData));
    }
  }, [rawHrHr]);

  // Populate sleep state
  useEffect(() => {
    if (rawTrackerSleepState) {
      const data = [];

      // Sort all entries into groups with one group per day
      // Skip header row (let i = 1)
      for (let i = 1; i < rawTrackerSleepState.length; i++) {
        const item = rawTrackerSleepState[i];

        // Extract year, month and day directly from the string
        // const [year, month, day] = item[0]
        //   .substring(0, 10)
        //   .split("-")
        //   .map((x) => Number(x));
        // const date = new Date(Date.UTC(year, month - 1, day)).getTime(); // Months are 0-based

        const start = new Date(item[0]).getTime();
        const startHour = new Date(item[0]).getHours();
        const date = startHour < 12 ? format(start, "MMMM d y") : format(addDays(start, 1), "MMMM d y");

        // Parse the duration and value arrays
        const duration = JSON.parse(item[1]);
        const values = JSON.parse(item[2]);

        // Try to find the item in data array
        const foundItem = data.find((newItem) => newItem.date === date);

        if (foundItem) {
          // If the item exists, append the duration and values
          foundItem.duration = [...foundItem.duration, ...duration];
          foundItem.values = [...foundItem.values, ...values];
        } else {
          // Else, create a new item
          data.push({
            date,
            start,
            duration,
            values,
            id: start,
          });
        }
      }

      // Sort by date
      // const sortedData = data.sort((a, b) => new Date(a.start) - new Date(b.start))
      // console.log('data:', data);
      // console.log('sortedData', sortedData);
      // Updating hr in state

      dispatch(updateSleepState(data));
    }
  }, [rawTrackerSleepState]);

  // Populate sleep
  useEffect(() => {
    if (sleep) {
      // Process raw data
      let rawData = [...sleep];

      // Remove headers
      rawData.shift();

      // Creating an array of objects
      const data = rawData.map((row) => {
        const start = new Date(row[0]).getTime();
        const startHour = new Date(row[0]).getHours();
        const date = startHour < 12 ? format(start, "MMMM d y") : format(addDays(start, 1), "MMMM d y");
        const end = new Date(row[1]).getTime();
        const light = Number(row[2]);
        const deep = Number(row[3]);
        const rem = Number(row[4]);
        const awake = Number(row[5]);
        const avgHr = Number(row[11]);
        const hrMin = Number(row[12]);
        const hrMax = Number(row[13]);

        return {
          date,
          start,
          end,
          light,
          deep,
          rem,
          awake,
          avgHr,
          hrMin,
          hrMax,
          id: start
        };
      });

      // Sort by date
      const sortedData = data.sort((a, b) => a.start - b.start);

      // // Updating sleep in state
      dispatch(updateSleep(sortedData));
    }
  }, [sleep]);

  // Populate weight
  useEffect(() => {
    if (weight) {
      // Process raw data
      let rawData = [...weight];

      // Remove headers
      rawData.shift();

      // Creating an array of objects
      const data = rawData.map((row) => {
        const date = new Date(row[0]).getTime();
        const weight = Number(row[1]);

        return {
          id: date,
          date,
          weight,
        };
      });

      // Sort by date
      const sortedData = data.sort((a, b) => a.date - b.date);

      // Updating sleep in state
      dispatch(updateWeight(sortedData));
    }
  }, [weight]);

  return (
    <Router>
      <>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spo2" element={<Spo2 />} />
          <Route path="/heartrate" element={<HeartRate />} />
          <Route path="/user" element={<User />} />
          <Route path="/weight" element={<Weight />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/sleep" element={<Sleep />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
