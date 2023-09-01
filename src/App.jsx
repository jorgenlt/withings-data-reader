import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateHr,
  updateSpo2,
  updateFilterDate,
  updateSleepState,
  updateSleep,
  updateWeight
} from "./features/dataReader/dataReaderSlice";
import Spo2 from "./features/dataReader/Spo2";
import HeartRate from "./features/dataReader/HeartRate";
import Nav from "./components/Nav";
import Home from "./components/Home";
import User from "./features/dataReader/User";
import Weight from "./features/dataReader/Weight";
import Instructions from "./features/dataReader/Instructions";
import Sleep from "./features/dataReader/Sleep";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import format from "date-fns/format";
import { v4 as uuidv4 } from "uuid";

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
        const start = row[0]
          ? format(new Date(row[0]), "MMMM d yyyy, h:mm aaa")
          : "";
        const time = row[0] ? format(new Date(row[0]), "h:mm aaa") : "";
        const value = row[2] ? parseInt(row[2].replace(/[[\]]/g, "")) : "";

        return {
          start,
          time,
          value,
          id: uuidv4(),
        };
      });

      // Sort by date
      const sortedData = data.sort(
        (a, b) => new Date(a.start) - new Date(b.start)
      );

      // Updating spo2 in state
      dispatch(updateSpo2(sortedData));

      // Set most recent date
      dispatch(
        updateFilterDate(new Date(sortedData[sortedData.length - 1].start))
      );
    }
  }, [rawSpo2AutoSpo2]);

  // Populate hr state
  useEffect(() => {
    if (rawHrHr) {
      // Process raw data
      let rawData = [...rawHrHr];

      // Remove headers
      rawData.shift();

      // Creating an array of objects
      const data = rawData.map((row) => {
        const start = row[0]
          ? format(new Date(row[0]), "MMMM dd yyyy, h:mm aaa")
          : "";
        const time = row[0] ? format(new Date(row[0]), "h:mm:ss aaa") : "";
        const value = row[2] ? parseInt(row[2].replace(/[[\]]/g, "")) : "";

        return {
          start,
          time,
          value,
          id: uuidv4(),
        };
      });

      // Sort by date
      const sortedData = data.sort(
        (a, b) => new Date(a.start) - new Date(b.start)
      );

      // Updating hr in state
      dispatch(updateHr(sortedData));
    }
  }, [rawHrHr]);

  // Populate sleep state
  useEffect(() => {
    if (rawTrackerSleepState) {
      const data = [];

      // sort all entries into groups with one group per day
      // skip header row (let i = 1)
      for (let i = 1; i < rawTrackerSleepState.length; i++) {
        let item = rawTrackerSleepState[i];

        // Extract year, month and day directly from the string
        let [year, month, day] = item[0]
          .substring(0, 10)
          .split("-")
          .map((x) => +x);
        let date = new Date(Date.UTC(year, month - 1, day)).getTime(); // Months are 0-based

        // Parse the duration and value arrays
        let duration = JSON.parse(item[1]);
        let values = JSON.parse(item[2]);

        // Try to find the item in newArray
        let foundItem = data.find((newItem) => newItem.start === date);

        if (foundItem) {
          // If the item exists, append the duration and values
          foundItem.duration = [...foundItem.duration, ...duration];
          foundItem.values = [...foundItem.values, ...values];
        } else {
          // Else, create a new item
          data.push({
            start: date,
            duration: duration,
            values: values,
            id: uuidv4(),
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
        const end = new Date(row[1]).getTime();
        const light = Number(row[2]);
        const deep = Number(row[3]);
        const rem = Number(row[4]);
        const awake = Number(row[5]);
        const avgHr = Number(row[11]);
        const hrMin = Number(row[12]);
        const hrMax = Number(row[13]);

        return {
          id: uuidv4(),
          start,
          end,
          light,
          deep,
          rem,
          awake,
          avgHr,
          hrMin,
          hrMax,
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
          id: uuidv4(),
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
