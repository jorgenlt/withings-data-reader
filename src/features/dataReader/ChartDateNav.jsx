import { useSelector, useDispatch } from "react-redux";
import { useEffect, useCallback, useState } from "react";
import { unixToDate } from "../../common/utils/dateFormat";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { updateFilterDate } from "./dataReaderSlice";

const ChartDateNav = () => {
  // Get data from Redux
  const { filterDate } = useSelector((state) => state.dataReader);

  // Initialize date
  const [date, setDate] = useState(new Date(filterDate));

  // Initializing hooks
  const dispatch = useDispatch();

  // Navigate date
  const handleNavigateDate = useCallback(
    (direction) => {
      if (direction === "prev") {
        date.setDate(date.getDate() - 1);
      } else {
        date.setDate(date.getDate() + 1);
      }
      dispatch(updateFilterDate(date.getTime()));
    },
    [date, dispatch]
  );

  // Update date when filterDate changes
  useEffect(() => {
    setDate(new Date(filterDate));
  }, [filterDate]);

  // Navigate with arrow left and arrow right
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowLeft":
          handleNavigateDate("prev");
          break;
        case "ArrowRight":
          handleNavigateDate("next");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNavigateDate]);

  return (
    <div className="chart--date">
      <div
        className="chart--date-icon"
        onClick={() => handleNavigateDate("prev")}
      >
        <FaAngleLeft />
      </div>
      <div
        className="chart--date-icon"
        onClick={() => handleNavigateDate("next")}
      >
        <FaAngleRight />
      </div>
      <h3>{unixToDate(filterDate)}</h3>
    </div>
  );
};

export default ChartDateNav;
