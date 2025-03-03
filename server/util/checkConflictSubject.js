const pool = require('../config/db.config');

async function checkConflictSubject(
  id,
  term_sem,
  school_year,
  update_schedule,
  updated_start_time,
  updated_end_time,
  next
) {
  try {
    const subjectQuery = `
        SELECT 
            s.*, sc.sched_start_time, sched_end_time, sc.laboratory AS laboratory 
        FROM 
            subjects AS s
        INNER JOIN
            schedules As sc ON s.id = sc.subject_id
        WHERE
            s.id = $1
        AND
            sc.is_regular_class = TRUE         
        `;

    const laboratoryQuery = `
        SELECT 
           sc.class_schedule, s.id, s.start_time, s.end_time, s.title, s.code
        FROM 
           schedules AS sc
        INNER JOIN
           subjects AS s ON sc.subject_id = s.id
        WHERE
           sc.laboratory = $1
        AND 
           sc.term_sem = $2
        AND 
           s.school_year = $3
        `;

    const subject = await pool.query(subjectQuery, [id]);

    if (subject.rows.length === 0)
      return { isConflict: false, noSchedule: true };

    const laboratorySubjects = await pool.query(laboratoryQuery, [
      subject.rows[0].laboratory,
      term_sem,
      school_year,
    ]);

    // Checking Conflicting Time in the selected Subject Laboratory
    const selectedSubject = subject.rows[0];
    const listOfLaboratorySubjects = laboratorySubjects.rows;

    let updatedStartTime = new Date(`2023-10-10T${updated_start_time}`);
    let updatedEndTime = new Date(`2023-10-10T${updated_end_time}`);

    if (updated_start_time === '23:00:00.000Z') {
      updatedStartTime = new Date(`2023-10-09T${updated_start_time}`);
    }

    let conflictingSchedules = listOfLaboratorySubjects.filter(
      (otherSchedule) => {
        if (id !== otherSchedule.id) {
          // console.log(update_schedule, otherSchedule.class_schedule);

          let otherSubjectStartime = new Date(
            `2023-10-10T${otherSchedule.start_time}`
          );
          let otherSubjectEndTime = new Date(
            `2023-10-10T${otherSchedule.end_time}`
          );

          if (otherSchedule.start_time === '23:00:00.000Z') {
            otherSubjectStartime = new Date(
              `2023-10-09T${otherSchedule.start_time}`
            );
          }

          if (
            updated_start_time === otherSchedule.start_time ||
            updated_end_time === otherSchedule.end_time
          ) {
            return true;
          }

          if (
            otherSubjectStartime < updatedStartTime &&
            otherSubjectEndTime > updatedStartTime
          ) {
            return true;
          }

          if (
            otherSubjectStartime < updatedEndTime &&
            otherSubjectEndTime > updatedEndTime
          ) {
            return true;
          }
        }
        return false;
      }
    );

    // console.log(conflictingSchedules);

    const plottedScheduleStartTimeDate =
      selectedSubject.sched_start_time.split('T')[0];
    const plottedScheduleEndTimeDate =
      selectedSubject.sched_end_time.split('T')[0];

    const updatedSchedStartTime = `${plottedScheduleStartTimeDate}T${updated_start_time}`;
    const updatedSchedEndTime = `${plottedScheduleEndTimeDate}T${updated_end_time}`;

    if (conflictingSchedules.length > 0) {
      const conflictIndex = conflictingSchedules.findIndex(
        (schedule) => schedule.id === id
      );

      if (conflictIndex < 0) {
        return { isConflict: true }; // return true if there is a conflict
      } else {
        return {
          isConflict: false,
          updatedSchedStartTime,
          updatedSchedEndTime,
        }; // return false if there is no conflict
      }
    } else {
      return { isConflict: false, updatedSchedStartTime, updatedSchedEndTime }; // return false if there is no conflict
    }
  } catch (err) {
    err.title = 'Checking Conflicting Subject';
    next(err);
  }
}

function getHoursBetween(timestamp1, timestamp2) {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  // If date2 is before date1, add 24 hours to date2
  if (date2.getTime() < date1.getTime()) {
    date2.setHours(date2.getHours() + 24);
  }

  const diffInMilliseconds = date2.getTime() - date1.getTime();

  // Convert the difference from milliseconds to hours and floor the minutes accordingly
  const hours = Math.floor(diffInMilliseconds / 1000 / 60 / 60);

  // Calculate the remaining minutes and floor the minutes accordingly
  const minutes = Math.floor((diffInMilliseconds / 1000 / 60) % 60);

  // Check the minutes and round the hours accordingly
  if (minutes < 15) {
    return hours;
  } else if (minutes >= 15 && minutes < 45) {
    return hours + 0.5;
  } else if (minutes >= 45) {
    return hours + 1;
  }
}

exports.checkConflictSubject = checkConflictSubject;
