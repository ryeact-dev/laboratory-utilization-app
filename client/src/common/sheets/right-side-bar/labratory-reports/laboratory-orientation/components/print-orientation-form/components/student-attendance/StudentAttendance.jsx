export default function StudentAttendance({
  start,
  end,
  students,
  attendance,
}) {
  const countNumber = (start, index) => {
    if (start >= 25) {
      return index + 25;
    }
    return index;
  };

  const renameStudent = (studentName) => {
    const splitNames = studentName.split(" ");

    if (splitNames.length === 2) {
      return `${splitNames[0]} ${splitNames[1]}.`;
    }

    if (splitNames.length === 3) {
      return `${splitNames[0]} ${splitNames[1]} ${splitNames[2].slice(0, 1)}.`;
    }

    if (splitNames.length >= 4) {
      return `${splitNames[0]} ${splitNames[1]} ${splitNames[2]} ${splitNames[3].slice(0, 1)}.`;
    }
  };

  return students?.slice(start, end).map(({ id_number, full_name }, index) => (
    <div key={index} className="mt-1">
      <div className="flex w-full items-center gap-2">
        <div className="flex h-[20px] w-full flex-[2] items-center gap-2">
          <p className="text-[12px]">{countNumber(start, index + 1)}</p>
          <div className="w-full">
            <p className="text-[12px] uppercase leading-[10px]">
              {id_number ? renameStudent(full_name) : "\u00a0\u00a0"}
            </p>
            <p className="mt-0.5 w-full border-b border-black"></p>
          </div>
        </div>
        <div
          className={`-mt-1 flex h-[20px] flex-1 flex-col items-center justify-center pl-3`}
        >
          {id_number ? (
            <p className={`text-xs`}>
              {attendance[countNumber(start, index)] === "true" ? (
                <img
                  src={
                    import.meta.env.VITE_LOCAL_BASE_URL +
                    `uploads/img/esign/${id_number}.webp`
                  }
                  className="h-5 w-full object-fill object-center px-2 py-1"
                />
              ) : (
                "Absent"
              )}
            </p>
          ) : (
            <p className="h-5">{"\u00a0\u00a0"}</p>
          )}
          <p className="w-full border-b border-black"></p>
        </div>
      </div>
    </div>
  ));
}
