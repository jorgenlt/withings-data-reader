import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { navIsOpen } = useSelector(state => state.dataReader);

  const navigate = useNavigate();

  return (
    <div 
    className='app-wrapper home' style={navIsOpen ? { marginLeft: '320px' } : { marginLeft: '60px' }}
    >
      <h1>Withings Data Reader</h1>
      <h2>Upload data from your Withings account and view detailed charts.</h2>
      <p>
        Upload your own data from Withings or choose Load Demo Files to test the application. See <span onClick={() => navigate('/instructions')}>instructions</span> for help.
      </p>
      <p>
        The application is tested with data from Withings Scanwatch.
      </p>
      <p>
        For feedback, requests for new features or to report a bug send an <a href="mailto:contact@jorgenlt.me">email</a>.
      </p>
      <div className='smartwatch'>
        <img src="/smartwatch2.png" alt="" width={300}/>
        <a className='smartwatch--credit' href="https://www.flaticon.com/free-icons/activity-log" title="activity log icons">Activity log icons created by rukanicon - Flaticon</a>
      </div>
    </div>
  )
}

export default Home



