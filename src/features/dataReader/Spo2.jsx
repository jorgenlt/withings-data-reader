import { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import { filterByDate } from '../../common/utils/queryFilters'
import { 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import format from 'date-fns/format'

const Spo2 = () => {
  const [filterDate, setFilterDate] = useState('');
  const [spo2, setSpo2] = useState([]);
  const [filteredSpo2, setFilteredSpo2] = useState([]);
  const [showRawData, setShowRawData] = useState(false);

  // Get data from Redux
  const { rawSpo2AutoSpo2 } = useSelector(state => state.dataReader.files)

  const handleDateChange = date => {
    setFilterDate(new Date(date));
    setFilteredSpo2(filterByDate(spo2, new Date(date)));
  };

  // Populate sp02 state
  useEffect(() => {
    if (rawSpo2AutoSpo2) {
      // Process raw data
      let rawData = [...rawSpo2AutoSpo2];
      
      // Remove headers
      rawData.shift();
      
      // Creating an array of objects
      const data = rawData.map(row => {
        const start = row[0] ? format(new Date(row[0]), 'MMMM dd yyyy, h:mm aaa') : '';
        const time = row[0] ? format(new Date(row[0]), 'h:mm aaa') : '';
        const value = row[2] ? parseInt(row[2].replace(/[[\]]/g, '')) : '';
        
        return {
          start,
          time,
          value
        }
      });
      
      // Sort by date
      const sortedData = data.sort((a, b) => new Date(a.start) - new Date(b.start))
    
      // Updating spo2 in state
      setSpo2(sortedData);
  
      // Set filtered data to most recent date initially
      setFilteredSpo2(filterByDate(sortedData, new Date(sortedData[sortedData.length - 1].start)));
    }
  }, [rawSpo2AutoSpo2]);
  
  return (
    <>
      <h1>SpO2</h1>
      <div className='upload'>
        <DatePicker
          todayButton="Today"
          showPopperArrow={false}
          showIcon
          selected={filterDate}
          onChange={handleDateChange} 
          placeholderText="Choose date"
        />
        { filteredSpo2.length > 0 &&
          <h2>{filteredSpo2[0].start.split(',')[0]}</h2>
        }
      </div>
      {
        spo2.length > 0 && filteredSpo2.length === 0 &&
        <div>
          <p>No data on chosen date.</p>
        </div>
      }
      {
        filteredSpo2.length > 0 &&
        <div className='chart-wrapper'>
          <ResponsiveContainer width={1000} aspect={2.5}>
            <LineChart 
              // width={800} 
              // height={400} 
              data={filteredSpo2}
              margin={{ top: 0, right: 40, bottom: 0, left: 0 }} 
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
                unit={'%'}
                domain={[70, 105]}
                interval='preserveEnd'
                scale={'log'}
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
                    <th>Oxygen Saturation</th>
                  </tr>
                </thead>
                <tbody>
                  { spo2 &&
                    spo2.map(record => {
                      return (
                        <tr key={record.start}>
                          <td>{record.start}</td>
                          <td>{`${record.value} %`}</td>
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

export default Spo2