import { useSelector } from 'react-redux'

const Sleep = () => {
  const { navIsOpen } = useSelector(state => state.dataReader);

  return (
    <div 
      className='app-wrapper' style={navIsOpen ? { marginLeft: '320px' } : { marginLeft: '60px' }}
    >
      <h1>Sleep</h1>
    </div>
  )
}

export default Sleep