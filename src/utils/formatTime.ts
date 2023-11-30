export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const remainingMilliseconds = milliseconds % 1000;

  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const formattedMilliseconds = ((remainingMilliseconds < 100 ? '0' : '') + (remainingMilliseconds < 10 ? '0' : '') + remainingMilliseconds.toFixed(0)).padEnd(3, '0').slice(0, 2);

  if (minutes < 1) {
    return `${formattedSeconds}.${formattedMilliseconds}`;
  } else {
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
  }
};