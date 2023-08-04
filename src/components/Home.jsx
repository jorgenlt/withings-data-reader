import { useSelector } from 'react-redux'

const Home = () => {
  const { navIsOpen } = useSelector(state => state.dataReader);

  return (
    <div 
    className='app-wrapper' style={navIsOpen ? { marginLeft: '320px' } : { marginLeft: '60px' }}
    >
      <div>Home</div>
    </div>
  )
}

export default Home



