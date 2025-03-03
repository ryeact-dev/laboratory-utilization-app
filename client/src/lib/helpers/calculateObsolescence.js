import { addDays, addMonths, addYears } from "date-fns";

export function getDateObsolescence(dateAcquired, upgrades) {
  const dateString = new Date(dateAcquired);

  // If there are upgrades, use the latest one (assuming upgrades are pre-sorted by date)
  if (upgrades?.length > 0) {
    return addYears(addDays(new Date(upgrades[0].date_upgraded), 1), 3);
  }

  return addYears(addDays(dateString, 1), 3);
}

export function approachingObsolesence(listOfSystemUnits, syEndingDateString) {
  // Calculate dates once, outside the loop
  const syEndingDate = new Date(syEndingDateString);
  const nextSYStartingDate = addDays(syEndingDate, 1);
  const nextSYEndingDate = addMonths(syEndingDate, 13);

  // Combine map and filter into a single reduce operation
  return listOfSystemUnits
    ?.reduce((acc, systemUnit) => {
      const obsolesenceDate = getDateObsolescence(
        systemUnit.date_acquired,
        systemUnit.hardware_upgrades,
      );

      if (
        obsolesenceDate >= nextSYStartingDate &&
        obsolesenceDate <= nextSYEndingDate
      ) {
        acc.push({
          ...systemUnit,
          obsolesenceDate,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => a.obsolesenceDate - b.obsolesenceDate); // Date objects can be compared directly
}

export function forUpgrading(listOfSystemUnits) {
  // Calculate current date once
  const currentDate = new Date();

  // Combine map and filter into a single reduce operation
  return listOfSystemUnits
    ?.reduce((acc, systemUnit) => {
      const obsolesenceDate = getDateObsolescence(
        systemUnit.date_acquired,
        systemUnit.hardware_upgrades,
      );

      if (obsolesenceDate < currentDate) {
        acc.push({
          ...systemUnit,
          obsolesenceDate,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => a.obsolesenceDate - b.obsolesenceDate);
}
