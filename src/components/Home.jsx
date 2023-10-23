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
        <p>
          The application is tested with data from Withings Scanwatch. For
          feedback, requests, or to report a bug send an{" "}
          <a href="mailto:contact@jorgenlt.no">email</a>.
        </p>
        <p>
          This application was developed for personal reasons to get a more
          detailed view on the data collected by the{" "}
          <a
            href="https://www.withings.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Withings
          </a>{" "}
          Scanwatch. You are welcome to contribute to the project on{" "}
          <a
            href="https://github.com/jorgenlt/withings-data-reader"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>{" "}
          by sending a pull request.
        </p>
        <div className="scanwatch-face">
          <img src="scanwatch-face.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
