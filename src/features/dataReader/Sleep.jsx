import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { filterByDate } from '../../common/utils/queryFilters'
import { addDays, format } from 'date-fns'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { updateFilterDate } from "./dataReaderSlice"

const Sleep = () => {
  const [filteredSleepState, setFilteredSleepState] = useState(null);
  const [showRawData, setShowRawData] = useState(false);

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

      // get sleep start from sleep data later, different csv-file
      let sleepStart = new Date("2023-07-29T02:40:00+02:00").getTime();

      let prevTime = sleepStart;

      // prepare data for chart
      let data = [];

      // loop durations
      const durations = filteredSleepStateData[0].duration

      durations.forEach((duration, i) => {
        const start = format(new Date(prevTime), 'HH:mm:ss');
        const end = format(new Date(prevTime + duration * 1000), 'HH:mm:ss');
        
        let value;
        if (filteredSleepStateData[0].values[i] === 2) {
          value = 300;
        } else if (filteredSleepStateData[0].values[i] === 1) {
          value = 200;
        } else {
          value = 100;
        }
        
        data.push({
          start,
          end,
          duration,
          value
        });

        prevTime += duration * 1000;
      });

      setFilteredSleepState(data);
    }
  }, [filterDate, sleepState])

  useEffect(() => {
    if (filteredSleepState) {
      console.log('filteredSleepState:', filteredSleepState);
      console.log('sleepState', sleepState);
    }
  }, [filteredSleepState, sleepState])
  

  return (
    <div 
      className='app-wrapper' style={navIsOpen ? { marginLeft: '320px' } : { marginLeft: '60px' }}
    >
      <h1>Sleep State</h1>
      {
        filteredSleepState &&
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
      }
    </div>
  )
}

export default Sleep