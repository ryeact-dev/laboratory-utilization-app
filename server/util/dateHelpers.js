function monthDiff(dateString1, dateString2) {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  let months;
  months = (date2.getFullYear() - date1.getFullYear()) * 12;
  months -= date1.getMonth();
  months += date2.getMonth();

  return months <= 0 ? 0 : months;
}

function dateToTime(date) {
  const convertedTime = new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return convertedTime;
}

exports.monthDiff = monthDiff;
exports.dateToTime = dateToTime;
