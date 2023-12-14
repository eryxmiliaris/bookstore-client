import { Modal } from "@mui/material";

function ModalWindow({
  children,
  open,
  onClose,
  className,
  width = "w-[320px]",
}) {
  return (
    <Modal disableEscapeKeyDown open={open} onClose={onClose}>
      <div
        className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center gap-4 rounded-md border-2 bg-violet-100 px-4 py-2 shadow-md ${width} ${className}`}
      >
        {children}
      </div>
    </Modal>
  );
}

export default ModalWindow;
