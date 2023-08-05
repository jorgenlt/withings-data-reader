import { useSelector } from 'react-redux'
import { calculateAge } from '../../common/utils/calculateAge'

const User = () => {
  const { navIsOpen } = useSelector(state => state.dataReader);
  const { 
    user, 
    weight, 
    height,
    account
  } = useSelector(state => state.dataReader.files);

  const userData = {
    firstName: user?.[1]?.[0],
    lastName: user?.[1]?.[1],
    gender: user?.[1]?.[3],
    age: calculateAge(new Date(user?.[1]?.[2] * 1000)),
    userWeight: weight?.[weight.length - 1]?.[1],
    weightUnit: weight?.[0]?.[1],
    userHeight: height?.[1]?.[1],
    heightUnit: height?.[0]?.[1],
    email: account?.[1][0]
  }

  const {
    firstName,
    lastName,
    gender,
    age,
    userWeight,
    weightUnit,
    userHeight,
    heightUnit,
    email
  } = userData

  return (
    <div 
      className='app-wrapper' style={navIsOpen ? { marginLeft: '320px' } : { marginLeft: '60px' }}
    >
      <p>Name: {firstName} {lastName}</p>
      <p>Gender: {gender}</p>
      <p>Age: {age}</p>
      <p>{weightUnit}: {userWeight}</p>
      <p>{heightUnit}: {userHeight}</p>
      <p>Email: {email}</p>
    </div>
  )
}

export default User