import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { filterByDate } from '../../common/utils/queryFilters'
import { addDays, format } from 'date-fns'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { updateFilterDate } from "./dataReaderSlice"
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
  const { 
    filterDate, 
    navIsOpen, 
    sleepState, 
    sleep 
  } = useSelector(state => state.dataReader);

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
    if (sleepState && filterDate && sleep) {
      const filteredSleepStateData = filterByDate(sleepState, filterDate);
      const filteredSleepData = filterByDate(sleep, filterDate);

      if (filteredSleepData) {
        setFilteredSleep(filteredSleepData[0]);
      }

      // get sleep start from sleep data later, different csv-file
      // let sleepStart = new Date("2023-07-29T02:40:00+02:00").getTime();
      let sleepStart = filteredSleepData[0] ? filteredSleepData[0].start : 1693174080000; 
      // console.log('sleepStart', sleepStart);

      let prevTime = sleepStart;

      // prepare data for chart
      let data = [];

      // loop durations
      const durations = filteredSleepStateData[0]?.duration;

      if (durations) {
        durations.forEach((duration, i) => {
          const start = prevTime;
          const end = prevTime + duration * 1000;
          // const start = format(new Date(prevTime), 'HH:mm');
          // const end = format(new Date(prevTime + duration * 1000), 'HH:mm');
          
          let value;
          if (filteredSleepStateData[0].values[i] === 2) {
            value = 1;
          } else if (filteredSleepStateData[0].values[i] === 1) {
            value = 2;
          } else {
            value = 3;
          }
          
          data.push({
            start,
            end,
            duration,
            sleepState: value
          });
  
          prevTime += duration * 1000;
        });
        setFilteredSleepState(data);
      }

    }
  }, [filterDate, sleepState, sleep])

  useEffect(() => {
    if (filteredSleepState) {
      // console.log('filteredSleepState:', filteredSleepState);
      // console.log('sleepState', sleepState);
    }

    // if (filteredSleep) {
      // console.log('filteredSleep', filteredSleep);
    // }
  }, [filteredSleepState, sleepState])

  const formatTickY = value => {
    if (value === 3) {
      return 'Awake';
    } else if (value === 2) {
      return 'Light sleep';
    } else if (value === 1) {
      return 'Deep sleep';
    } else {
      return '';
    }
  }

  const formatTooltip = (value, name) => {
    let newValue;
    if (value === 3) {
      newValue = 'Awake';
    } else if (value === 2) {
      newValue = 'Light sleep';
    } else if (value === 1) {
      newValue = 'Deep sleep';
    } else {
      newValue = '';
    }

    return [newValue, '']
  }

  return (
    <div 
      className='app-wrapper' style={navIsOpen ? { marginLeft: '320px' } : { marginLeft: '60px' }}
    >
      <h1>Sleep State</h1>
        <>
          <div className='chart-wrapper'>
            <div className='chart--date'>
              <div className="chart--date-icon" onClick={() => handleNavigateDate('prev')}><FaAngleLeft /></div>
              <div className="chart--date-icon" onClick={() => handleNavigateDate('right')}><FaAngleRight /></div>
              {filterDate && <h3>{format(filterDate, 'MMMM d y')}</h3>}
              {
                filteredSleepState?.[0]?.start && filteredSleep?.start ? (
                  <p></p>
                  ) : (
                  <p>No data on chosen date.</p>
                )
              }
            </div>
            {
              filteredSleepState && filteredSleep &&
              <>
                <AreaChart
                  width={filteredSleepState.length * 20} 
                  height={300} 
                  data={filteredSleepState}
                  margin={{
                    top: 50,
                    right: 30,
                    left: 20,
                    bottom: 0
                  }}
                >
                  {/* <CartesianGrid strokeDasharray="3 3" /> */}
                  <XAxis 
                    dataKey="start"
                    type='number'
                    domain={[filteredSleep.start, filteredSleep.end]}
                    scale="time"
                    tickFormatter={time => format(new Date(time), 'HH:mm')}
                    tick={{fill: 'snow'}}
                  />
                  <YAxis 
                    tickCount={4}
                    tickFormatter={formatTickY}
                    tickMargin={10}
                    tick={{fill: 'snow'}}
                  />
                  <Tooltip 
                    formatter={formatTooltip}
                  />
                  <Area
                    type="step"
                    dataKey="sleepState"
                    stroke=""
                    fill="pink"
                  />
                </AreaChart>

                <p 
                onClick={() => setShowRawData(prev=> !prev)}
                className="show-raw-data"
                >
                  Raw data
                </p>
              </>
            }
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
                            <td>{record.id}</td>
                            <td>{record.id}</td>
                            <td>{`${record.id}`}</td>
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
    </div>
  )
}

export default Sleep