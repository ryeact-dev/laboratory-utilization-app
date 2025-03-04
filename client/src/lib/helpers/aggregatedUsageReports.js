export function aggregatedUsageReports(subjectReports) {
  let aggregatedReports = subjectReports?.map((subjectReport) => {
    // replace white space with + for url query
    const termSemReplaceWhiteSpace = subjectReport.term_sem.replace(/\s/g, "+");

    return {
      subHeader: "For Acknowledgement",
      Header: `${subjectReport.code} - ${subjectReport.title}`,
      dateSubmitted: subjectReport.created_at,
      termSem: termSemReplaceWhiteSpace,
      isSubject: true,
    };
  });

  aggregatedReports = aggregatedReports?.sort((a, b) => {
    return new Date(b.dateSubmitted) - new Date(a.dateSubmitted);
  });

  return aggregatedReports;
}
