export const aggregatedWeeklyMonitoring = (listOfMonitoring, weekdates) => {
  return weekdates.map((date) => {
    const dateStr = new Date(date).toDateString();
    const sameDateItems = listOfMonitoring.filter(
      (item) => new Date(item.usage_date).toDateString() === dateStr,
    );

    const { networkItems, otherItems, subjectWithProblems } =
      sameDateItems.reduce(
        (acc, item) => {
          item.details.forEach((detail) => {
            if (detail.remark === "Internet Speed") {
              acc.networkItems.push(detail);
            } else if (detail.remark !== "No problems found") {
              acc.subjectWithProblems.add(`${item.code} - ${item.title}`);
              acc.otherItems.add(JSON.stringify(detail));
            }
          });
          return acc;
        },
        {
          networkItems: [],
          otherItems: new Set(),
          subjectWithProblems: new Set(),
        },
      );

    const networkAverage = networkItems.length
      ? networkItems.reduce(
          (total, item) => total + Number(item.problem.match(/\d+/g)),
          0,
        ) / networkItems.length
      : 0;

    return {
      subjectWithProblems: Array.from(subjectWithProblems),
      usage_date: date,
      network_average: networkAverage.toFixed(0),
      other_remarks: Array.from(otherItems).map((item) => JSON.parse(item)),
    };
  });
};
