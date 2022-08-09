import * as React from 'react';
import { VotesData } from './VotesData';
import { VotesHeader } from './VotesHeader';

export interface IShortCardProps {
  className?: string;
}

export function VotesTable(props: IShortCardProps) {
  return (
    <>
      <div className={` ${props.className}`}>
        <table className=" flex flex-col gap-3">
          <thead>
            <VotesHeader />
          </thead>
          <tbody className="w-full flex flex-col gap-1">
            {Array(10)
              .fill(1)
              .map((_, i) => (
                <VotesData className="slideFromTop" key={`poolslist${i}`} />
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
