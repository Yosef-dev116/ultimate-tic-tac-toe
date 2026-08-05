interface HeaderProps {
  puzzleNumber: number;
}

export function Header({ puzzleNumber }: HeaderProps) {
  return (
    <header className="app-header">
      <h1 className="app-header__title">Ultimate Tic-Tac-Toe</h1>
      <p className="app-header__subtitle">Daily Puzzle #{puzzleNumber}</p>
    </header>
  );
}
