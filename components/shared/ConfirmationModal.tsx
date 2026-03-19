import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


export function ConfirmationModal({
    children,
    title,
    action,
    description,
    onConfirm,
    variant = "destructive",
    confirmClassName = ""
}: {
    children: React.ReactNode,
    title: string,
    action: string,
    description: string,
    onConfirm: () => void,
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link",
    confirmClassName?: string
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle className="text-2xl mb-3">{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-3">
                    <DialogClose asChild>
                        <Button variant="cancel">Cancelar</Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        variant={variant}
                        onClick={onConfirm}
                        className={confirmClassName}
                    >
                        {action}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
