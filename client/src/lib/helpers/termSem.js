export function extractTermSem(termSem) {
  if (termSem === "Summer") return { term: "Summer", sem: "" };

  const term = termSem.split(" - ")[0];
  const sem = termSem.split(" - ")[1];

  return { term, sem };
}

export function getSemester(termSem) {
  if (termSem === "Summer") return "Summer";

  const { sem } = extractTermSem(termSem);

  // if(sem=='1st Sem')

  return sem;
}
