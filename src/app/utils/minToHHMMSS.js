export const minToHHMMSS = (minutes) => {
    let m = minutes % 60;
    let h = (minutes - m) / 60;
    let HHMMSS = (h < 10 ? "0" : "") + h.toString() + ":" + (m < 10 ? "0" : "") + m.toString() + ":00";
    return HHMMSS
};
export default minToHHMMSS;