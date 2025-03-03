export const aggregateWeeklyAttendance = (listOfUsage) => {
  return listOfUsage.reduce((acc, curr) => {
    const foundIndex = acc.findIndex(
      (item) => item.students_uuid === curr.students_uuid,
    );

    if (foundIndex !== -1) {
      acc[foundIndex].usage_details.push({
        id: curr.id,
        date: curr.usage_date,
        students_attendance: curr.students_attendance,
        students_time_log: curr.students_time_log,
        start_time: curr.start_time,
      });
    } else {
      acc.push({
        usage_details: [
          {
            id: curr.id,
            date: curr.usage_date,
            students_attendance: curr.students_attendance,
            students_time_log: curr.students_time_log,
            start_time: curr.start_time,
          },
        ],
      });
    }

    return acc;
  }, []);
};
