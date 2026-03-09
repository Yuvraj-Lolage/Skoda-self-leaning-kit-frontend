declare module 'react-confetti' {
  import * as React from 'react';
  type ConfettiProps = React.ComponentProps<'div'> & {
    numberOfPieces?: number;
    recycle?: boolean;
  };
  const Confetti: React.ComponentType<ConfettiProps>;
  export default Confetti;
}
