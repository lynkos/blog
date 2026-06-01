/**
 * Code block runner
 *
 * Adds a "Run" button to supported code blocks. On click, executes the code
 * (Rust via play.rust-lang.org, JavaScript via sandboxed eval) and renders
 * an "Execution results" panel below the block.
 */

const RUST_PLAYGROUND = 'https://play.rust-lang.org/execute';

// ── Executors ──────────────────────────────────────────────────────────────

async function executeRust(code) {
  const res = await fetch(RUST_PLAYGROUND, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      channel: 'stable',
      mode: 'debug',
      edition: '2021',
      crateType: 'bin',
      tests: false,
      code,
      backtrace: false
    })
  });

  if (!res.ok) throw new Error(`Playground returned HTTP ${res.status}`);
  const { success, stdout, stderr } = await res.json();
  return { success, output: success ? stdout : stderr };
}

function executeJavaScript(code) {
  const lines = [];

  // Temporarily redirect console output so we can capture it
  const prev = {
    log:   console.log,
    warn:  console.warn,
    error: console.error
  };

  const capture = (prefix, ...args) => {
    const text = args
      .map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)))
      .join(' ');
    lines.push(prefix ? `${prefix} ${text}` : text);
  };

  console.log   = (...a) => { capture('',        ...a); prev.log(...a);   };
  console.warn  = (...a) => { capture('[warn]',  ...a); prev.warn(...a);  };
  console.error = (...a) => { capture('[error]', ...a); prev.error(...a); };

  try {
    // eslint-disable-next-line no-eval
    eval(code);
    return { success: true,  output: lines.join('\n') || '(no output)' };
  } catch (e) {
    return { success: false, output: `${e.name}: ${e.message}` };
  } finally {
    Object.assign(console, prev); // always restore, even on throw
  }
}

// ── DOM helpers ────────────────────────────────────────────────────────────

function extractCode(container) {
  // .rouge-code is the table cell that holds only the code (no line numbers)
  const rougeCode = container.querySelector('.rouge-code');
  if (rougeCode) return rougeCode.innerText;

  // Plain (non-table) highlight block
  const code = container.querySelector('.highlight code');
  if (code) return code.innerText;

  return '';
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setButtonLoading(btn, loading) {
  btn.querySelector('i').className = loading
    ? 'fas fa-spinner fa-spin'
    : 'fas fa-play';
  btn.disabled = loading;
}

/**
 * Insert (or update in place) the results panel immediately after the
 * language container div. Wires up a collapse toggle on the header.
 */
function upsertResults(container, { success, output }) {
  // Re-use an existing panel if the user runs the block a second time
  const sibling = container.nextElementSibling;
  let panel = sibling?.classList.contains('execution-results') ? sibling : null;

  if (!panel) {
    panel = document.createElement('div');
    panel.className = 'execution-results';
    container.after(panel);
  }

  panel.classList.toggle('execution-error', !success);
  panel.innerHTML = `
    <div class="execution-header" role="button" aria-expanded="true">
      <i class="fas fa-angle-down"></i>
      <span>Execution results</span>
    </div>
    <pre class="execution-output">${escapeHtml(output ?? '(no output)')}</pre>
  `;

  // Collapse/expand on header click
  panel.querySelector('.execution-header').addEventListener('click', () => {
    const pre    = panel.querySelector('.execution-output');
    const isOpen = pre.style.display !== 'none';

    pre.style.display = isOpen ? 'none' : '';
    panel.querySelector('i').className   = isOpen ? 'fas fa-angle-right' : 'fas fa-angle-down';
    panel.querySelector('.execution-header')
         .setAttribute('aria-expanded', String(!isOpen));
  });
}

// ── Public API ─────────────────────────────────────────────────────────────

export function initCodeRunner() {
  document.querySelectorAll('.run-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const lang      = btn.dataset.lang;
      const container = btn.closest('[class*="language-"]');
      if (!container) return;

      const code = extractCode(container).trim();
      if (!code) return;

      setButtonLoading(btn, true);

      try {
        let result;

        if (lang === 'rust' || lang === 'rs') {
          result = await executeRust(code);
        } else if (lang === 'js' || lang === 'javascript') {
          result = executeJavaScript(code);
        } else {
          result = { success: false, output: `'${lang}' is not supported for execution.` };
        }

        upsertResults(container, result);
      } catch (err) {
        upsertResults(container, { success: false, output: `Network error: ${err.message}` });
      } finally {
        setButtonLoading(btn, false);
      }
    });
  });
}