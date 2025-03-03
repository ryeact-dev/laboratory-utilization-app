import { addNoClassDays, getNoClassDays } from "@/api/noClassDays.api";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ========= QUERIES ==========

// GET LIST OF HOLIDAYS
export function useGetListOfHolidays(activeSchoolYear, activeTermSem) {
  return useQuery({
    queryKey: ["listOfHolidays", activeSchoolYear, activeTermSem],
    queryFn: () => getNoClassDays({ activeSchoolYear, activeTermSem }),
    enabled: !!activeSchoolYear && !!activeTermSem,
    select: ({ data }) => {
      const listOfHolidays = data.filter(
        (item) => item.type_of_schedule === "Holidays",
      );
      return listOfHolidays;
    },
  });
}

// GET LIST OF ALL NO CLASS DAYS
export function useGetListOfNoClassDays(activeSchoolYear, activeTermSem) {
  return useQuery({
    queryKey: ["listOfNoClassDays", activeSchoolYear, activeTermSem],
    queryFn: () => getNoClassDays({ activeSchoolYear, activeTermSem }),
    enabled: !!activeSchoolYear,
    select: ({ data }) => {
      return data;
    },
  });
}

// ========= ADD/UPDATE MUTATIONS =========

// ADD NO CLASS DAY
export function useAddNoClassDay(closeModal) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNoClassDays,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["listOfNoClassDays"] });
      ToastNotification("success", data);
      closeModal();
    },
  });
}
