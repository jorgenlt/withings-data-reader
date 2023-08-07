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

const Spo2 = () => {
  const [filteredSpo2, setFilteredSpo2] = useState(null);
  const [minMaxSpo2, setMinMaxSpo2] = useState({});
  const [showRawData, setShowRawData] = useState(false);

  // Get data from Redux
  const { filterDate, navIsOpen, spo2 } = useSelector(state => state.dataReader);

  // Update chart when date changes or when spo2 is populated
  useEffect(() => {

    console.log('Update chart when date changes or when spo2 is populated');

    if (spo2 && filterDate) {

      console.log('if (spo2 && filterDate) executed');

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
              {
                filteredSpo2?.[0]?.start ? (
                  <>
                    <h3>{filteredSpo2[0].start.split(',')[0]}</h3>
                    <p>Min: {minMaxSpo2.min}, Max: {minMaxSpo2.max}</p>
                  </>
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