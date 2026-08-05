import { requestDevReset } from '../../puzzle/devReset';

/**
 * Rehearsal-only control: arms the documented reset flag and reloads.
 * Rendered exclusively behind `import.meta.env.DEV`, which Vite statically
 * replaces with `false` in production builds — this component and its
 * import are dead-code-eliminated from the production bundle entirely.
 */
export function DevResetButton() {
  return (
    <button
      type="button"
      className="dev-reset-button"
      onClick={() => {
        requestDevReset();
        window.location.reload();
      }}
    >
      Reset daily puzzle (dev)
    </button>
  );
}
