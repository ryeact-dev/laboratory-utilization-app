export function aggregatedUsageReports(
  subjectReports,
  laboratoryReports,
  currentUser
) {
  let aggregatedReports = subjectReports?.map((subjectReport) => {
    // replace white space with + for url query
    const termSemReplaceWhiteSpace = subjectReport.term_sem.replace(/\s/g, '+');

    return {
      subHeader: 'For Acknowledgement',
      Header: `${subjectReport.code} - ${subjectReport.title}`,
      dateSubmitted: subjectReport.created_at,
      termSem: termSemReplaceWhiteSpace,
      isSubject: true,
    };
  });

  const filteredReports = laboratoryReports?.filter((report) =>
    currentUser.laboratory.includes(report.laboratory)
  );

  if (filteredReports?.length > 0) {
    filteredReports?.forEach((laboratoryReport) => {
      aggregatedReports.push({
        subHeader: 'For Acknowledgement',
        Header: laboratoryReport.laboratory,
        dateSubmitted: laboratoryReport.created_at,
        termSem: laboratoryReport.term_sem,
        isSubject: false,
      });
    });
  }

  aggregatedReports = aggregatedReports?.sort((a, b) => {
    return new Date(b.dateSubmitted) - new Date(a.dateSubmitted);
  });

  return aggregatedReports;
}
