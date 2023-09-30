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
        <p>Descriptions...</p>
        <div className="screenshots">
          <div className="screenshot">
            <img src="/instructions1.jpg" width={300} alt="" />
            <figcaption>instructions here...</figcaption>
            <span>1</span>
          </div>
          <div className="screenshot">
            <img src="/instructions2.jpg" width={300} alt="" />
            <figcaption>instructions here...</figcaption>
            <span>2</span>
          </div>
          <div className="screenshot">
            <img src="/instructions3.jpg" width={300} alt="" />
            <figcaption>instructions here...</figcaption>
            <span>3</span>
          </div>
          <div className="screenshot">
            <img src="/instructions4.jpg" width={300} alt="" />
            <figcaption>instructions here...</figcaption>
            <span>4</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions;
