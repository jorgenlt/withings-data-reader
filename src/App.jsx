import { useDispatch, useSelector } from 'react-redux'
import { deleteStoredData, uploadFilesThunk } from './features/dataReader/dataReaderSlice'
import Spo2 from './features/dataReader/Spo2'
import HeartRate from './features/dataReader/HeartRate'
import Nav from './components/Nav'

function App() {
  const { user } = useSelector(state => state.dataReader.files)

  let firstName;
  let lastName;
  if (user) {
    firstName = user[1][0];
    lastName = user[1][1];
  }

  const dispatch = useDispatch();

  const handleFileUpload = e => {
    dispatch(uploadFilesThunk(e.target.files));
  }

  const handleDeleteData = () => {
    dispatch(deleteStoredData());
    alert('All data deleted. Refresh page.');
  }
  

  return (
    <>
      <Nav />
      <div className='app-wrapper'>
        <h1>User: {firstName} {lastName}</h1>
        <input type="file" multiple="multiple" onChange={handleFileUpload} />
        <div>
          <button onClick={handleDeleteData}>Delete all data</button>
        </div>
        <Spo2 />
        <HeartRate />
      </div>
    </>
  )
}

export default App;