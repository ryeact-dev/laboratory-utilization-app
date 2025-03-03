import {
  deleteHardware,
  getPaginatedListOfHardwares,
  getSystemUnitList,
  hardwareMutation,
} from '@/api/hardware.api';
import { ToastNotification } from '@/common/toastNotification/ToastNotification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// *===== QUERIES ======

// GET LIST OF SYSTEM UNITS
export function useGetListOfSystemUnit(laboratory) {
  return useQuery({
    queryKey: ['list-of-system-units', laboratory],
    queryFn: () => getSystemUnitList({ laboratory }),
    enabled: !!laboratory,
    select: ({ data }) => {
      return data;
    },
  });
}

// GET LIST OF HARDWARE
export function useGetListOfHardwares(
  activeSchoolYear,
  laboratory,
  page,
  perpage,
  propertyno
) {
  return useQuery({
    queryKey: [
      'list-of-hardwares',
      activeSchoolYear,
      laboratory,
      page,
      perpage,
      propertyno,
    ],
    queryFn: () =>
      getPaginatedListOfHardwares({
        activeSchoolYear,
        laboratory,
        page,
        perpage,
        propertyno,
      }),
    enabled: !!activeSchoolYear && !!laboratory,
    select: ({ data }) => {
      return data;
    },
  });
}

// *===== MUTATION ======
// ADD SOFTWARE
export function useAddHardware(
  closeModal,
  isUsingExcelFile,
  setDuplicateHardwares
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: hardwareMutation,
    onError: ({ response }) => ToastNotification('error', response.data),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['list-of-hardwares'] });
      queryClient.invalidateQueries({ queryKey: ['list-of-system-units'] });
      if (isUsingExcelFile === 'false') {
        ToastNotification(
          'success',
          "Student's info successfully added/updated"
        );
        closeModal();
      } else {
        setDuplicateHardwares(() => [...data.duplicates]);
        ToastNotification(
          'success',
          `Successfully added ${data.count} hardwares with ${data.duplicates.length} duplicate/s`
        );
      }
    },
  });
}

// DELETE SOFTWARE
export function useDeleteHardware(closeModal, setIsLoading) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteHardware,
    onMutate: () => setIsLoading(true),
    onError: ({ response }) => {
      ToastNotification('error', response.data);
      setIsLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list-of-hardwares'] });
      queryClient.invalidateQueries({ queryKey: ['list-of-system-units'] });
      ToastNotification('info', 'Hardware successfully removed from the list');
      setIsLoading(false);
      closeModal();
    },
  });
}
