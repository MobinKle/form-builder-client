import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './AlertDialog';

type FormStatusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isRtl: boolean;
  title: string;
  description: string;
  actionLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
};

export default function FormStatusDialog({
  open,
  onOpenChange,
  isRtl,
  title,
  description,
  actionLabel,
  cancelLabel,
  onConfirm,
}: FormStatusDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent dir={isRtl ? 'rtl' : 'ltr'}>
        <AlertDialogHeader className="text-start">
          <AlertDialogTitle className="text-start">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-start">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter
          className={`gap-3 ${
            isRtl ? 'sm:flex-row-reverse' : 'sm:flex-row'
          }`}
        >
          <AlertDialogAction onClick={onConfirm}>
            {actionLabel}
          </AlertDialogAction>

          <AlertDialogCancel>
            {cancelLabel}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
