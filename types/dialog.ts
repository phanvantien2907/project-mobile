export interface BaseDialogProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onConfirm?: () => void;
}
