import { useSelector } from 'react-redux'
import { calculateAge } from '../../common/utils/calculateAge'
import { v4 as uuid } from 'uuid'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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
      <TableContainer component={Paper} style={{ margin: '30px 0px 0px 10px' }}>
        <Table sx={{ minWidth: 0 }} aria-label="simple table">
          <TableBody>
            <TableRow key={uuid()}>
              <TableCell component="th" scope="row">Name</TableCell>
              <TableCell align="left">{firstName} {lastName}</TableCell>
            </TableRow>
            <TableRow key={uuid()}>
              <TableCell component="th" scope="row">Email</TableCell>
              <TableCell align="left">{email}</TableCell>
            </TableRow>
            <TableRow key={uuid()}>
              <TableCell component="th" scope="row">Gender</TableCell>
              <TableCell align="left">{gender}</TableCell>
            </TableRow>
            <TableRow key={uuid()}>
              <TableCell component="th" scope="row">Age</TableCell>
              <TableCell align="left">{age}</TableCell>
            </TableRow>
            <TableRow key={uuid()}>
              <TableCell component="th" scope="row">{weightUnit}</TableCell>
              <TableCell align="left">{userWeight}</TableCell>
            </TableRow>
            <TableRow key={uuid()}>
              <TableCell component="th" scope="row">{heightUnit}</TableCell>
              <TableCell align="left">{userHeight}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default User