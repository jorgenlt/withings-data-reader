import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  updateFilterDate,
  deleteStoredData,
  uploadFilesThunk,
  toggleNavIsOpen,
  setDemoFiles,
} from "../features/dataReader/dataReaderSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSSTransition } from "react-transition-group";
import {
  HiChevronLeft,
  HiChevronRight,
  HiArrowUpTray,
  HiHeart,
  HiCalendarDays,
  HiTrash,
  HiUser,
  HiDocumentChartBar,
  HiHome,
} from "react-icons/hi2";
import { SiOxygen } from "react-icons/si";
import { GiNightSleep } from "react-icons/gi";
import { FaInfo, FaWeight, FaGithub } from "react-icons/fa";

const Nav = () => {
  const [dateIsOpen, setDateIsOpen] = useState(false);

  const { filterDate, navIsOpen } = useSelector((state) => state.dataReader);

  // Initializing hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSetDate = () => {
    if (!dateIsOpen) {
      setDateIsOpen(true);
    }
  };

  const handleDateChange = (date) => {
    dispatch(updateFilterDate(new Date(date).getTime()));
    setDateIsOpen(false);
  };

  const handleFileUpload = (e) => {
    dispatch(uploadFilesThunk(e.target.files));
    navigate("/user");
  };

  const handleDeleteData = () => {
    if (confirm("Are you sure you want to delete all data?") == true) {
      dispatch(deleteStoredData());
      setTimeout(() => {
        alert("All data deleted.")
        navigate("/");
        window.location.reload();
      }, 500);
    }
  };

  const handleDemoFiles = () => {
    dispatch(setDemoFiles());
    alert("Demo files loaded.");
    navigate("/user");
  };

  // Initialize ref for CSSTransition
  const nodeRef = useRef(null);

  return (
    <>
      {/* Open navigation */}
      {!navIsOpen && (
        <div
          className="nav--open fade-in"
          onClick={() => dispatch(toggleNavIsOpen())}
        >
          <HiChevronRight />
        </div>
      )}
      <CSSTransition
        in={navIsOpen}
        nodeRef={nodeRef}
        timeout={200}
        classNames={"nav--transition"}
        unmountOnExit
      >
        <div className="nav" ref={nodeRef}>
          {/* Close navigation */}
          <div
            className="nav--close fade-in"
            onClick={() => dispatch(toggleNavIsOpen())}
          >
            <HiChevronLeft />
          </div>
          {/* Navigation content */}
          <div className="nav--content">
            <ul>
              <li
                className={`nav--element ${
                  location.pathname === "/" ? "nav--element-chosen" : ""
                }`}
                onClick={() => navigate("/")}
              >
                <span className="nav--icon">
                  <HiHome />
                </span>
                <span className="nav--icon-text">Home</span>
              </li>
              <li className="nav--element" onClick={handleSetDate}>
                <span className="nav--icon">
                  <HiCalendarDays />
                </span>
                <span className="nav--icon-text">Set Date</span>
                {dateIsOpen && (
                  <div className="nav--datepicker">
                    <DatePicker
                      inline
                      todayButton="Today"
                      showPopperArrow={true}
                      selected={filterDate}
                      onChange={handleDateChange}
                    />
                  </div>
                )}
              </li>
              <li className="nav--element">
                <input
                  type="file"
                  multiple="multiple"
                  onChange={handleFileUpload}
                />
                <span className="nav--icon">
                  <HiArrowUpTray />
                </span>
                <span className="nav--icon-text">Upload Files</span>
              </li>
              <li
                className={`nav--element ${
                  location.pathname === "/user" ? "nav--element-chosen" : ""
                }`}
                onClick={() => navigate("/user")}
              >
                <span className="nav--icon">
                  <HiUser />
                </span>
                <span className="nav--icon-text">User Information</span>
              </li>
              <li
                className={`nav--element ${
                  location.pathname === "/spo2" ? "nav--element-chosen" : ""
                }`}
                onClick={() => navigate("/spo2")}
              >
                <span className="nav--icon">
                  <SiOxygen />
                </span>
                <span className="nav--icon-text">Blood Oxygen Saturation</span>
              </li>
              <li
                className={`nav--element ${
                  location.pathname === "/heartrate"
                    ? "nav--element-chosen"
                    : ""
                }`}
                onClick={() => navigate("/heartrate")}
              >
                <span className="nav--icon">
                  <HiHeart />
                </span>
                <span className="nav--icon-text">Heart Rate</span>
              </li>
              <li
                className={`nav--element ${
                  location.pathname === "/sleep" ? "nav--element-chosen" : ""
                }`}
                onClick={() => navigate("/sleep")}
              >
                <span className="nav--icon">
                  <GiNightSleep />
                </span>
                <span className="nav--icon-text">Sleep</span>
              </li>
              <li
                className={`nav--element ${
                  location.pathname === "/weight" ? "nav--element-chosen" : ""
                }`}
                onClick={() => navigate("/weight")}
              >
                <span className="nav--icon">
                  <FaWeight />
                </span>
                <span className="nav--icon-text">Weight</span>
              </li>
              <li
                className={`nav--element ${
                  location.pathname === "/instructions"
                    ? "nav--element-chosen"
                    : ""
                }`}
                onClick={() => navigate("/instructions")}
              >
                <span className="nav--icon">
                  <FaInfo />
                </span>
                <span className="nav--icon-text">Instructions</span>
              </li>
              <li className="nav--element" onClick={handleDemoFiles}>
                <span className="nav--icon">
                  <HiDocumentChartBar />
                </span>
                <span className="nav--icon-text">Load Demo Files</span>
              </li>
              <li className="nav--element" onClick={handleDeleteData}>
                <span className="nav--icon">
                  <HiTrash />
                </span>
                <span className="nav--icon-text">Delete Data</span>
              </li>
            </ul>
          </div>
          <a
            href="https://github.com/jorgenlt/withings-data-reader"
            target="_blank"
            rel="noreferrer"
            className="github"
          >
            <FaGithub />
          </a>
        </div>
      </CSSTransition>
    </>
  );
};

export default Nav;
