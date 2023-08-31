import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { filterByDate } from '../../common/utils/queryFilters'
import { addDays, format, formatDistance, formatDistanceStrict, formatDuration } from 'date-fns'
import { formatSeconds } from '../../common/utils/dateFormat'
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

    if (filteredSleep) {
      console.log('filteredSleep', filteredSleep);
    }
  }, [filteredSleepState, sleepState])

  const unixToHours = unix => format(new Date(unix), 'HH:mm');

  const sleepStateToText = value => {
    switch(value) {
        case 3:
            return 'Awake';
        case 2:
            return 'Light sleep';
        case 1:
            return 'Deep sleep';
        default:
            return '';
    }
}

  const formatTickY = value => sleepStateToText(value);

  // const formatTooltip = (value, name) => {
  //   const newValue = sleepStateToText(value);
  //   return [newValue, ''];
  // }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const { duration, sleepState, start, end } = payload[0].payload;

      return (
        <div className="custom-tooltip">
          <p className="sleep-state">{sleepStateToText(sleepState)}</p>
          <p className="">From {unixToHours(start)} to {unixToHours(end)}</p>
          <p className="">{duration / 60} minutes</p>
        </div>
      );
    }
  
    return null;
  };

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
                <div className="sleep-stats">
                  <p>
                  </p>
                  <p>
                    You got <strong>{formatDistanceStrict(new Date(filteredSleep.start), new Date(filteredSleep.end), { unit: 'hour' })}</strong> of 
                    sleep last night. <strong>{formatSeconds(filteredSleep.deep)}</strong> of this was deep sleep, <strong>{formatSeconds(filteredSleep.light)}</strong> was light 
                    sleep and you were awake for <strong>{formatSeconds(filteredSleep.awake)}</strong>. You fell asleep at <strong>{unixToHours(filteredSleep.start)}</strong>, 
                    and got up at <strong>{unixToHours(filteredSleep.end)}</strong>.
                  </p>
                  <p>
                    Your average heart rate during the night was <strong>{filteredSleep.avgHr}</strong> bpm. The highest heart rate measured was <strong>{filteredSleep.hrMax}</strong> bpm 
                    and the lowest was <strong>{filteredSleep.hrMin}</strong> bpm.
                  </p>
                </div>
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
                  <CartesianGrid 
                    strokeDasharray="3" 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="start"
                    type='number'
                    domain={[filteredSleep.start, filteredSleep.end]}
                    scale="time"
                    tickFormatter={time => format(new Date(time), 'HH:mm')}
                    tick={{fill: 'snow'}}
                    stroke="#787E91"
                  />
                  <YAxis 
                    tickCount={4}
                    tickFormatter={formatTickY}
                    tickMargin={10}
                    tick={{fill: 'snow'}}
                    stroke="#787E91"
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: '', strokeWidth: 2 }}
                  />
                  <Area
                    type="stepAfter"
                    dataKey="sleepState"
                    stroke=""
                    fill="#C736E7"
                    fillOpacity={0.6}
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