import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LuArrowLeft, LuCircleAlert, LuEye, LuTrash2 } from "react-icons/lu";
import { useModifierService } from "@/features/modifier/hooks/useModifierService";
import ModifierGroupForm from "@/features/modifier/components/modifier-group-form";
import { emptyGroupDefaults } from "@/features/modifier/utils/modifier-group-preset";
import ModifierOptionEditor from "@/features/modifier/components/modifier-option-editor";
import GroupProductAssignment from "@/features/modifier/components/group-product-assignment";
import { ModifierPosPreview } from "@/features/modifier/components/modifier-pos-preview";
import { ModifierTipsCard } from "@/features/modifier/components/modifier-tips-card";
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

const GROUP_FORM_ID = "modifier-group-form";

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
 * Guided detail page for one modifier group — creation (`/new`) and editing
 * (`/:groupId`). Steps 1–2 (group fields) submit through the bottom action
 * bar; options and product assignment mutate immediately, same as before.
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
    deleteGroupMutation,
    createOptionMutation,
    updateOptionMutation,
    deleteOptionMutation,
  } = useModifierService();
  const { group, groupLoading } = useGroupDetail(isNew ? undefined : groupId);

  const form = useForm<ModifierGroupFormData>({
    defaultValues: emptyGroupDefaults,
  });
  const { reset, handleSubmit } = form;

  useEffect(() => {
    if (group) {
      reset({
        name: group.name,
        selectionType: group.selectionType,
        minSelect: group.minSelect,
        maxSelect: group.maxSelect,
      });
    }
  }, [group, reset]);

  const [deletingOptionId, setDeletingOptionId] = useState<string | null>(null);
  const [confirmingDeleteGroup, setConfirmingDeleteGroup] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const listPath = `/store/${resolvedStoreId}/settings/modifiers`;
  const handleBack = () => navigate(listPath);

  const watchedName = form.watch("name");
  const watchedSelectionType = form.watch("selectionType");
  const watchedMin = form.watch("minSelect");
  const watchedMax = form.watch("maxSelect");

  const previewOptions = useMemo(
    () =>
      (group?.options ?? []).map((o) => ({
        id: o.id,
        name: o.name,
        priceAdjustment: Number(o.priceAdjustment ?? 0),
        isAvailable: o.isAvailable,
      })),
    [group?.options],
  );

  const sanitize = (data: ModifierGroupFormData): ModifierGroupFormData => ({
    name: data.name.trim(),
    selectionType: data.selectionType,
    minSelect: Math.max(0, Number(data.minSelect) || 0),
    maxSelect: Math.max(0, Number(data.maxSelect) || 0),
  });

  const handleCreateGroup = (data: ModifierGroupFormData) => {
    createGroupMutation.mutate(sanitize(data), {
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
      { groupId, data: sanitize(data) },
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

  const handleConfirmDeleteOption = () => {
    if (!deletingOptionId) return;
    deleteOptionMutation.mutate(deletingOptionId, {
      onSuccess: () => setDeletingOptionId(null),
      onError: (error) =>
        toast.error({
          title: extractServerMessage(
            error,
            t("settings.modifiers.deleteOptionFailed"),
          ),
        }),
    });
  };

  const handleConfirmDeleteGroup = () => {
    if (!groupId) return;
    deleteGroupMutation.mutate(groupId, {
      onSuccess: () => {
        setConfirmingDeleteGroup(false);
        toast.success({ title: t("settings.modifiers.deleteGroupSuccess") });
        navigate(listPath);
      },
      onError: (error) =>
        toast.error({
          title: extractServerMessage(
            error,
            t("settings.modifiers.deleteGroupFailed"),
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
  const isGroupSubmitting =
    createGroupMutation.isPending || updateGroupMutation.isPending;

  const deletingOption = deletingOptionId
    ? ((group?.options ?? []).find((o) => o.id === deletingOptionId) ?? null)
    : null;

  const activeOptionCount = (group?.options ?? []).filter(
    (o) => o.isAvailable,
  ).length;
  const minSelect = group?.minSelect ?? 0;
  const showHealthWarning =
    !!group && group.isActive && minSelect > 0 && activeOptionCount < minSelect;

  return (
    <SettingsFrame>
      <div className="w-full space-y-6">
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

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-heading leading-tight text-text-primary sm:text-display">
              {isNew
                ? t("settings.modifiers.createGroupTitle")
                : t("settings.modifiers.editGroupTitle")}
            </h1>
            <p className="mt-1 text-body-sm text-text-secondary">
              {t("settings.modifiers.detailSubtitle")}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setPreviewOpen(true)}
          >
            <LuEye className="h-4 w-4" />
            {t("settings.modifiers.previewInPos")}
          </Button>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-6">
            {isNew ? (
              <form
                id={GROUP_FORM_ID}
                onSubmit={handleSubmit(handleCreateGroup)}
              >
                <ModifierGroupForm form={form} />
              </form>
            ) : group ? (
              <form
                id={GROUP_FORM_ID}
                onSubmit={handleSubmit(handleUpdateGroup)}
              >
                <ModifierGroupForm form={form} />
              </form>
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
                    onDeleteOption={setDeletingOptionId}
                    isSubmitting={isOptionSubmitting}
                    togglingOptionId={togglingOptionId}
                  />
                  <GroupProductAssignment groupId={group.id} />
                </>
              )
            )}

            <div className="lg:hidden">
              <ModifierTipsCard />
            </div>
          </div>

          <div className="hidden min-w-0 space-y-6 lg:sticky lg:top-20 lg:block">
            <ModifierPosPreview
              groupName={isNew ? watchedName : (group?.name ?? watchedName)}
              selectionType={watchedSelectionType}
              minSelect={Number(watchedMin) || 0}
              maxSelect={Number(watchedMax) || 0}
              options={previewOptions}
            />
            <ModifierTipsCard />
          </div>
        </div>

        {(isNew || group) && (
          <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-border bg-bg py-4">
            {!isNew ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmingDeleteGroup(true)}
                className="text-danger hover:bg-danger-bg hover:text-danger"
              >
                <LuTrash2 className="h-4 w-4" />
                {t("settings.modifiers.deleteGroup")}
              </Button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-3">
              <Button type="button" variant="secondary" onClick={handleBack}>
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                form={GROUP_FORM_ID}
                disabled={isGroupSubmitting}
              >
                {isNew
                  ? t("settings.modifiers.createAndContinue")
                  : t("settings.modifiers.save")}
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)}>
        <ModifierPosPreview
          groupName={isNew ? watchedName : (group?.name ?? watchedName)}
          selectionType={watchedSelectionType}
          minSelect={Number(watchedMin) || 0}
          maxSelect={Number(watchedMax) || 0}
          options={previewOptions}
        />
      </Dialog>

      <Dialog
        open={deletingOptionId != null}
        onClose={() => setDeletingOptionId(null)}
        className="max-w-xl"
      >
        <DialogHeader>
          <DialogTitle>{t("settings.modifiers.deleteOptionTitle")}</DialogTitle>
          <DialogDescription>
            {deletingOption
              ? t("settings.modifiers.deleteOptionDescription", {
                  name: deletingOption.name,
                })
              : ""}
          </DialogDescription>
        </DialogHeader>
        <InlineAlert tone="warning">
          {t("settings.modifiers.deleteOptionWarning")}
        </InlineAlert>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setDeletingOptionId(null)}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={deleteOptionMutation.isPending}
            onClick={handleConfirmDeleteOption}
          >
            {deleteOptionMutation.isPending
              ? t("settings.modifiers.deleting")
              : t("settings.modifiers.confirmDelete")}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={confirmingDeleteGroup}
        onClose={() => setConfirmingDeleteGroup(false)}
        className="max-w-xl"
      >
        <DialogHeader>
          <DialogTitle>{t("settings.modifiers.deleteGroupTitle")}</DialogTitle>
          <DialogDescription>
            {group
              ? t("settings.modifiers.deleteGroupDescription", {
                  name: group.name,
                })
              : ""}
          </DialogDescription>
        </DialogHeader>
        <InlineAlert tone="warning">
          {t("settings.modifiers.deleteGroupWarning")}
        </InlineAlert>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setConfirmingDeleteGroup(false)}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={deleteGroupMutation.isPending}
            onClick={handleConfirmDeleteGroup}
          >
            {deleteGroupMutation.isPending
              ? t("settings.modifiers.deleting")
              : t("settings.modifiers.confirmDelete")}
          </Button>
        </DialogFooter>
      </Dialog>
    </SettingsFrame>
  );
};

export default ModifierDetailPage;
