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
} from 'recharts'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6"
import { updateFilterDate } from "./dataReaderSlice"

const HeartRate = () => {
  const [filteredHr, setFilteredHr] = useState(null);
  const [minMaxHr, setMinMaxHr] = useState({});
  const [showRawData, setShowRawData] = useState(false);

  // Get data from Redux
  const { filterDate, navIsOpen, hr } = useSelector(state => state.dataReader);

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

  // Update chart when date changes or when hr is populated
  useEffect(() => {
    if (hr && filterDate) {
      const filteredHrData = filterByDate(hr, filterDate);
      setFilteredHr(filteredHrData);
      setMinMaxHr(findMinMax(filteredHrData));
    }
  }, [filterDate, hr])
  
  return (
    <div 
      className='app-wrapper' style={navIsOpen ? { marginLeft: '320px' } : { marginLeft: '60px' }}
    >
      <h1>Heart Rate</h1>
      {
        filteredHr &&
        <>
          <div className='chart-wrapper'>
            <div className='chart--date'>
              <div className="chart--date-icon" onClick={() => handleNavigateDate('prev')}><FaAngleLeft /></div>
              <div className="chart--date-icon" onClick={() => handleNavigateDate('right')}><FaAngleRight /></div>
              <h3>{format(filterDate, 'MMMM d y')}</h3>
              { 
                filteredHr?.[0]?.start ? (
                  <p>Min: {minMaxHr.min}, Max: {minMaxHr.max}</p>
                ) : (
                  <p>No data on chosen date.</p>
                )
              }
            </div>
            <LineChart 
              width={filteredHr.length * 20} 
              height={300} 
              data={filteredHr}
              margin={{ top: 20, right: 40, bottom: 20, left: 20 }} 
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
                unit={' bpm'}
                domain={['dataMin', 'dataMax']}
                interval='preserveEnd'
                // scale={'log'}
                tickMargin={10}
                stroke="#787E91"
                />
              <Tooltip 
                // itemStyle={}
                // wrapperStyle={}
                // labelStyle={}
                contentStyle={{ backgroundColor: '#1214167a', border: 'none', borderRadius: '5px' }}
                cursor={{ stroke: '#C736E7', strokeWidth: 1 }}
                />
            </LineChart>
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
                      <th>Heart rate</th>
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
            </div>
          }
        </>
      }
    </div>
  )
}

export default HeartRate