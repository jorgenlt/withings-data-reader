import { useSelector } from 'react-redux'
import { calculateAge } from '../../common/utils/calculateAge'
import { v4 as uuid } from 'uuid'

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
      <h1>User Information</h1>
      {
        user &&
        <div className='user-table'>
          <table>
            <tbody>
              <tr key={uuid()}>
                <td>Name:</td>
                <td align="left">{firstName} {lastName}</td>
              </tr>
              <tr key={uuid()}>
                <td>Email:</td>
                <td align="left">{email}</td>
              </tr>
              <tr key={uuid()}>
                <td>Gender:</td>
                <td align="left">{gender}</td>
              </tr>
              <tr key={uuid()}>
                <td>Age:</td>
                <td align="left">{age}</td>
              </tr>
              <tr key={uuid()}>
                <td>{weightUnit}:</td>
                <td align="left">{userWeight}</td>
              </tr>
              <tr key={uuid()}>
                <td>{heightUnit}:</td>
                <td align="left">{userHeight}</td>
              </tr>
            </tbody>
          </table>
        </div>
      }
    </div>
  )
}

export default User