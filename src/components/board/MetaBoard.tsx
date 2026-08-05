import { useGame } from '../../state/useGame';
import { getWinningLine } from '../../core/winDetection';
import { MiniBoard } from './MiniBoard';
import { WinLine } from '../../animations/WinLine';

export function MetaBoard() {
  const { game, isHumanTurn, playMove } = useGame();

  const metaWinningLine =
    game.winner && game.winner !== 'draw' ? getWinningLine(game.boardStatus, game.winner) : null;

  return (
    <div className={`meta-board${game.winner ? ' meta-board--finished' : ''}`}>
      <div className="meta-board__grid">
        {game.boards.map((cells, boardIndex) => {
          const status = game.boardStatus[boardIndex];
          const isEligibleBoard = game.activeBoard === null || game.activeBoard === boardIndex;

          return (
            <MiniBoard
              key={boardIndex}
              cells={cells}
              status={status}
              isActive={isHumanTurn && isEligibleBoard && status === null}
              canPlay={isHumanTurn && isEligibleBoard && status === null}
              onPlayCell={(cellIndex) => playMove(boardIndex, cellIndex)}
            />
          );
        })}
      </div>

      {metaWinningLine && <WinLine pattern={metaWinningLine} thickness={6} delay={0.3} />}
    </div>
  );
}
