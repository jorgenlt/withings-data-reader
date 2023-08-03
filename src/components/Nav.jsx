import { useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  updateFilterDate, 
  deleteStoredData, 
  uploadFilesThunk 
} from "../features/dataReader/dataReaderSlice";
import { CSSTransition } from 'react-transition-group'
import { 
  HiChevronDoubleLeft, 
  HiOutlineBars3,
} from "react-icons/hi2";
import DatePicker from "react-datepicker"
// import "react-datepicker/dist/react-datepicker.css"

const Nav = props => {
  const { filterDate } = useSelector(state => state.dataReader);

  const dispatch = useDispatch();

  const handleDateChange = date => {
    dispatch(updateFilterDate(new Date(date)))
  };

  const handleFileUpload = e => {
    dispatch(uploadFilesThunk(e.target.files));
  }

  const handleDeleteData = () => {
    if (confirm("Are you sure you want to delete all data?") == true) {
      dispatch(deleteStoredData());
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }

  const nodeRef = useRef(null);

  return (
    <>
      <div 
        className="nav--open"
        onClick={props.toggleNav}
      >
        <HiOutlineBars3 />
      </div>
        {/* open menu */}
        <CSSTransition
          in={props.navIsOpen}
          nodeRef={nodeRef}
          timeout={200}
          classNames={'nav--transition'}
          unmountOnExit
        >
          <div
            className='nav'
            ref={nodeRef}
          >
            {/* close menu */}
            <div 
              className="nav--close" 
              onClick={props.toggleNav}
            >
              <HiChevronDoubleLeft />
            </div>
            {/* menu content */}
            <div className='nav--content'>
              <DatePicker
                dateFormat={'MMM d yyyy'}
                todayButton="Today"
                showPopperArrow={false}
                showIcon
                selected={filterDate}
                onChange={handleDateChange} 
                placeholderText="Choose date"
              />
              <input 
                type="file" 
                multiple="multiple" 
                onChange={handleFileUpload} 
                
              />
              <div>
                <button onClick={handleDeleteData}>Delete all data</button>
              </div>
              <ul>
                <li>nav content</li>
              </ul>
            </div>
          </div>
        </CSSTransition>
    </>
  )
}

export default Nav