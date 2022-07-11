import * as React from 'react';

export interface ISwitchProps {
}

export function Switch (props: ISwitchProps) {
  return (
    <div className="flex justify-center">
  <div className="form-check form-switch">
    <input className="form-check-input appearance-none w-9 -ml-10 rounded-full float-left h-5 align-top bg-white bg-no-repeat bg-contain bg-gray-300 focus:outline-none cursor-pointer shadow-sm" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
    <label className="form-check-label inline-block text-gray-800" htmlFor="flexSwitchCheckDefault">Default switch checkbox input</label>
  </div>
</div>

  );
}
