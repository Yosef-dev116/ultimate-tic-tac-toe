import type { BoardStatus } from '../../core/types';

interface CompletedBoardSummaryProps {
  boardStatus: BoardStatus[];
}

/** Read-only recap of a puzzle already finished in an earlier session today. */
export function CompletedBoardSummary({ boardStatus }: CompletedBoardSummaryProps) {
  return (
    <div className="meta-board meta-board--finished meta-board--summary">
      <div className="meta-board__grid">
        {boardStatus.map((status, index) => (
          <div key={index} className="mini-board mini-board--closed mini-board--summary">
            <div
              className={`mini-board__stamp${status && status !== 'draw' ? ` mini-board__stamp--${status.toLowerCase()}` : ' mini-board__stamp--draw'}`}
            >
              {status === 'draw' || status === null ? '—' : status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
