import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/shared/hooks/hooks";
import { modifierApiService } from "@/features/modifier/services/modifier";
import type {
  AdminModifierGroupResponse,
  CreateModifierGroupRequest,
  CreateModifierOptionRequest,
  UpdateModifierGroupRequest,
  UpdateModifierOptionRequest,
} from "@/features/modifier/types/modifier.dto";

const extractGroupList = (payload: unknown): AdminModifierGroupResponse[] => {
  return Array.isArray(payload)
    ? (payload as AdminModifierGroupResponse[])
    : [];
};

export const useModifierService = () => {
  const queryClient = useQueryClient();
  const storeId =
    useAppSelector((state) => state.currentStore.storeId) ?? undefined;

  const invalidateGroups = () => {
    queryClient.invalidateQueries({ queryKey: ["modifier-groups", storeId] });
  };

  const invalidateGroupDetails = () => {
    queryClient.invalidateQueries({ queryKey: ["modifier-group"] });
  };

  const groupsQuery = useQuery({
    queryKey: ["modifier-groups", storeId],
    queryFn: () => modifierApiService.listGroups(storeId as string),
    enabled: !!storeId,
    select: (response): AdminModifierGroupResponse[] => {
      const list = extractGroupList(response.data.data);
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: (data: Omit<CreateModifierGroupRequest, "storeId">) =>
      modifierApiService.createGroup({ ...data, storeId: storeId as string }),
    onSuccess: invalidateGroups,
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: UpdateModifierGroupRequest;
    }) => modifierApiService.updateGroup(groupId, data),
    onSuccess: () => {
      invalidateGroups();
      invalidateGroupDetails();
    },
  });

  const deactivateGroupMutation = useMutation({
    mutationFn: (groupId: string) =>
      modifierApiService.deactivateGroup(groupId),
    onSuccess: invalidateGroups,
  });

  const createOptionMutation = useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: CreateModifierOptionRequest;
    }) => modifierApiService.createOption(groupId, data),
    onSuccess: () => {
      invalidateGroups();
      invalidateGroupDetails();
    },
  });

  const updateOptionMutation = useMutation({
    mutationFn: ({
      optionId,
      data,
    }: {
      optionId: string;
      data: UpdateModifierOptionRequest;
    }) => modifierApiService.updateOption(optionId, data),
    onSuccess: () => {
      invalidateGroups();
      invalidateGroupDetails();
    },
  });

  const deactivateOptionMutation = useMutation({
    mutationFn: (optionId: string) =>
      modifierApiService.deactivateOption(optionId),
    onSuccess: () => {
      invalidateGroups();
      invalidateGroupDetails();
    },
  });

  const assignGroupMutation = useMutation({
    mutationFn: ({
      productId,
      modifierGroupId,
      sortOrder,
    }: {
      productId: string;
      modifierGroupId: string;
      sortOrder?: number;
    }) =>
      modifierApiService.assignGroupToProduct(productId, {
        modifierGroupId,
        sortOrder,
      }),
    onSuccess: invalidateGroups,
  });

  const removeGroupMutation = useMutation({
    mutationFn: ({
      productId,
      modifierGroupId,
    }: {
      productId: string;
      modifierGroupId: string;
    }) => modifierApiService.removeGroupFromProduct(productId, modifierGroupId),
    onSuccess: invalidateGroups,
  });

  const useGroupDetail = (groupId: string | undefined) => {
    const detailQuery = useQuery({
      queryKey: ["modifier-group", groupId],
      queryFn: () => modifierApiService.getGroup(groupId as string),
      enabled: !!groupId,
      select: (response): AdminModifierGroupResponse | null => {
        const payload = response.data.data;
        return payload && typeof payload === "object"
          ? (payload as AdminModifierGroupResponse)
          : null;
      },
    });
    return {
      group: detailQuery.data ?? null,
      groupLoading: detailQuery.isLoading,
      groupError: detailQuery.error,
      refetchGroup: detailQuery.refetch,
    };
  };

  const invalidateGroupDetail = (groupId: string) => {
    queryClient.invalidateQueries({ queryKey: ["modifier-group", groupId] });
  };

  return {
    groupsQuery: groupsQuery.data ?? [],
    groupsQueryLoading: groupsQuery.isLoading,
    groupsQueryError: groupsQuery.error,
    refetchGroups: groupsQuery.refetch,
    useGroupDetail,
    invalidateGroupDetail,
    createGroupMutation,
    updateGroupMutation,
    deactivateGroupMutation,
    createOptionMutation,
    updateOptionMutation,
    deactivateOptionMutation,
    assignGroupMutation,
    removeGroupMutation,
  };
};
