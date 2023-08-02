import { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import { filterByDate } from '../../common/utils/queryFilters'
import { findMinMax } from '../../common/utils/findMinMax'
import { 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import "react-datepicker/dist/react-datepicker.css"
import format from 'date-fns/format'
import { v4 as uuidv4 } from 'uuid';

const HeartRate = () => {
  const [hr, setHr] = useState([]);
  const [filteredHr, setFilteredHr] = useState([]);
  const [minMaxHr, setMinMaxHr] = useState({});
  const [showRawData, setShowRawData] = useState(false);

  // Get data from Redux
  const { rawHrHr } = useSelector(state => state.dataReader.files)
  const { filterDate } = useSelector(state => state.dataReader);

  // Update chart when date changes or when hr is populated
  useEffect(() => {
    const filteredHrData = filterByDate(hr, filterDate);

    setFilteredHr(filteredHrData);

    setMinMaxHr(findMinMax(filteredHrData));
  }, [filterDate, hr])

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
      setHr(sortedData);

      // Most recent data
      const mostRecentData = filterByDate(sortedData, new Date(sortedData[sortedData.length - 1].start));
  
      // Set filtered data to most recent date initially
      setFilteredHr(mostRecentData);

      // Set min and max hr
      setMinMaxHr(findMinMax(mostRecentData));
    }
  }, [rawHrHr]);
  
  return (
    <>
      <h1>Heart Rate</h1>
      <div className='upload'>
        { filteredHr.length > 0 &&
          <>
            <h2>{filteredHr[0].start.split(',')[0]}</h2>
            <p>Min: {minMaxHr.min}, Max: {minMaxHr.max}</p>
          </>
        }
      </div>
      {
        hr.length > 0 && filteredHr.length === 0 &&
        <div>
          <p>No data on chosen date.</p>
        </div>
      }
      {
        filteredHr.length > 0 &&
        <div className='chart-wrapper'>
          <ResponsiveContainer width={filteredHr.length * 20} height={300} >
            <LineChart 
              // width={800} 
              // height={400} 
              data={filteredHr}
              margin={{ top: 20, right: 40, bottom: 20, left: 20 }} 
              style={{ fontFamily: 'sans-serif' }}
            >
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8"
                strokeWidth={2}
              />
              <CartesianGrid 
                stroke="#ccc" 
                strokeDasharray="5 5"
              />
              <XAxis 
                dataKey="time" 
                tickMargin={10}
                angle={0}
                padding={{ left: 0 }}
              />
              <YAxis 
                unit={' bpm'}
                domain={['dataMin', 'dataMax']}
                interval='preserveEnd'
                // scale={'log'}
                tickMargin={10}
              />
              <Tooltip 
                // itemStyle={}
                // wrapperStyle={}
                contentStyle={{ textTransform: 'capitalize' }}
                // labelStyle={}
              />
            </LineChart>
          </ResponsiveContainer>
          <button onClick={() => setShowRawData(prev=> !prev)}>Raw data</button>
          {
            showRawData &&
            <div className='table'>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Hear rate</th>
                  </tr>
                </thead>
                <tbody>
                  { hr &&
                    hr.map(record => {
                      return (
                        <tr key={record.id}>
                          <td>{record.start}</td>
                          <td>{`${record.value} bpm`}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      }
    </>
  )
}

export default HeartRate