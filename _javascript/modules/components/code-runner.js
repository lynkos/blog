/**
 * Code block runner
 *
 * Supported languages and their execution backends:
 * JavaScript → new Function() running in the browser — no network needed
 * Python     → Pyodide API — free, no API key required
 */

const PYODIDE_API = 'https://cdn.jsdelivr.net/pyodide/v0.25.1/full';
const PYODIDE_JS = `${PYODIDE_API}/pyodide.js`;

let pyodideReady = null;

// ── Executors ──────────────────────────────────────────────────────────────

function executeJavaScript(code) {
  const lines = [];
  const prev  = { log: console.log, warn: console.warn, error: console.error };

  // Redirect all console output so we can capture it for display.
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
    new Function(code)();
    return { success: true,  output: lines.join('\n') || '(no output)' };
  } catch (e) {
    return { success: false, output: `${e.name}: ${e.message}` };
  } finally {
    Object.assign(console, prev);
  }
}

async function loadPyodide() {
  if (pyodideReady) return pyodideReady;

  pyodideReady = new Promise((resolve, reject) => {
    if (window.loadPyodide) {
      resolve(window.loadPyodide({ indexURL: PYODIDE_API }));
      return;
    }

    const script = document.createElement('script');
    script.src = PYODIDE_JS;
    script.async = true;
    script.onload = () => {
      window.loadPyodide({ indexURL: PYODIDE_API })
        .then(resolve)
        .catch(reject);
    };
    script.onerror = () => reject(new Error('Failed to load Pyodide'));
    document.head.appendChild(script);
  });

  return pyodideReady;
}

async function executePython(code) {
  const pyodide = await loadPyodide();

  let output = '';
  pyodide.setStdout({
    batched: (s) => { output += s; }
  });
  pyodide.setStderr({
    batched: (s) => { output += s; }
  });

  try {
    await pyodide.runPythonAsync(code);
    return { success: true, output: output.trim() || '(no output)' };
  } catch (e) {
    return { success: false, output: `${e.name}: ${e.message}` };
  } finally {
    pyodide.setStdout({});
    pyodide.setStderr({});
  }
}

// ── DOM helpers ────────────────────────────────────────────────────────────

function extractCode(container) {
  const rougeCode = container.querySelector('.rouge-code');
  if (rougeCode) return rougeCode.innerText;

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

function upsertResults(container, { success, output }) {
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
      <span>Output</span>
    </div>
    <pre class="execution-output">${escapeHtml(output ?? '(no output)')}</pre>
  `;

  panel.querySelector('.execution-header').addEventListener('click', () => {
    const pre    = panel.querySelector('.execution-output');
    const isOpen = pre.style.display !== 'none';

    pre.style.display = isOpen ? 'none' : '';
    panel.querySelector('i').className = isOpen
      ? 'fas fa-angle-right'
      : 'fas fa-angle-down';
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

        switch (lang) {
          case 'js':
          case 'javascript':
            result = executeJavaScript(code);
            break;
          case 'python':
          case 'py':
            result = await executePython(code);
            break;
          default:
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