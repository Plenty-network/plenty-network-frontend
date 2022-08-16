import { Dropdown } from '../DropDown/Dropdown';

import { useEffect, useMemo, useRef, useState } from 'react';
import * as React from 'react';

function Protocol() {
  const [selectedDropDown, setSelectedDropDown] = useState('');
  return (
    <div>
      <Dropdown
        title="Protocol"
        Options={['My votes', 'Protocol ']}
        selectedText={selectedDropDown}
        onClick={setSelectedDropDown}
      />
    </div>
  );
}

export default Protocol;
