import { FunctionComponent, useEffect, useState } from 'react';
import NebulaDisk from './NebulaDisk';

const NebulaSpinner = () => {
  const size = 120;

  return (
    <NebulaDisk size={120} depth={0}>
      <NebulaDisk size={size * 0.7} depth={1}>
        <NebulaDisk size={size * 0.3} depth={2} />
      </NebulaDisk>
    </NebulaDisk>
  );
};

export default NebulaSpinner;
