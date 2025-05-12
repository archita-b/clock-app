export function formatTime(ms, showMilliseconds) {
  const milliSecondsInSeconds = 1000;
  const hoursInSeconds = 3600;
  const minutesInSeconds = 60;

  const totalSeconds = Math.floor(ms / milliSecondsInSeconds);

  let hours = Math.floor(totalSeconds / hoursInSeconds);
  let minutes = Math.floor((totalSeconds % hoursInSeconds) / minutesInSeconds);
  let seconds = Math.floor(totalSeconds % minutesInSeconds);
  let milliSeconds = Math.floor(ms % milliSecondsInSeconds);

  hours = String(hours).padStart(2, "0");
  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");
  milliSeconds = String(milliSeconds).padStart(3, "0");

  return showMilliseconds
    ? `${minutes}:${seconds}:${milliSeconds}`
    : `${hours}:${minutes}:${seconds}`;
}
