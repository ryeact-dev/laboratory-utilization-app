import { deleteNoClassDate } from "@/api/noClassDays.api";
import {
  addSchoolYear,
  deleteSchoolYear,
  getActiveSchoolYear,
  getActiveSemestralDate,
  getActiveTermSem,
  getSchoolYear,
  getSelectedTermSemDates,
  getTermSem,
  setActiveSchoolYear as setActiveSchoolYearAPI,
  setActiveTermSem as setActiveTermSemAPI,
  setDates,
} from "@/api/termSemSchoolYear.api";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRevalidator } from "react-router-dom";

// *========= QUERIES ==========

// GET LIST OF SCHOOL YEARS
export function useGetListOfSchoolYear() {
  return useQuery({
    queryKey: ["list-of-school-year"],
    queryFn: async () => getSchoolYear(),
    select: ({ data }) => {
      data.sort(
        (a, b) => a.school_year.split("_")[1] - b.school_year.split("_")[1],
      );
      return data;
    },
  });
}

// GET LIST OF TERM AND SEM
export function useGetListOfTermSem() {
  return useQuery({
    queryKey: ["list-of-term-sem"],
    queryFn: () => getTermSem(),
    select: ({ data }) => {
      data.sort((a, b) => a.id - b.id);
      return data;
    },
  });
}

// GET ACTIVE SCHOOL YEAR
export function useGetActiveSchoolYear() {
  return useQuery({
    queryKey: ["active-school-year"],
    queryFn: () => getActiveSchoolYear(),
  });
}

// GET ACTIVE TERM AND SEM
export function useGetActiveTermSem() {
  return useQuery({
    queryKey: ["active-term-sem"],
    queryFn: () => getActiveTermSem(),
  });
}

// GET ACTIVE TERM AND SEM
export function useGetActiveSemestralDate() {
  return useQuery({
    queryKey: ["active-sem"],
    queryFn: () => getActiveSemestralDate(),
  });
}

// GET SELECTED TERM AND SEM DATES
export function useGetSelectedTermSemDates(
  selectedTermAndSem,
  activeSchoolYear,
  isSemestral = false,
) {
  const forQueryData = { selectedTermAndSem, activeSchoolYear };

  return useQuery({
    queryKey: ["selected-term-sem", selectedTermAndSem, activeSchoolYear],
    queryFn: () => getSelectedTermSemDates(forQueryData),
    enabled: !!activeSchoolYear,
    select: ({ data }) => {
      if (!isSemestral) {
        return data.filter((date) => date.termsem_is_active === true)[0];
      }

      return data;
    },
  });
}

// *========= MUTATIONS =========

// ADD SCHOOL YEAR
export function useAddSchoolYear(closeModal) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addSchoolYear,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-of-school-year"] });
      ToastNotification("success", "Successfully added a school year");
      closeModal();
    },
  });
}

// SET ACTIVE SCHOOL YEAR
export function useSetActiveSchoolYear() {
  const revalidator = useRevalidator();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setActiveSchoolYearAPI,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-of-school-year"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-of-term-sem"],
      });
      queryClient.invalidateQueries({
        queryKey: ["active-school-year"],
      });
      ToastNotification("success", "Successfully set an Active School Year");
      revalidator.revalidate();
    },
  });
}

// SET ACTIVE TERM AND SEM
export function useSetActiveTermSem() {
  const revalidator = useRevalidator();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setActiveTermSemAPI,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-of-term-sem"],
      });
      queryClient.invalidateQueries({
        queryKey: ["active-term-sem"],
      });
      ToastNotification("success", "Successfully set an active Term and Sem");
      revalidator.revalidate();
    },
  });
}

// SET TERM DATES
export function useSetDates(closeModal) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setDates,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-of-term-sem"] });
      queryClient.invalidateQueries({ queryKey: ["list-of-school-year"] });
      ToastNotification("success", "Dates successfully set");
      closeModal();
    },
  });
}

// DELETE SCHOOL YEAR
export function useDeleteSchoolYear(closeModal, setIsLoading) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSchoolYear,
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-of-school-year"] });
      ToastNotification("info", "School Year successfully removed");
      setIsLoading(false);
      closeModal();
    },
  });
}

// DELETE NO CLASS SCHEDULE ON LIST
export function useDeleteNoClassSchedule(closeModal, setIsLoading) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNoClassDate,
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listOfNoClassDays"] });
      ToastNotification("info", "Date successfully removed from the list");
      setIsLoading(false);
      closeModal();
    },
  });
}
