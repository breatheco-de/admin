import dayjs from "dayjs";
const duration = require("dayjs/plugin/duration");
const localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(duration);
dayjs.extend(localizedFormat)

export const calcMeetingDuration = (start, end) => {
    if (typeof start !== 'string' || typeof end !== 'string') {
        return "Invalid dates."
    }
    const date1 = dayjs(start);
    const date2 = dayjs(end);
    let hours = dayjs.duration(date2.diff(date1)).hours()
    let minutes = dayjs.duration(date2.diff(date1)).minutes()
    let seconds = dayjs.duration(date2.diff(date1)).seconds()
    let output = `${hours} hour(s), ${minutes} min(s), ${seconds} sec(s)`
    return output
}
export default calcMeetingDuration