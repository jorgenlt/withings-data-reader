import { useState } from 'react';
import Papa from 'papaparse';
import format from 'date-fns/format';
import { useSelector, useDispatch } from 'react-redux'
import { updateSpo2Auto } from './features/dataReader/dataReaderSlice'

function App() {
  const { spo2Auto } = useSelector(state => state.dataReader);

  const dispatch = useDispatch();

  const handleFileUpload = e => {
    const file = e.target.files[0];

    // Parsing the file
    Papa.parse(file, {
      complete: results => {
        // Removes first row (headers)
        results.data.shift();

        const fileData = results.data.map(row => {
          const start = row[0] ? format(new Date(row[0]), 'MMM dd yyyy, HH:mm') : 0;
          const duration = row[1] ? parseInt(row[1].replace(/[[\]]/g, '')) : 0;
          const value = row[2] ? parseInt(row[2].replace(/[[\]]/g, '')) : 0;

          return {
            start,
            duration,
            value
          }
        });
        
        // Sort records by date
        const sortedData = fileData.sort((a, b) => {
          return new Date(a.start) - new Date(b.start);
        });
        
        // Updating the data state with the sortedData
        dispatch(updateSpo2Auto(sortedData))
      }
    });
  }

  return (
    <>
      <section className='upload'>
        <input type="file" onChange={handleFileUpload}/>
      </section>
      <section className='table'>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Duration</th>
              <th>Oxygen Saturation</th>
            </tr>
          </thead>
          <tbody>
            {
              spo2Auto.length > 0 ? (
                spo2Auto.map(record => {
                  return (
                    <tr key={record.start}>
                      <td>{record.start}</td>
                      <td>{`${record.duration} s`}</td>
                      <td>{`${record.value} %`}</td>
                    </tr>
                  )
                })
              ) : (
                console.log('No spO2 data uploaded.')
              )
            }
          </tbody>
        </table>
      </section>
    </>
  )
}

export default App;