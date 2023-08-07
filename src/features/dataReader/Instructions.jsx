import { useSelector } from 'react-redux'

const Instructions = () => {
  const { navIsOpen } = useSelector(state => state.dataReader);

  return (
    <div 
      className='app-wrapper' style={navIsOpen ? { marginLeft: '320px' } : { marginLeft: '60px' }}
    >
      <h1>Instructions</h1>
    </div>
  )
}

export default Instructions