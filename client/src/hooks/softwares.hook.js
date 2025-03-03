import {
  deleteSoftware,
  getListOfSoftwares,
  softwareMutation,
} from '@/api/sofrwares.api';
import { ToastNotification } from '@/common/toastNotification/ToastNotification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// *===== QUERIES ======
export function useGetListOfSoftwares(activeSchoolYear, laboratory) {
  return useQuery({
    queryKey: ['listOfSoftwares', laboratory, activeSchoolYear],
    queryFn: () => getListOfSoftwares({ activeSchoolYear, laboratory }),
    enabled: !!activeSchoolYear,
    select: ({ data }) => {
      return data;
    },
  });
}

// *===== MUTATION ======
// ADD SOFTWARE
export function useAddSoftware(closeModal) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: softwareMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listOfSoftwares'] });
      ToastNotification('success', 'Software successfully added');
      closeModal();
    },
  });
}

// DELETE SOFTWARE
export function useDeleteSoftware(closeModal, setIsLoading) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSoftware,
    onError: ({ response }) => {
      ToastNotification('error', response.data);
      setIsLoading(false);
    },
    onMutate: () => setIsLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listOfSoftwares'] });
      ToastNotification('info', 'Software successfully removed from the list');
      setIsLoading(false);
      closeModal();
    },
  });
}
