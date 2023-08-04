import { useSelector } from 'react-redux'
import Spo2 from './features/dataReader/Spo2'
import HeartRate from './features/dataReader/HeartRate'
import Nav from './components/Nav'
import Home from './components/Home'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
    <Router>
      <>
        <Nav 
          toggleNav={toggleNav}
          navIsOpen={navIsOpen}
        />
        <Routes>
            <Route 
              path="/" 
              element={
                <div 
                  className='app-wrapper' style={navIsOpen ? { marginLeft: '320px' } : { marginLeft: '60px' }}
                >
                  <Home />
                </div>
              } 
            />
            <Route 
              path="/spo2" 
              element={
                <div 
                  className='app-wrapper' style={navIsOpen ? { marginLeft: '320px' } : { marginLeft: '60px' }}
                >
                  <Spo2 />
                </div>
              } 
            />
            <Route 
              path="/heartrate" 
              element={
                <div 
                  className='app-wrapper' style={navIsOpen ? { marginLeft: '320px' } : { marginLeft: '60px' }}
                >
                  <HeartRate />
                </div>
              } 
            />
        </Routes>
      </>
  </Router>
  )
}

export default App;