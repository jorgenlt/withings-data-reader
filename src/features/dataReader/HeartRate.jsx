import { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import { filterByDate } from '../../common/utils/queryFilters'
import { findMinMax } from '../../common/utils/findMinMax'
import { 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const HeartRate = () => {
  const [filteredHr, setFilteredHr] = useState(null);
  const [minMaxHr, setMinMaxHr] = useState({});
  const [showRawData, setShowRawData] = useState(false);

  // Get data from Redux
  const { filterDate, navIsOpen, hr } = useSelector(state => state.dataReader);

  // Update chart when date changes or when hr is populated
  useEffect(() => {

    console.log('Update chart when date changes or when hr is populated');

    if (hr && filterDate) {

      console.log('if (hr && filterDate) executed');

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
              { 
                filteredHr?.[0]?.start ? (
                  <>
                    <h2>{filteredHr[0].start.split(',')[0]}</h2>
                    <p>Min: {minMaxHr.min}, Max: {minMaxHr.max}</p>
                  </>
                ) : (
                  <p>No data on chosen date.</p>
                )
              }
            </div>
            <ResponsiveContainer width={filteredHr.length * 20} height={300} >
              <LineChart 
                // width={800} 
                // height={400} 
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