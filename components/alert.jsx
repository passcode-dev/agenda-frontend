import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function AlertDialogUI({ title, description, showDialog, setShowDialog, onConfirm, hidden }) {
    return (
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {hidden ? (
                        <AlertDialogAction onClick={onConfirm}>Confirmar</AlertDialogAction>
                    ) : (
                        <>
                            <AlertDialogCancel onClick={() => setShowDialog(false)}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={onConfirm}>Confirmar</AlertDialogAction>
                        </>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
