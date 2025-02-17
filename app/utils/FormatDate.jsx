import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const FormatDate = (dataISO) => {
    return dayjs.utc(dataISO).format("DD/MM/YYYY");
};

export default FormatDate;
