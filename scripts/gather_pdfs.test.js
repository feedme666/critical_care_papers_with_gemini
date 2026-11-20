const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { loadConfig, gatherPdfs, gatherViaShortcut, parseArgs } = require('./gather_pdfs');

function createTempWorkspace() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'gather-pdfs-test-'));
  const sourceDir = path.join(base, 'unprocessed_pdfs');
  const destDir = path.join(base, 'raw_pdfs');
  fs.mkdirSync(sourceDir, { recursive: true });
  fs.mkdirSync(destDir, { recursive: true });
  return { base, sourceDir, destDir };
}

test('moves PDFs recursively (case-insensitive) and leaves non-PDFs and hidden files untouched', () => {
  const { base, sourceDir, destDir } = createTempWorkspace();
  try {
    fs.writeFileSync(path.join(sourceDir, 'trial_a.pdf'), '%PDF-1.4 content A');
    fs.writeFileSync(path.join(sourceDir, 'TRIAL_B.PDF'), '%PDF-1.4 content B');
    fs.writeFileSync(path.join(sourceDir, 'notes.txt'), 'not a pdf');
    fs.writeFileSync(path.join(sourceDir, '._appledouble.pdf'), 'metadata');
    fs.mkdirSync(path.join(sourceDir, 'nested', 'sub'), { recursive: true });
    fs.writeFileSync(path.join(sourceDir, 'nested', 'sub', 'guideline_c.Pdf'), '%PDF-1.4 content C');
    fs.mkdirSync(path.join(sourceDir, '.hidden_dir'), { recursive: true });
    fs.writeFileSync(path.join(sourceDir, '.hidden_dir', 'ignored.pdf'), '%PDF-1.4 hidden');

    const result = gatherPdfs({ mode: 'direct', sourceDir, destDir, recursive: true, dryRun: false });

    assert.equal(result.mode, 'direct');
    assert.equal(result.foundCount, 3);
    assert.equal(result.moved.length, 3);
    assert.equal(result.skipped.length, 0);
    assert.equal(result.failed.length, 0);

    // Moved files exist in dest with exact contents and are removed from source.
    assert.equal(fs.readFileSync(path.join(destDir, 'trial_a.pdf'), 'utf8'), '%PDF-1.4 content A');
    assert.equal(fs.readFileSync(path.join(destDir, 'TRIAL_B.PDF'), 'utf8'), '%PDF-1.4 content B');
    assert.equal(fs.readFileSync(path.join(destDir, 'guideline_c.Pdf'), 'utf8'), '%PDF-1.4 content C');

    assert.equal(fs.existsSync(path.join(sourceDir, 'trial_a.pdf')), false);
    assert.equal(fs.existsSync(path.join(sourceDir, 'TRIAL_B.PDF')), false);
    assert.equal(fs.existsSync(path.join(sourceDir, 'nested', 'sub', 'guideline_c.Pdf')), false);

    // Untouched files remain in source.
    assert.equal(fs.existsSync(path.join(sourceDir, 'notes.txt')), true);
    assert.equal(fs.existsSync(path.join(sourceDir, '._appledouble.pdf')), true);
    assert.equal(fs.existsSync(path.join(sourceDir, '.hidden_dir', 'ignored.pdf')), true);

    assert.deepEqual(result.rawPdfsAfter, ['guideline_c.Pdf', 'trial_a.pdf', 'TRIAL_B.PDF']);
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test('skips filename collisions without overwriting existing or duplicate PDFs', () => {
  const { base, sourceDir, destDir } = createTempWorkspace();
  try {
    fs.writeFileSync(path.join(destDir, 'existing.pdf'), 'ORIGINAL DEST CONTENT');
    fs.writeFileSync(path.join(sourceDir, 'existing.pdf'), 'NEW SOURCE CONTENT');

    fs.mkdirSync(path.join(sourceDir, 'a'), { recursive: true });
    fs.mkdirSync(path.join(sourceDir, 'b'), { recursive: true });
    fs.writeFileSync(path.join(sourceDir, 'a', 'dup.pdf'), 'DUP FROM A');
    fs.writeFileSync(path.join(sourceDir, 'b', 'dup.pdf'), 'DUP FROM B');

    const result = gatherPdfs({ mode: 'direct', sourceDir, destDir, recursive: true, dryRun: false });

    assert.equal(result.foundCount, 3);
    assert.equal(result.moved.length, 1);
    assert.equal(result.skipped.length, 2);
    assert.equal(result.failed.length, 0);

    // Existing destination file must not be overwritten; source duplicate stays in place.
    assert.equal(fs.readFileSync(path.join(destDir, 'existing.pdf'), 'utf8'), 'ORIGINAL DEST CONTENT');
    assert.equal(fs.readFileSync(path.join(sourceDir, 'existing.pdf'), 'utf8'), 'NEW SOURCE CONTENT');

    // First dup moved, second skipped and preserved in source.
    assert.equal(fs.readFileSync(path.join(destDir, 'dup.pdf'), 'utf8'), 'DUP FROM A');
    assert.equal(fs.existsSync(path.join(sourceDir, 'a', 'dup.pdf')), false);
    assert.equal(fs.readFileSync(path.join(sourceDir, 'b', 'dup.pdf'), 'utf8'), 'DUP FROM B');
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test('dry-run reports planned moves and collisions without modifying files', () => {
  const { base, sourceDir, destDir } = createTempWorkspace();
  try {
    fs.writeFileSync(path.join(sourceDir, 'one.pdf'), 'PDF 1');
    fs.mkdirSync(path.join(sourceDir, 'sub'), { recursive: true });
    fs.writeFileSync(path.join(sourceDir, 'sub', 'one.pdf'), 'PDF 1 DUP');

    const result = gatherPdfs({ mode: 'direct', sourceDir, destDir, recursive: true, dryRun: true });

    assert.equal(result.foundCount, 2);
    assert.equal(result.moved.length, 1);
    assert.equal(result.skipped.length, 1);
    assert.equal(fs.existsSync(path.join(sourceDir, 'one.pdf')), true);
    assert.equal(fs.existsSync(path.join(sourceDir, 'sub', 'one.pdf')), true);
    assert.equal(fs.existsSync(path.join(destDir, 'one.pdf')), false);
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test('shortcut mode invokes named shortcut and reports newly added PDFs in destDir', () => {
  const { base, destDir } = createTempWorkspace();
  try {
    fs.writeFileSync(path.join(destDir, 'already_there.pdf'), 'OLD');

    let ranName = null;
    const result = gatherPdfs(
      { mode: 'shortcut', shortcutName: 'Gather Critical Care PDFs', destDir, dryRun: false },
      {
        listShortcuts: () => ['Other Shortcut', 'Gather Critical Care PDFs'],
        runShortcut: (name) => {
          ranName = name;
          fs.writeFileSync(path.join(destDir, 'new_paper.pdf'), 'NEW');
          return '';
        },
      }
    );

    assert.equal(ranName, 'Gather Critical Care PDFs');
    assert.equal(result.mode, 'shortcut');
    assert.equal(result.moved.length, 1);
    assert.equal(path.basename(result.moved[0].destPath), 'new_paper.pdf');
    assert.deepEqual(result.rawPdfsBefore, ['already_there.pdf']);
    assert.deepEqual(result.rawPdfsAfter, ['already_there.pdf', 'new_paper.pdf']);
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test('shortcut mode dry-run validates shortcut existence without running it', () => {
  const { base, destDir } = createTempWorkspace();
  try {
    let called = false;
    const result = gatherViaShortcut(
      { shortcutName: 'Gather Critical Care PDFs', destDir, dryRun: true },
      {
        listShortcuts: () => ['Gather Critical Care PDFs'],
        runShortcut: () => {
          called = true;
          return '';
        },
      }
    );

    assert.equal(called, false);
    assert.equal(result.dryRun, true);
    assert.equal(result.shortcutName, 'Gather Critical Care PDFs');
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test('shortcut mode throws SHORTCUT_NOT_FOUND when shortcut does not exist', () => {
  assert.throws(
    () =>
      gatherViaShortcut(
        { shortcutName: 'Missing Shortcut', destDir: '/tmp/raw_pdfs', dryRun: true },
        {
          listShortcuts: () => ['Some Other Shortcut'],
          runShortcut: () => '',
        }
      ),
    (err) => err.code === 'SHORTCUT_NOT_FOUND'
  );
});

test('loadConfig respects CLI > env > config file precedence and mode detection', () => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'gather-config-test-'));
  try {
    const configPath = path.join(base, '.gather.local.json');
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        mode: 'shortcut',
        shortcutName: 'Gather Critical Care PDFs',
        sourceDir: path.join(base, 'from-file-src'),
        destDir: path.join(base, 'from-file-dest'),
        recursive: false,
      })
    );

    const fromFile = loadConfig({ configPath, env: {} });
    assert.equal(fromFile.mode, 'shortcut');
    assert.equal(fromFile.shortcutName, 'Gather Critical Care PDFs');
    assert.equal(fromFile.sourceDir, path.join(base, 'from-file-src'));
    assert.equal(fromFile.destDir, path.join(base, 'from-file-dest'));
    assert.equal(fromFile.recursive, false);

    const fromEnv = loadConfig({
      configPath,
      env: { GATHER_MODE: 'direct', GATHER_SOURCE_DIR: path.join(base, 'from-env-src') },
    });
    assert.equal(fromEnv.mode, 'direct');
    assert.equal(fromEnv.sourceDir, path.join(base, 'from-env-src'));

    const cliOptions = parseArgs([
      '--mode',
      'shortcut',
      '--shortcut',
      'CLI Shortcut',
      '--recursive',
      '--dry-run',
    ]);
    const fromCli = loadConfig({
      cliOptions,
      configPath,
      env: { GATHER_MODE: 'direct', GATHER_SHORTCUT_NAME: 'Env Shortcut' },
    });
    assert.equal(fromCli.mode, 'shortcut');
    assert.equal(fromCli.shortcutName, 'CLI Shortcut');
    assert.equal(fromCli.recursive, true);
    assert.equal(fromCli.dryRun, true);
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test('throws clear error when sourceDir is missing or non-existent in direct mode', () => {
  assert.throws(
    () => gatherPdfs({ mode: 'direct', sourceDir: null, destDir: '/tmp/raw_pdfs' }),
    (err) => err.code === 'MISSING_SOURCE_CONFIG'
  );

  assert.throws(
    () => gatherPdfs({ mode: 'direct', sourceDir: '/tmp/definitely-does-not-exist-gather-test', destDir: '/tmp/raw_pdfs' }),
    (err) => err.code === 'ENOENT'
  );
});
