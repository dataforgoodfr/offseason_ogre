// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

/**
 * @see issue https://github.com/mui/material-ui/issues/35287#issuecomment-1337250566
 */

declare global {
  namespace React {
    interface DOMAttributes<T> {
      onResize?: ReactEventHandler<T> | undefined;
      onResizeCapture?: ReactEventHandler<T> | undefined;
      nonce?: string | undefined;
    }
  }
}
