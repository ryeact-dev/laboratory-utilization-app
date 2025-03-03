function dateConverter(dateString) {
  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  };

  const date = dateString ? new Date(dateString) : new Date();

  const dateTimeFormat = new Intl.DateTimeFormat('en-us', dateOptions);
  const dateToday = dateTimeFormat.format(date);

  return dateToday;
}

exports.dateConverter = dateConverter;
