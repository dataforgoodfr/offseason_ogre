import { useCallback, useState } from "react";

export { useDialog };

function useDialog() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return {
    isOpen,
    closeDialog,
    openDialog,
  };
}
