import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { filterByDate } from '../../common/utils/queryFilters'
import { addDays, format } from 'date-fns'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { updateFilterDate } from "./dataReaderSlice"



// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

  const fillColor = obj => {
    if (obj.value === 0) {
      return '#e76f51'; 
    } else if (obj.value === 1) {
      return '#f4a261';
    } else {
      return '#e9c46a';
    }
  }

  const tickY = value => {
    // console.log(value);
    if (value === 0) {
      return 'awake'; 
    } else if (value === 1) {
      return 'light';
    } else if (value === 2) {
      return 'deep';
    } else {
      return '';
    }
  }
  

  // Update chart when date changes or when sleepState is populated
  useEffect(() => {
    if (sleepState && filterDate) {
      const filteredSleepStateData = filterByDate(sleepState, filterDate);
      // console.log('awake:', awake);
      // console.log('light:', light);
      // console.log('deep', deep);
      console.log('filteredSleepStateData', filteredSleepStateData);
      setFilteredSleepState(filteredSleepStateData);
    }
  }, [filterDate, sleepState])

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
            {/* <ResponsiveContainer height={500} width={filteredSleepState.length * 100}> */}
              {/* <AreaChart data={filteredSleepState}>
                      <Area 
                      dataKey="duration"
                      stroke="#8884d8"
                      fill={(data) => {
                        
                        if(data.value === 0) return 'white'; 
                        if(data.value === 1) return 'pink';
                        if(data.value === 2) return 'red';
                      }}
                    />
                <XAxis dataKey="duration" />
                <YAxis dataKey="value" />
                <Tooltip
                  labelFormatter={(value) => {
                    if(value === 0) return 'Awake';
                    if(value === 1) return 'Light Sleep';
                    if(value === 2) return 'Deep Sleep'; 
                  }}
                />
              </AreaChart> */}

              <BarChart
                data={filteredSleepState}
                // barCategoryGap={0}
                // barGap={1}
                height={500} width={filteredSleepState.length * 100}
              >

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="duration" />
              <YAxis 
                // dataKey="value" 
                tickFormatter={value => tickY(value)}
                // type='category'  
              />
              <Tooltip />
              {/* <Legend /> */}

              <Bar dataKey='value'>
                {
                  filteredSleepState &&
                  filteredSleepState.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={fillColor(entry)} padding={entry.duration / 10}/>
                  ))
                }
              </Bar>
            </BarChart>
            {/* </ResponsiveContainer> */}

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