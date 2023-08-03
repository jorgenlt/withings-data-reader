import { useSelector } from 'react-redux'
import Spo2 from './features/dataReader/Spo2'
import HeartRate from './features/dataReader/HeartRate'
import Nav from './components/Nav'
import { useState } from 'react'

function App() {
  const { user } = useSelector(state => state.dataReader.files);
  const [navIsOpen, setNavIsOpen] = useState(true);

  let firstName;
  let lastName;
  if (user) {
    firstName = user[1][0];
    lastName = user[1][1];
  }

  const toggleNav = () => {
    setNavIsOpen(prev => !prev);
  }

  return (
    <>
      <Nav 
        toggleNav={toggleNav}
        navIsOpen={navIsOpen}
      />
      <div 
        className='app-wrapper' style={navIsOpen ? { marginLeft: '320px' } : { marginLeft: '60px' }}
      >
        <h1>User: {firstName} {lastName}</h1>
        <Spo2 />
        <HeartRate />
      </div>
    </>
  )
}

export default App;