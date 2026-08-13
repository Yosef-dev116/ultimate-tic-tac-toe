import type { ReactNode } from 'react';
import type { CellValue } from '../../../core/types';
import { Cell } from '../../board/Cell';

interface TinyBoardProps {
  cells: readonly CellValue[];
  children?: ReactNode;
}

/** A standalone, non-interactive mini-board — reuses the real Cell component and styling. */
export function TinyBoard({ cells, children }: TinyBoardProps) {
  return (
    <div className="mini-board tutorial-tinyboard">
      <div className="mini-board__grid">
        {cells.map((cell, index) => (
          <Cell key={index} value={cell} disabled onClick={() => {}} />
        ))}
      </div>
      {children}
    </div>
  );
}
