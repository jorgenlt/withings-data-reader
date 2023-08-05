import { useSelector } from 'react-redux'
const Weight = () => {
  const { navIsOpen } = useSelector(state => state.dataReader);

  return (
    <div 
      className='app-wrapper' style={navIsOpen ? { marginLeft: '320px' } : { marginLeft: '60px' }}
    >
      Weight
    </div>
  )
}

export default Weight