import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { filterByDate } from '../../common/utils/queryFilters'
import { addDays, format } from 'date-fns'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { updateFilterDate } from "./dataReaderSlice"
import { 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

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

  const tickX = value => {
    return `${value / 60} min`
  }
  
  const barHeight = value => {
    if (value === 0) {
      return '150'; 
    } else if (value === 1) {
      return '100';
    } else if (value === 2) {
      return '50';
    } else {
      return '';
    }
  }

  const CustomBar = props => {
    const { x, y, width, height } = props;

    return (
      <svg width={width} height={height}>
        <path 
          d={`
            M${x},${y}  
            L${x},${y + height * 100}
            L${x + width * 100},${y + height * 100}  
            L${x + width * 100},${y}
            Z
          `}
        
        />
      </svg>
    )
  }

  // Update chart when date changes or when sleepState is populated
  useEffect(() => {
    if (sleepState && filterDate) {
      const filteredSleepStateData = filterByDate(sleepState, filterDate);
      console.log('filteredSleepStateData:', filteredSleepStateData);
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
            
            <ResponsiveContainer width={1000} aspect={2.5}>
              <LineChart 
                // width={800} 
                // height={400} 
                data={filteredSleepState}
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
                  strokeDasharray="1 1"
                  />
                <XAxis 
                  dataKey={entry => entry.duration}
                  tickMargin={10}
                  angle={0}
                  padding={{ left: 0 }}
                  stroke="#787E91"
                  tickFormatter={value => tickX(value)}
                  />
                <YAxis 
                  unit={''}
                  // domain={[70, 105]}
                  // interval='preserveEnd'
                  // scale={'log'}
                  tickMargin={10}
                  stroke="#787E91"
                  tickFormatter={value => tickY(value)}
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