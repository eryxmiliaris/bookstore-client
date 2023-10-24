import { Box, Modal } from "@mui/material";

function ModalWindow({ children, open, onClose }) {
  return (
    <Modal
      disableEscapeKeyDown
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute left-1/2 top-1/2 flex w-[300px] -translate-x-1/2 -translate-y-1/2 transform flex-col gap-4 border-2 bg-violet-100 px-4 py-2 shadow-md sm:w-[400px]">
        {children}
      </Box>
    </Modal>
  );
}

export default ModalWindow;
