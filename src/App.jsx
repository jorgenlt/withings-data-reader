import Spo2 from './features/dataReader/Spo2'
import { uploadFilesThunk } from './features/dataReader/dataReaderSlice'
import { useDispatch } from 'react-redux'

function App() {
  const dispatch = useDispatch();

  const handleFileUpload = e => {
    // console.log(e.target.files);
    // const files = e.target.files;

    // for (const key in files) {
    //   console.log(files[key]);
    // }
    dispatch(uploadFilesThunk(e.target.files));
  }
  

  return (
    <>
      <Spo2 />
      <input type="file" multiple="multiple" onChange={handleFileUpload} />
    </>
  )
}

export default App;