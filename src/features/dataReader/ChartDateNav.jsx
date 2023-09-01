import { useSelector, useDispatch } from "react-redux";
import { unixToDate } from "../../common/utils/dateFormat";
import { addDays } from "date-fns";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { updateFilterDate } from "./dataReaderSlice";

const ChartDateNav = () => {
  // Get data from Redux
  const { filterDate } = useSelector((state) => state.dataReader);

  // Initializing hooks
  const dispatch = useDispatch();

  // Navigate date
  const handleNavigateDate = (direction) => {
    if (direction === "prev") {
      const prevDate = addDays(new Date(filterDate), -1);
      dispatch(updateFilterDate(prevDate.getTime()));
    } else {
      const nextDate = addDays(new Date(filterDate), 1);
      dispatch(updateFilterDate(nextDate.getTime()));
    }
  };

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
