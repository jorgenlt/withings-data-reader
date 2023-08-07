import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { 
  updateFilterDate, 
  deleteStoredData, 
  uploadFilesThunk,
  toggleNavIsOpen 
} from "../features/dataReader/dataReaderSlice"
import { CSSTransition } from 'react-transition-group'
import { 
  HiChevronLeft,
  HiChevronRight,
  HiArrowUpTray,
  HiHeart,
  HiCalendarDays,
  HiTrash,
  HiUser
} from "react-icons/hi2"
import { SiOxygen } from "react-icons/si"
import { GiNightSleep } from "react-icons/gi"
import { 
  FaInfo, 
  FaWeight,
  FaGithub 
} from "react-icons/fa"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import { useNavigate } from 'react-router-dom';

const Nav = () => {
  const [dateIsOpen, setDateIsOpen] = useState(false);

  const { filterDate, navIsOpen } = useSelector(state => state.dataReader);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSetDate = () => {
    if (!dateIsOpen) {
      setDateIsOpen(true);
    } 
  }

  const handleDateChange = date => {
    dispatch(updateFilterDate(new Date(date)));
    setDateIsOpen(false);
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
      {/* open menu */}
      { !navIsOpen &&
        <div 
          className="nav--open fade-in"
          onClick={() => dispatch(toggleNavIsOpen())}
        >
          <HiChevronRight />
        </div>
      }
        <CSSTransition
          in={navIsOpen}
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
              className="nav--close fade-in" 
              onClick={() => dispatch(toggleNavIsOpen())}
            >
              <HiChevronLeft />
            </div>
            {/* menu content */}
            <div className='nav--content'>
              <ul>
                <li className='nav--element' onClick={handleSetDate}>
                  <span className='nav--icon'><HiCalendarDays /></span>
                  <span className='nav--icon-text'>Set date</span>
                  {
                    dateIsOpen &&
                    <div className='nav--datepicker'>
                      <DatePicker
                        inline
                        todayButton="Today"
                        showPopperArrow={true}
                        selected={filterDate}
                        onChange={handleDateChange} 
                      />
                    </div>
                  }
                </li>
                <li className='nav--element'>
                  <input 
                    type="file" 
                    multiple="multiple" 
                    onChange={handleFileUpload} 
                  />
                  <span className='nav--icon'><HiArrowUpTray /></span>
                  <span className='nav--icon-text'>Upload files</span>
                </li>
                <li className={`nav--element ${location.pathname === '/user' ? 'nav--element-chosen' : ''}`} onClick={() => navigate('/user')}>
                  <span className='nav--icon'><HiUser /></span>
                  <span className='nav--icon-text'>User information</span>
                </li>
                <li className={`nav--element ${location.pathname === '/spo2' ? 'nav--element-chosen' : ''}`} onClick={() => navigate('/spo2')}>
                  <span className='nav--icon'><SiOxygen /></span>
                  <span className='nav--icon-text'>Blood Oxygen Saturation</span>
                </li>
                <li className={`nav--element ${location.pathname === '/heartrate' ? 'nav--element-chosen' : ''}`} onClick={() => navigate('/heartrate')}>
                  <span className='nav--icon'><HiHeart /></span>
                  <span className='nav--icon-text'>Heart Rate</span>
                </li>
                <li className={`nav--element ${location.pathname === '/sleep' ? 'nav--element-chosen' : ''}`}>
                  <span className='nav--icon'><GiNightSleep /></span>
                  <span className='nav--icon-text'>Sleep</span>
                </li>
                <li className={`nav--element ${location.pathname === '/weight' ? 'nav--element-chosen' : ''}`} onClick={() => navigate('/weight')}>
                  <span className='nav--icon'><FaWeight /></span>
                  <span className='nav--icon-text'>Weight</span>
                </li>
                <li className={`nav--element ${location.pathname === '/instructions' ? 'nav--element-chosen' : ''}`}>
                  <span className='nav--icon'><FaInfo /></span>
                  <span className='nav--icon-text'>Instructions</span>
                </li>
                <li className='nav--element' onClick={handleDeleteData}>
                  <span className='nav--icon'><HiTrash /></span>
                  <span className='nav--icon-text'>Delete data</span>
                </li>
              </ul>
            </div>
            <a href='https://github.com/jorgenlt/withings-data-reader' target='_blank' rel="noreferrer" className='github'>
             <FaGithub />
            </a>
          </div>
        </CSSTransition>
    </>
  )
}

export default Nav