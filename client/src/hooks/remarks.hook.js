import {
  addRemarks,
  deleteRemark,
  getUtilizationRemarks,
} from "@/api/remarks.api";
import { getUtilizationsRemarksWithDates } from "@/api/utilizations.api";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const reducedData = (data) => {
  const result = data.reduce((acc, curr) => {
    const existingIndex = acc.findIndex((item) => item.id === curr.id);

    if (existingIndex >= 0) {
      acc[existingIndex].details.push({
        remark: curr.remark,
        unit_number: curr.unit_number,
        problem: curr.problem,
        created_at: curr.created_at,
        ticket_no: curr.ticket_no,
        usage_date: curr.usage_date,
      });
    } else {
      const {
        remark,
        unit_number,
        problem,
        created_at,
        ticket_no,
        usage_date,
        ...rest
      } = curr;
      rest.details = [
        {
          remark,
          unit_number,
          problem,
          created_at,
          ticket_no,
          usage_date,
        },
      ];
      acc.push({ ...rest, usage_date });
    }
    return acc;
  }, []);
  return result;
};

// ========= QUERIES ==========

// GET UTILIZATION REMARKS WITH DATES
export function useGetUtilizationRemarks(
  subjectId,
  laboratory,
  activeSchoolYear,
  weekDates,
  activeTermSem,
) {
  return useQuery({
    queryKey: [
      "list-of-lab-monitoring",
      activeSchoolYear,
      weekDates,
      laboratory,
    ],
    queryFn: () =>
      getUtilizationsRemarksWithDates({
        subjectId,
        laboratory,
        activeSchoolYear,
        weekDates,
      }),
    enabled: !!activeSchoolYear && !!activeTermSem,
    select: ({ data }) => {
      return reducedData(data);
    },
  });
}

// GET LIST OF REMARKS BY UTILIZATION ID
export function useGetListOfRemarks(usageId) {
  return useQuery({
    queryKey: ["list-of-remarks", usageId],
    queryFn: () => getUtilizationRemarks({ usageId }),
    enabled: !!usageId,
    select: ({ data }) => {
      return data;
    },
  });
}

// ========= ADD/UPDATE MUTATIONS =========

// ADD REMARK
export function useAddRemarkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addRemarks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-of-remarks"] });
      queryClient.invalidateQueries({ queryKey: ["list-of-lab-monitoring"] });
      ToastNotification("success", "New remark added");
    },
  });
}

export function useRemoveMarkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRemark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["list-of-remarks"] });
      queryClient.invalidateQueries({ queryKey: ["list-of-lab-monitoring"] });
      ToastNotification("info", "Remark removed");
    },
  });
}
