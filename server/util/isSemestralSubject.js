function isSemestralSubject(selectedTermAndSem) {
  const firstSem = ['1st Term - 1st Sem', '2nd Term - 1st Sem'];
  const secondSem = ['1st Term - 2nd Sem', '2nd Term - 2nd Sem'];
  let semester = ['Summer'];

  if (firstSem.includes(selectedTermAndSem)) {
    semester = firstSem;
  }
  if (secondSem.includes(selectedTermAndSem)) {
    semester = secondSem;
  }

  return semester;
}

// Function to aggregate schedules by subject and title
function aggregateSemestralSubjects(schedules, termsem) {
  const aggregated = {};

  schedules.forEach((schedule) => {
    const { code, title, term_sem } = schedule;

    // Initialize the key for aggregation
    const key = `${code}-${title.toLowerCase()}`.trim();

    if (!aggregated[key]) {
      aggregated[key] = {
        ...schedule,

        isSemestral: false,
        termsem: [],
      };
    }

    // Add unique termsem to the aggregated data
    if (!aggregated[key].termsem.includes(term_sem)) {
      aggregated[key].termsem.push(term_sem);
    }

    if (aggregated[key].termsem.length === 2) {
      aggregated[key].isSemestral = true;
    }
  });

  // Filter out entries that are not semestral
  return Object.values(aggregated).filter((item) => item.isSemestral);
}

exports.isSemestralSubject = isSemestralSubject;
exports.aggregateSemestralSubjects = aggregateSemestralSubjects;
