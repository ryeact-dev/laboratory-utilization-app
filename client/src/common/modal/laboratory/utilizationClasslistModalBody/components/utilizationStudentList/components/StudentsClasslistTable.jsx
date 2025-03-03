import Avatar from "@/common/avatar/Avatar";

export default function StudentsClasslistTable({
  paginatedClasslist,
  togglePresentAbsent,
  is2ndTable,
  attendance,
  usageId,
}) {
  let startCount;
  let endCount;
  if (!is2ndTable) {
    startCount = 0;
    endCount = 25;
  } else {
    startCount = 25;
    endCount = 50;
  }

  // RETURN THE STATION NUMBERS USING INDEX
  const studentWorkstationNumber = (index) => {
    if (!is2ndTable) {
      index = index <= 25 ? index++ : 25;
    } else {
      index = index <= 25 ? 25 + index++ : 50;
    }
    return index;
  };

  // Copy paginated students to another const and sort it
  // const studentsList = [...paginatedClasslist?.students].sort((a, b) =>
  //   a.full_name.localeCompare(b.full_name)
  // );

  while (paginatedClasslist?.students.length < 50) {
    paginatedClasslist?.students.push({
      id_number: null,
      full_name: null,
      photo: null,
    });
  }

  // const attendanceIndex = (idNumber) => {
  //   const studentIndex = paginatedClasslist?.students.findIndex(
  //     (student) => student.id_number === idNumber
  //   );
  //   const studentAttendance = attendance[studentIndex];
  //   return { studentIndex, studentAttendance };
  // };

  // RENDER SECTION
  return (
    <table className="w-full rounded-md">
      <thead className="sticky top-0 bg-accent text-left text-sm font-medium text-grey-100">
        <tr>
          <th className="px-2 py-2 md:px-4">PC</th>
          <th className="px-2 py-2 md:pr-4">Student</th>
          <th className="px-2 py-2 md:pr-4">Attendance</th>
        </tr>
      </thead>
      <tbody>
        {paginatedClasslist?.students
          .slice(startCount, endCount)
          .map(({ full_name, photo }, index) => {
            return (
              <tr
                key={index}
                className={`hover:bg-base-200 ${
                  index % 2 === 0 ? "bg-base-200/50" : ""
                } text-left text-sm`}
              >
                <td className="w-8 px-2 py-1 md:shrink-0 md:px-4">
                  {full_name
                    ? index < 9 && !is2ndTable
                      ? `0${studentWorkstationNumber(index + 1)}`
                      : `${studentWorkstationNumber(index + 1)}`
                    : ""}
                </td>
                <td className="flex items-center gap-2 p-2 text-sm capitalize md:pr-4">
                  {photo ? (
                    <Avatar userPhoto={photo} className={"h-8 w-8"} />
                  ) : (
                    ""
                  )}
                  <p className="leading-4">
                    {full_name ? full_name.toLowerCase() : ""}
                  </p>
                </td>
                <td className="px-2 py-1 md:pr-4">
                  {full_name ? (
                    <button
                      type="button"
                      onClick={() =>
                        togglePresentAbsent(
                          usageId,
                          studentWorkstationNumber(index),
                          attendance[studentWorkstationNumber(index)],
                        )
                      }
                      className={`badge badge-sm px-4 text-xs text-white ${
                        attendance[studentWorkstationNumber(index)] === "true"
                          ? "bg-dark-green py-2 hover:bg-dark-green-100"
                          : "bg-secondary py-2 hover:bg-secondary-focus"
                      } `}
                    >
                      {attendance[studentWorkstationNumber(index)] === "true"
                        ? "present"
                        : "absent"}
                    </button>
                  ) : (
                    "\u00a0"
                  )}
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}
