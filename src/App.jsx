import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  updateHr,
  updateSpo2,
  updateFilterDate,
  updateSleepState
} from './features/dataReader/dataReaderSlice'
import Spo2 from './features/dataReader/Spo2'
import HeartRate from './features/dataReader/HeartRate'
import Nav from './components/Nav'
import Home from './components/Home'
import User from './features/dataReader/User'
import Weight from './features/dataReader/Weight'
import Instructions from './features/dataReader/Instructions'
import Sleep from './features/dataReader/Sleep'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import format from 'date-fns/format'
import { v4 as uuidv4 } from 'uuid';

function App() {
  const { rawSpo2AutoSpo2, rawHrHr, rawTrackerSleepState } = useSelector(state => state.dataReader.files);
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
      const data = rawData.map(row => {
        const start = row[0] ? format(new Date(row[0]), 'MMMM d yyyy, h:mm aaa') : '';
        const time = row[0] ? format(new Date(row[0]), 'h:mm aaa') : '';
        const value = row[2] ? parseInt(row[2].replace(/[[\]]/g, '')) : '';
        
        return {
          start,
          time,
          value,
          id: uuidv4()
        }
      });
      
      // Sort by date
      const sortedData = data.sort((a, b) => new Date(a.start) - new Date(b.start))
    
      // Updating spo2 in state
      dispatch(updateSpo2(sortedData));

      // Set most recent date
      dispatch(updateFilterDate(new Date(sortedData[sortedData.length - 1].start)))
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
      const data = rawData.map(row => {
        const start = row[0] ? format(new Date(row[0]), 'MMMM dd yyyy, h:mm aaa') : '';
        const time = row[0] ? format(new Date(row[0]), 'h:mm:ss aaa') : '';
        const value = row[2] ? parseInt(row[2].replace(/[[\]]/g, '')) : '';
        
        return {
          start,
          time,
          value,
          id: uuidv4()
        }
      });
      
      // Sort by date
      const sortedData = data.sort((a, b) => new Date(a.start) - new Date(b.start))
    
      // Updating hr in state
      dispatch(updateHr(sortedData));
    }
  }, [rawHrHr]);

  // Populate sleep state
  useEffect(() => {
    if (rawTrackerSleepState) {
      // // Process raw data
      // let rawData = [...rawHrHr];
      
      // // Remove headers
      // rawData.shift();
      
      // // Creating an array of objects
      // const data = rawData.map(row => {
      //   const start = row[0] ? format(new Date(row[0]), 'MMMM dd yyyy, h:mm aaa') : '';
      //   const time = row[0] ? format(new Date(row[0]), 'h:mm:ss aaa') : '';
      //   const value = row[2] ? parseInt(row[2].replace(/[[\]]/g, '')) : '';
        
      //   return {
      //     start,
      //     time,
      //     value,
      //     id: uuidv4()
      //   }
      // });


      const data = [];

      // Skip header row
      for (let i = 1; i < rawTrackerSleepState.length; i++) {

        const row = rawTrackerSleepState[i];

        const start = format(new Date(row[0]), 'MMMM dd yyyy, h:mm:ss aaa'); 
        const durations = JSON.parse(row[1]);
        const values = JSON.parse(row[2]);

        // Loop through parallel arrays
        for (let j = 0; j < durations.length; j++) {
          data.push({
            start,
            duration: durations[j],
            value: values[j],
            id: uuidv4()
          });
        }
      }




      
      // Sort by date
      const sortedData = data.sort((a, b) => new Date(a.start) - new Date(b.start))
      console.log(sortedData);
      // Updating hr in state
      dispatch(updateSleepState(sortedData));
    }
  }, [rawTrackerSleepState]);

  return (
    <Router>
      <>
        <Nav />
        <Routes>
            <Route 
              path='/' 
              element={<Home />} 
            />
            <Route 
              path='/spo2' 
              element={<Spo2 />} 
            />
            <Route 
              path='/heartrate' 
              element={<HeartRate />} 
            />
            <Route 
              path='/user'
              element={<User />}
            />
            <Route 
              path='/weight'
              element={<Weight />}
            />
            <Route 
              path='/instructions'
              element={<Instructions />}
            />
            <Route 
              path='/sleep'
              element={<Sleep />}
            />
        </Routes>
      </>
  </Router>
  )
}

export default App;