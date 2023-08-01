import Spo2 from './features/dataReader/Spo2'
import { uploadFilesThunk } from './features/dataReader/dataReaderSlice'
import { useDispatch } from 'react-redux'

function App() {
  const dispatch = useDispatch();

  const handleFileUpload = e => {
    dispatch(uploadFilesThunk(e.target.files));
  }
  

  return (
    <>
      <input type="file" multiple="multiple" onChange={handleFileUpload} />
      <Spo2 />
    </>
  )
}

export default App;