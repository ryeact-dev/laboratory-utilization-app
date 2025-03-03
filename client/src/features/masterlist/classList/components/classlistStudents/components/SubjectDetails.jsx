export default function SubjectDetails({ fetchedSubject }) {
  return fetchedSubject.data.length > 0 ? (
    <section className="flex items-center justify-between rounded-md bg-accent/50 px-4 py-[6px] text-base font-semibold">
      <h2>
        {fetchedSubject.data[0].code} -{" "}
        {fetchedSubject.data[0].title.toUpperCase()}{" "}
      </h2>
      <h2>Instructor: {fetchedSubject.data[0].instructor} </h2>
      <h2>Students: {fetchedSubject.data[0].students.length} / 55</h2>
    </section>
  ) : (
    <p>No Selected Subject</p>
  );
}
