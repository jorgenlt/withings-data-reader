import { useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { uploadFileThunk, filterSpo2 } from './dataReaderSlice'
import { 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Spo2 = () => {
  const [filterDate, setFilterDate] = useState('');

  const { spo2Auto, filteredSpo2Auto } = useSelector(state => state.dataReader);

  const dispatch = useDispatch();

  const handleFileUpload = e => dispatch(uploadFileThunk(e.target.files[0]));

  const handleDateChange = date => {
    setFilterDate(new Date(date));
    dispatch(filterSpo2(new Date(date)));
  };

  return (
    <>
      <h1>SpO2</h1>
      <p>Look for filename: <code>raw_spo2_auto_spo2.csv</code></p>
      <div className='upload'>
        <input type="file" onChange={handleFileUpload} />
        <DatePicker
          todayButton="Today"
          showPopperArrow={false}
          showIcon
          selected={filterDate}
          onChange={handleDateChange} 
          placeholderText="Choose date"
        />
        { filteredSpo2Auto.length > 0 &&
          <h2>{filteredSpo2Auto[0].start.split(',')[0]}</h2>
        }
      </div>
      {
        spo2Auto.length > 0 && filteredSpo2Auto.length === 0 &&
        <div>
          <p>No data on chosen date.</p>
        </div>
      }
      {
        filteredSpo2Auto.length > 0 &&
        <div className='chart-wrapper'>
          <ResponsiveContainer width={1000} aspect={2.5}>
            <LineChart 
              // width={800} 
              // height={400} 
              data={filteredSpo2Auto}
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
          <div className='table'>
            <h2>Raw data</h2>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Oxygen Saturation</th>
                </tr>
              </thead>
              <tbody>
                {
                  spo2Auto.map(record => {
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
        </div>
      }
    </>
  )
}

export default Spo2