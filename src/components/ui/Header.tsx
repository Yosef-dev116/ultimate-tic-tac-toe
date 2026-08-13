interface HeaderProps {
  puzzleNumber: number;
  onOpenTutorial: () => void;
}

export function Header({ puzzleNumber, onOpenTutorial }: HeaderProps) {
  return (
    <header className="app-header">
      <h1 className="app-header__title">Ultimate Tic-Tac-Toe</h1>
      <p className="app-header__subtitle">Daily Puzzle #{puzzleNumber}</p>
      <button type="button" className="help-button" onClick={onOpenTutorial}>
        How to Play
      </button>
    </header>
  );
}
