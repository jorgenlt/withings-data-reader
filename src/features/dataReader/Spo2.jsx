import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { filterByDate } from '../../common/utils/queryFilters'
import { findMinMax } from '../../common/utils/findMinMax'
import { addDays, format } from 'date-fns'
import { 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { updateFilterDate } from "./dataReaderSlice"

const Spo2 = () => {
  const [filteredSpo2, setFilteredSpo2] = useState(null);
  const [minMaxSpo2, setMinMaxSpo2] = useState({});
  const [showRawData, setShowRawData] = useState(false);

  // Get data from Redux
  const { filterDate, navIsOpen, spo2 } = useSelector(state => state.dataReader);

  // Initializing hooks
  const dispatch = useDispatch();

  // Navigate date
  const handleNavigateDate = direction => {
    if (direction === 'prev') {
      const prevDate = addDays(filterDate, -1);
      dispatch(updateFilterDate(prevDate));
    } else {
      const nextDate = addDays(filterDate, 1);
      dispatch(updateFilterDate(nextDate));
    }
  }

  // Update chart when date changes or when spo2 is populated
  useEffect(() => {
    if (spo2 && filterDate) {
      const filteredSpo2Data = filterByDate(spo2, filterDate);
      setFilteredSpo2(filteredSpo2Data);
      setMinMaxSpo2(findMinMax(filteredSpo2Data));
    }
  }, [filterDate, spo2])

  return (
    <div 
      className='app-wrapper' style={navIsOpen ? { marginLeft: '320px' } : { marginLeft: '60px' }}
    >
      <h1>Blood Oxygen Saturation (SpO2)</h1>
      {
        filteredSpo2 &&
        <>
          <div className='chart-wrapper'>
            <div className='chart--date'>
              <div className="chart--date-icon" onClick={() => handleNavigateDate('prev')}><FaAngleLeft /></div>
              <div className="chart--date-icon" onClick={() => handleNavigateDate('right')}><FaAngleRight /></div>
              <h3>{format(filterDate, 'MMMM d y')}</h3>
              {
                filteredSpo2?.[0]?.start ? (
                  <p>Min: {minMaxSpo2.min}, Max: {minMaxSpo2.max}</p>
                ) : (
                  <p>No data on chosen date.</p>
                )
              }
            </div>
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
                  stroke="#C736E7"
                  strokeWidth={2}
                  dot={{ stroke: '#C736E7', strokeWidth: 2 , background: '#C736E7'}}
                  />
                <CartesianGrid 
                  stroke="#787E91" 
                  strokeDasharray="5 5"
                  />
                <XAxis 
                  dataKey="time" 
                  tickMargin={10}
                  angle={0}
                  padding={{ left: 0 }}
                  stroke="#787E91"
                  />
                <YAxis 
                  unit={'%'}
                  domain={[70, 105]}
                  interval='preserveEnd'
                  scale={'log'}
                  tickMargin={10}
                  stroke="#787E91"
                  />
                <Tooltip 
                  // itemStyle={}
                  // wrapperStyle={}
                  cursor={{ stroke: '#C736E7', strokeWidth: 1 }}
                  contentStyle={{ backgroundColor: '#1214167a', border: 'none', borderRadius: '5px' }}
                  // labelStyle={}
                />
              </LineChart>
            </ResponsiveContainer>
            <p 
              onClick={() => setShowRawData(prev=> !prev)}
              className="show-raw-data"
            >
              Raw data
            </p>
          </div>

          {
            showRawData &&
            <div className="raw-data">
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
                          <tr key={record.id}>
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
      }
    </div>
  )
}

export default Spo2