import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDemoFiles } from "../features/dataReader/dataReaderSlice";

const Home = () => {
  const { navIsOpen } = useSelector((state) => state.dataReader);

  // Initializing hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDemoFiles = () => {
    dispatch(setDemoFiles());
    alert("Demo files loaded.");
    navigate("/user");
  };

  return (
    <div
      className="app-wrapper"
      style={navIsOpen ? { marginLeft: "320px" } : { marginLeft: "60px" }}
    >
      <div className="page-container home">
        <h1>Withings Data Reader</h1>
        <h2>
          Upload data from your Withings account and view detailed charts.
        </h2>
        <p>
          Upload your own data from Withings or choose{" "}
          <span onClick={handleDemoFiles}>Load Demo Files</span> to test the
          application. See{" "}
          <span onClick={() => navigate("/instructions")}>instructions</span>{" "}
          for help.
        </p>
        <p>The application is tested with data from Withings Scanwatch.</p>
        <p>
          For feedback, requests, or to report a bug send an{" "}
          <a href="mailto:contact@jorgenlt.no">email</a>.
        </p>
        {/* <div className="smartwatch">
          <img src="/smartwatch2.png" alt="" width={300} />
          <a
            className="smartwatch--credit"
            href="https://www.flaticon.com/free-icons/activity-log"
            title="activity log icons"
          >
            Activity log icons created by rukanicon - Flaticon
          </a>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
