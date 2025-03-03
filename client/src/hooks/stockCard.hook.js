import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteBorrowerSlip } from "@/api/borrowerSlip.api";
import { ToastNotification } from "@/common/toastNotification/ToastNotification";
import {
  addStockCardItems,
  createEditStockCard,
  deleteLaboratorySingleStockCardItems,
  deleteStockCard,
  getPaginatedLaboratoryStockCards,
  getPaginatedOfficeStockCards,
  getReleasedLaboratoryStockCards,
  getStockCardItems,
} from "@/api/stockCard.api";

// *========== BORROWER SLIP ===========

// GET LIST OF SYSTEM UNITS
export function useGetPaginatedOfficeStockCards(
  laboratory,
  category,
  page,
  limit,
  tab,
  mismSubmissionDate,
  search,
) {
  const forQueryData = {
    laboratory,
    category,
    page,
    limit,
    mismSubmissionDate,
  };
  return useQuery({
    queryKey: [
      "list-of-office-stock-cards",
      laboratory,
      category,
      page,
      limit,
      tab,
      search,
      mismSubmissionDate,
    ],
    queryFn: () => getPaginatedOfficeStockCards({ forQueryData, search }),
    isPlaceholderData: keepPreviousData,
    enabled: !!laboratory && tab === "1",
    select: ({ data }) => {
      return data;
    },
  });
}

export function useGetPaginatedLaboratoryStockCards(
  laboratory,
  category,
  page,
  limit,
  tab,
  mismSubmissionDate,
  search,
) {
  const forQueryData = {
    laboratory,
    category,
    page,
    limit,
    mismSubmissionDate,
  };
  return useQuery({
    queryKey: [
      "list-of-laboratory-stock-cards",
      laboratory,
      category,
      page,
      limit,
      tab,
      search,
      mismSubmissionDate,
    ],
    queryFn: () => getPaginatedLaboratoryStockCards({ forQueryData, search }),
    enabled: tab === "2",
    select: ({ data }) => {
      return data;
    },
  });
}

// GET RELEASED LABORATORY STOCKS
export function useGetReleasedLaboratoryStockCards(laboratory, itemTypeFilter) {
  const itemName = (itemName, itemBalance, itemUnit) => {
    let returnName = "";
    switch (itemUnit.toLowerCase()) {
      case "box":
        returnName = `${itemName} [ ${itemBalance} ${itemUnit}${Number(itemBalance) > 1 ? "es" : ""} ]`;
        break;
      case "piece":
        returnName = `${itemName} [ ${itemBalance} ${itemUnit}${Number(itemBalance) > 1 ? "s" : ""} ]`;
        break;

      default:
        returnName = `${itemName} [ ${itemBalance} ${itemUnit} ]`;
        break;
    }

    return returnName;
  };

  return useQuery({
    queryKey: ["released-laboratory-stock-cards", laboratory, itemTypeFilter],
    queryFn: () => getReleasedLaboratoryStockCards({ laboratory }),
    enabled: !!laboratory && itemTypeFilter === "materials",
    select: ({ data }) => {
      if (data) {
        return data.map((item) => {
          return {
            label: itemName(
              item.item_name,
              item.remaining_balance,
              item.item_unit,
            ),
            value: item.item_name,
            id: item.id,
            item_unit: item.item_unit,
            remaining_balance: item.remaining_balance,
            item_category: item.item_category,
          };
        });
      } else return [];
    },
  });
}

// CREATE CREATE STOCK CARD
export function useCreateEditStockCard(closeModal) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEditStockCard,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["list-of-office-stock-cards"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-of-laboratory-stock-cards"],
      });
      ToastNotification("success", data);
      closeModal();
    },
  });
}

// *========== STOCK CARD ITEMS ===========

// GET BORROWER SLIP ITEMS
export function useGetStockCardItems(stockCardId, category, page, limit) {
  return useQuery({
    queryKey: ["list-of-stock-card-items", stockCardId, category, page, limit],
    queryFn: () => getStockCardItems({ stockCardId, category, page, limit }),
    select: ({ data }) => {
      return data;
    },
    enabled: !!stockCardId,
  });
}

// ADD STOCK CARD ITEMS
export function useAddStockCardItems(closeModal) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addStockCardItems,
    onError: ({ response }) => ToastNotification("error", response.data),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["list-of-office-stock-cards"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-of-laboratory-stock-cards"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-of-stock-card-items"],
      });
      ToastNotification("success", data);
      closeModal();
    },
  });
}

// DELETE STOCK CARD
export function useDeleteStockCard(closeModal, setIsLoading) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStockCard,
    onMutate: () => setIsLoading(true),
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({
        queryKey: ["list-of-office-stock-cards"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-of-laboratory-stock-cards"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-of-stock-card-items"],
      });
      ToastNotification("success", data);
      setIsLoading(false);
      closeModal();
    },
  });
}

// DELETE STOCK CARD ITEMS
export function useLaboratoryDeleteStockCardItems(closeModal, setIsLoading) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLaboratorySingleStockCardItems,
    onMutate: () => setIsLoading(true),
    onError: ({ response }) => {
      ToastNotification("error", response.data);
      setIsLoading(false);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["list-of-laboratory-stock-cards"],
      });
      queryClient.invalidateQueries({
        queryKey: ["released-laboratory-stock-cards"],
      });
      queryClient.invalidateQueries({
        queryKey: ["list-of-stock-card-items"],
      });
      ToastNotification("success", "Item Deleted successfully");
      setIsLoading(false);
      closeModal();
    },
  });
}
