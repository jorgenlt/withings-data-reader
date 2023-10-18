import { useSelector } from "react-redux";

const Instructions = () => {
  const { navIsOpen } = useSelector((state) => state.dataReader);

  return (
    <div
      className="app-wrapper"
      style={navIsOpen ? { marginLeft: "320px" } : { marginLeft: "60px" }}
    >
      <div className="page-container instructions">
        <h1>Instructions</h1>
        <p>
          Download your data from Withings and upload all of them here using the
          button in the navigation menu.
        </p>
        <p>
          No data is collected or uploaded to a server. All data is stored
          locally in your browser. Source code is available on{" "}
          <a
            href="https://github.com/jorgenlt/withings-data-reader"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
          .
        </p>

        <h2>1. Get your data from Withings</h2>

        <div className="screenshots">
          <div className="screenshot">
            <img src="/instructions1.jpg" width={300} alt="" />
            <figcaption>
              Go to your Profile by selecting the avatar in the top left of your
              screen.
            </figcaption>
            <span>1</span>
          </div>
          <div className="screenshot">
            <img src="/instructions2.jpg" width={300} alt="" />
            <figcaption>
              Go to Settings by selecting the gear icon in the top right of your
              screen.
            </figcaption>
            <span>2</span>
          </div>
          <div className="screenshot">
            <img src="/instructions3.jpg" width={300} alt="" />
            <figcaption>Select &quot;Download your data&quot;.</figcaption>
            <span>3</span>
          </div>
          <div className="screenshot">
            <img src="/instructions4.jpg" width={300} alt="" />
            <figcaption>Select &quot;Start my archive&quot;.</figcaption>
            <span>4</span>
          </div>
        </div>

        <h2>2. Check your email.</h2>

        <h2>
          3. Download the zipped folder from Withings to your computer. Unzip.
        </h2>

        <h2>
          4. Choose Upload in the navigation menu and navigate to the unzipped
          folder.
        </h2>

        <h2>
          5. Select all files (Ctrl + A / Cmd + A). Open/upload all selected
          files.
        </h2>
        <p>The application will only upload the files that are necessary and store the data in your browser. Stored data can be deleted using the button in the navigation menu.</p>

      </div>
    </div>
  );
};

export default Instructions;
