import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft, LuCircleAlert } from "react-icons/lu";
import { useModifierService } from "@/features/modifier/hooks/useModifierService";
import ModifierGroupForm from "@/features/modifier/components/modifier-group-form";
import ModifierOptionEditor from "@/features/modifier/components/modifier-option-editor";
import GroupProductAssignment from "@/features/modifier/components/group-product-assignment";
import { SettingsFrame } from "@/features/store/components/settings-frame";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { InlineAlert } from "@/shared/components/ui/inline-alert";
import { InsetPanel } from "@/shared/components/ui/inset-panel";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useStoreRouteParam } from "@/shared/hooks/use-store-route-param";
import { toast } from "@/shared/services/toast-service";
import type { ModifierGroupFormData } from "@/features/modifier/types/modifier.model";
import type {
  CreateModifierOptionRequest,
  UpdateModifierOptionRequest,
} from "@/features/modifier/types/modifier.dto";

const extractServerMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === "object") {
    const maybeResponse = error as {
      response?: { data?: { message?: string | string[] } };
    };
    const message = maybeResponse.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
    if (Array.isArray(message) && message.length > 0) return message.join(", ");
  }
  return fallback;
};

/**
 * Full page for one modifier group — both creation (`/new`) and editing
 * (`/:groupId`). Group fields, options, and product assignment live here
 * together; no dialogs except destructive confirmations.
 *
 * Options need a persisted group, so on `/new` the option and assignment
 * sections stay locked until the group is created, then the page replaces
 * its URL with the real group id.
 */
const ModifierDetailPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const resolvedStoreId = useStoreRouteParam();
  const { groupId } = useParams<{ groupId?: string }>();
  const isNew = !groupId;

  const {
    useGroupDetail,
    createGroupMutation,
    updateGroupMutation,
    createOptionMutation,
    updateOptionMutation,
    deactivateOptionMutation,
  } = useModifierService();
  const { group, groupLoading } = useGroupDetail(isNew ? undefined : groupId);

  const [deactivatingOptionId, setDeactivatingOptionId] = useState<
    string | null
  >(null);

  const listPath = `/store/${resolvedStoreId}/settings/modifiers`;
  const handleBack = () => navigate(listPath);

  const handleCreateGroup = (data: ModifierGroupFormData) => {
    createGroupMutation.mutate(data, {
      onSuccess: (response) => {
        const created = response.data.data as { id?: string } | undefined;
        toast.success({ title: t("settings.modifiers.createGroupSuccess") });
        if (created?.id) {
          navigate(
            `/store/${resolvedStoreId}/settings/modifiers/${created.id}`,
            { replace: true },
          );
        } else {
          handleBack();
        }
      },
      onError: (error) =>
        toast.error({
          title: extractServerMessage(
            error,
            t("settings.modifiers.createGroupFailed"),
          ),
        }),
    });
  };

  const handleUpdateGroup = (data: ModifierGroupFormData) => {
    if (!groupId) return;
    updateGroupMutation.mutate(
      { groupId, data },
      {
        onSuccess: () =>
          toast.success({ title: t("settings.modifiers.updateGroupSuccess") }),
        onError: (error) =>
          toast.error({
            title: extractServerMessage(
              error,
              t("settings.modifiers.updateGroupFailed"),
            ),
          }),
      },
    );
  };

  const handleCreateOption = (data: CreateModifierOptionRequest) => {
    if (!groupId) return;
    createOptionMutation.mutate(
      { groupId, data },
      {
        onError: (error) =>
          toast.error({
            title: extractServerMessage(
              error,
              t("settings.modifiers.createOptionFailed"),
            ),
          }),
      },
    );
  };

  const handleUpdateOption = (
    optionId: string,
    data: UpdateModifierOptionRequest,
  ) => {
    updateOptionMutation.mutate(
      { optionId, data },
      {
        onError: (error) =>
          toast.error({
            title: extractServerMessage(
              error,
              t("settings.modifiers.updateOptionFailed"),
            ),
          }),
      },
    );
  };

  const handleConfirmDeactivateOption = () => {
    if (!deactivatingOptionId) return;
    deactivateOptionMutation.mutate(deactivatingOptionId, {
      onSuccess: () => setDeactivatingOptionId(null),
      onError: (error) =>
        toast.error({
          title: extractServerMessage(
            error,
            t("settings.modifiers.deactivateOptionFailed"),
          ),
        }),
    });
  };

  const togglingOptionId =
    updateOptionMutation.isPending && updateOptionMutation.variables
      ? updateOptionMutation.variables.optionId
      : null;

  const isOptionSubmitting =
    createOptionMutation.isPending || updateOptionMutation.isPending;

  const deactivatingOption = deactivatingOptionId
    ? ((group?.options ?? []).find((o) => o.id === deactivatingOptionId) ??
      null)
    : null;

  const activeOptionCount = (group?.options ?? []).filter(
    (o) => o.isAvailable,
  ).length;
  const showHealthWarning =
    !!group &&
    group.isActive &&
    group.minSelect > 0 &&
    activeOptionCount < group.minSelect;

  return (
    <SettingsFrame>
      <div className="w-full space-y-6 lg:space-y-8">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="px-1 text-text-secondary hover:text-text-primary"
        >
          <LuArrowLeft size={16} />
          {t("settings.modifiers.backToModifiers")}
        </Button>

        <Card as="section">
          <div className="mb-5">
            <h1 className="text-heading leading-tight text-text-primary sm:text-display">
              {isNew
                ? t("settings.modifiers.createGroupTitle")
                : (group?.name ?? t("settings.modifiers.detailTitle"))}
            </h1>
            <p className="mt-1 text-body-sm text-text-secondary">
              {isNew
                ? t("settings.modifiers.createGroupDescription")
                : t("settings.modifiers.editGroupDescription")}
            </p>
          </div>

          {isNew ? (
            <ModifierGroupForm
              onSubmit={handleCreateGroup}
              isSubmitting={createGroupMutation.isPending}
              submitLabel={t("settings.modifiers.createAndContinue")}
            />
          ) : group ? (
            <ModifierGroupForm
              key={group.id + String(group.updatedAt)}
              defaultValues={{
                name: group.name,
                selectionType: group.selectionType,
                minSelect: group.minSelect,
                maxSelect: group.maxSelect,
              }}
              onSubmit={handleUpdateGroup}
              isSubmitting={updateGroupMutation.isPending}
              submitLabel={t("settings.modifiers.save")}
            />
          ) : groupLoading ? (
            <InsetPanel className="text-label text-text-secondary">
              {t("settings.modifiers.loadingGroup")}
            </InsetPanel>
          ) : (
            <EmptyState
              icon={<LuCircleAlert size={32} />}
              title={t("settings.modifiers.groupNotFound")}
              description={t("settings.modifiers.groupNotFoundDescription")}
              action={
                <Button variant="secondary" onClick={handleBack}>
                  {t("settings.modifiers.backToModifiers")}
                </Button>
              }
            />
          )}
        </Card>

        {showHealthWarning && (
          <InlineAlert tone="warning">
            {t("settings.modifiers.optionsHealthWarning", {
              min: String(group.minSelect),
              active: String(activeOptionCount),
            })}
          </InlineAlert>
        )}

        {isNew ? (
          <Card as="section">
            <h2 className="text-title text-text-primary">
              {t("settings.modifiers.optionsTitle")}
            </h2>
            <p className="mt-1 text-body-sm text-text-secondary">
              {t("settings.modifiers.optionsLockedHint")}
            </p>
          </Card>
        ) : (
          group && (
            <>
              <ModifierOptionEditor
                group={group}
                onCreateOption={handleCreateOption}
                onUpdateOption={handleUpdateOption}
                onDeactivateOption={setDeactivatingOptionId}
                isSubmitting={isOptionSubmitting}
                togglingOptionId={togglingOptionId}
              />
              <GroupProductAssignment groupId={group.id} />
            </>
          )
        )}
      </div>

      <Dialog
        open={deactivatingOptionId != null}
        onClose={() => setDeactivatingOptionId(null)}
        className="max-w-xl"
      >
        <DialogHeader>
          <DialogTitle>
            {t("settings.modifiers.deactivateOptionTitle")}
          </DialogTitle>
          <DialogDescription>
            {deactivatingOption
              ? t("settings.modifiers.deactivateOptionDescription", {
                  name: deactivatingOption.name,
                })
              : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setDeactivatingOptionId(null)}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={deactivateOptionMutation.isPending}
            onClick={handleConfirmDeactivateOption}
          >
            {deactivateOptionMutation.isPending
              ? t("settings.modifiers.deactivating")
              : t("settings.modifiers.confirmDeactivate")}
          </Button>
        </DialogFooter>
      </Dialog>
    </SettingsFrame>
  );
};

export default ModifierDetailPage;
