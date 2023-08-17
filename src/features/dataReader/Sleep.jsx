import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { filterByDate } from '../../common/utils/queryFilters'
import { addDays, format } from 'date-fns'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { updateFilterDate } from "./dataReaderSlice"



import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Sleep = () => {
  const [filteredSleepState, setFilteredSleepState] = useState(null);
  const [showRawData, setShowRawData] = useState(false);
  const [awakeData, setAwakeData] = useState(null);
  const [lightSleepData, setLightSleepData] = useState(null);
  const [deepSleepData, setDeepSleepData] = useState(null);

  // Get data from Redux
  const { filterDate, navIsOpen, sleepState } = useSelector(state => state.dataReader);

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

  // Update chart when date changes or when sleepState is populated
  useEffect(() => {
    if (sleepState && filterDate) {
      const filteredSleepStateData = filterByDate(sleepState, filterDate);
      const awake = filteredSleepStateData.filter(d => d.value === 0); 
      const light = filteredSleepStateData.filter(d => d.value === 1);
      const deep = filteredSleepStateData.filter(d => d.value === 2);
      // console.log('awake:', awake);
      // console.log('light:', light);
      // console.log('deep', deep);
      console.log(filteredSleepStateData);
      setFilteredSleepState(filteredSleepStateData);
      setAwakeData(awake);
      setLightSleepData(light);
      setDeepSleepData(deep);
    }
  }, [filterDate, sleepState])

  return (
    <div 
      className='app-wrapper' style={navIsOpen ? { marginLeft: '320px' } : { marginLeft: '60px' }}
    >
      <h1>Sleep State</h1>
      {
        sleepState &&
        <>
          <div className='chart-wrapper'>
            <div className='chart--date'>
              <div className="chart--date-icon" onClick={() => handleNavigateDate('prev')}><FaAngleLeft /></div>
              <div className="chart--date-icon" onClick={() => handleNavigateDate('right')}><FaAngleRight /></div>
              <h3>{format(filterDate, 'MMMM d y')}</h3>
              {
                filteredSleepState?.[0]?.start ? (
                  <p></p>
                ) : (
                  <p>No data on chosen date.</p>
                )
              }
            </div>
            {/* <ResponsiveContainer width={1000} aspect={2.5}>
            
            </ResponsiveContainer> */}

            <AreaChart data={filteredSleepState}>
              <Area 
                dataKey="duration"
                stroke="#8884d8"
                fill={(data) => {
                  if(data.value === 0) return '#555'; 
                  if(data.value === 1) return '#abc';
                  if(data.value === 2) return '#888';
                }}
              />
              <XAxis dataKey="start" />
              <YAxis dataKey="value" />
              <Tooltip
                labelFormatter={(value) => {
                  if(value === 0) return 'Awake';
                  if(value === 1) return 'Light Sleep';
                  if(value === 2) return 'Deep Sleep'; 
                }}
              />
            </AreaChart>
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
                      <th>Start</th>
                      <th>Duration</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    { sleepState &&
                      sleepState.map(record => {
                        return (
                          <tr key={record.id}>
                            <td>{record.start}</td>
                            <td>{record.duration}</td>
                            <td>{`${record.value}`}</td>
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

export default Sleep