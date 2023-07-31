import { useSelector, useDispatch } from 'react-redux'
import { uploadFileThunk, filterSp02 } from './features/dataReader/dataReaderSlice'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [filterDate, setFilterDate] = useState(null);

  const { spo2Auto, filterSp02Auto } = useSelector(state => state.dataReader);

  const dispatch = useDispatch();

  const handleFileUpload = e => dispatch(uploadFileThunk(e.target.files[0]));

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    width: 1000,
    height: 500,
    layout: {
      padding: 40
    },
    scales: {
      y: {
          min: 70,
          max: 104,
      },
      x: {},
    },
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true, 
        text: 'Chart.js Line Chart'
      }
    },
    animation: {},
    elements: {
      line: {
        tension: 0.5 // add spline tension  
      }
    },
  };

  const data = {
    labels: filterSp02Auto ? filterSp02Auto.map(record => record.start) : spo2Auto.map(record => record.start),
    datasets: [
      {
        label: 'spo2',
        data: filterSp02Auto ? filterSp02Auto.map(record => record.value) : spo2Auto.map(record => record.value),
        borderColor: '#ff4500',
        backgroundColor: '#ff4500',
        borderWidth: 2,
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowBlur: 10
      }
    ],
  };

  const handleDateChange = date => {
    setFilterDate(new Date(date));
    dispatch(filterSp02(new Date(date)));
  };

  return (
    <>
      <section className='upload'>
        <input type="file" onChange={handleFileUpload}/>
      </section>
      <section className='table'>
      <DatePicker 
        selected={filterDate}
        onChange={handleDateChange} 
      />
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
                <tr>
                  <td></td>
                  <td>
                    No data uploaded.
                  </td>
                  <td></td>
                </tr>
              )
            }
          </tbody>
        </table>
      </section>
      <section>
        <div className='chart-wrapper'>
          <Line 
            options={options} 
            data={data}
            updateMode='active'
            redraw={false}
          />
        </div>
      </section>
    </>
  )
}

export default App;