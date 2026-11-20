#!/usr/bin/env node

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const DEFAULT_CONFIG_PATH = path.join(REPO_ROOT, '.gather.local.json');
const DEFAULT_DEST_DIR = path.join(REPO_ROOT, 'raw_pdfs');

function parseArgs(argv) {
  const options = {
    mode: null,
    shortcutName: null,
    sourceDir: null,
    destDir: null,
    configPath: DEFAULT_CONFIG_PATH,
    dryRun: false,
    recursive: null,
    json: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--no-recursive') {
      options.recursive = false;
    } else if (arg === '--recursive') {
      options.recursive = true;
    } else if (arg === '--json') {
      options.json = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--mode' && i + 1 < argv.length) {
      options.mode = argv[++i];
    } else if (arg === '--shortcut' && i + 1 < argv.length) {
      options.shortcutName = argv[++i];
    } else if (arg === '--source' && i + 1 < argv.length) {
      options.sourceDir = argv[++i];
    } else if (arg === '--dest' && i + 1 < argv.length) {
      options.destDir = argv[++i];
    } else if (arg === '--config' && i + 1 < argv.length) {
      options.configPath = path.resolve(argv[++i]);
    } else {
      throw new Error(`Unknown or incomplete argument: ${arg}`);
    }
  }

  return options;
}

function loadConfig({
  cliOptions = {},
  env = process.env,
  configPath = DEFAULT_CONFIG_PATH,
  defaultDestDir = DEFAULT_DEST_DIR,
} = {}) {
  let fileConfig = {};
  if (configPath && fs.existsSync(configPath)) {
    const raw = fs.readFileSync(configPath, 'utf8');
    fileConfig = JSON.parse(raw);
  }

  const shortcutName =
    cliOptions.shortcutName || env.GATHER_SHORTCUT_NAME || fileConfig.shortcutName || null;
  const sourceDir = cliOptions.sourceDir || env.GATHER_SOURCE_DIR || fileConfig.sourceDir || null;
  const destDir = cliOptions.destDir || env.GATHER_DEST_DIR || fileConfig.destDir || defaultDestDir;
  const recursive =
    cliOptions.recursive !== null && cliOptions.recursive !== undefined
      ? cliOptions.recursive
      : typeof fileConfig.recursive === 'boolean'
        ? fileConfig.recursive
        : true;

  let mode = cliOptions.mode || env.GATHER_MODE || fileConfig.mode || null;
  if (!mode) {
    if (cliOptions.shortcutName) {
      mode = 'shortcut';
    } else if (cliOptions.sourceDir) {
      mode = 'direct';
    } else if (shortcutName) {
      mode = 'shortcut';
    } else {
      mode = 'direct';
    }
  }

  if (mode !== 'shortcut' && mode !== 'direct') {
    const err = new Error(`未対応の mode です: "${mode}" ("shortcut" または "direct" を指定してください)`);
    err.code = 'INVALID_MODE';
    throw err;
  }

  return {
    mode,
    shortcutName,
    sourceDir: sourceDir ? path.resolve(sourceDir) : null,
    destDir: path.resolve(destDir),
    recursive,
    dryRun: Boolean(cliOptions.dryRun),
    configPath,
  };
}

function isPdfFileName(fileName) {
  if (!fileName || fileName.startsWith('.')) {
    return false;
  }
  return path.extname(fileName).toLowerCase() === '.pdf';
}

function findPdfFiles(rootDir, { recursive = true } = {}) {
  const results = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      if (entry.name.startsWith('.')) {
        continue;
      }
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (recursive) {
          walk(fullPath);
        }
      } else if (entry.isFile() && isPdfFileName(entry.name)) {
        results.push(fullPath);
      }
    }
  }

  walk(rootDir);
  return results;
}

function movePdfSafely(srcPath, destDir) {
  const fileName = path.basename(srcPath);
  const destPath = path.join(destDir, fileName);

  if (fs.existsSync(destPath)) {
    return {
      status: 'skipped',
      reason: 'destination_exists',
      srcPath,
      destPath,
    };
  }

  const srcStat = fs.statSync(srcPath);
  const tmpName = `.gather_tmp_${process.pid}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.part`;
  const tmpPath = path.join(destDir, tmpName);
  let placedAtDest = false;

  try {
    // Copy first so cloud-backed files (e.g. Box Drive / File Provider) are hydrated
    // and cross-filesystem moves work safely without risking source data loss.
    fs.copyFileSync(srcPath, tmpPath, fs.constants.COPYFILE_EXCL);

    const tmpStat = fs.statSync(tmpPath);
    if (tmpStat.size !== srcStat.size) {
      throw new Error(
        `Copied file size mismatch (source: ${srcStat.size} bytes, copied: ${tmpStat.size} bytes)`
      );
    }

    try {
      // linkSync fails with EEXIST if destPath was created concurrently.
      fs.linkSync(tmpPath, destPath);
      placedAtDest = true;
      fs.unlinkSync(tmpPath);
    } catch (linkErr) {
      if (linkErr && linkErr.code === 'EEXIST') {
        fs.unlinkSync(tmpPath);
        return {
          status: 'skipped',
          reason: 'destination_exists',
          srcPath,
          destPath,
        };
      }
      if (linkErr && (linkErr.code === 'ENOTSUP' || linkErr.code === 'EPERM' || linkErr.code === 'EXDEV')) {
        if (fs.existsSync(destPath)) {
          fs.unlinkSync(tmpPath);
          return {
            status: 'skipped',
            reason: 'destination_exists',
            srcPath,
            destPath,
          };
        }
        fs.renameSync(tmpPath, destPath);
        placedAtDest = true;
      } else {
        throw linkErr;
      }
    }

    fs.unlinkSync(srcPath);

    return {
      status: 'moved',
      srcPath,
      destPath,
      size: srcStat.size,
    };
  } catch (err) {
    if (fs.existsSync(tmpPath)) {
      try {
        fs.unlinkSync(tmpPath);
      } catch (_) {
        // Ignore cleanup failure; primary error is reported below.
      }
    }

    if (placedAtDest) {
      err.message = `コピー先 (${destPath}) への作成には成功しましたが、移動元 (${srcPath}) の削除に失敗しました: ${err.message}`;
    }
    throw err;
  }
}

function listCurrentPdfs(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && isPdfFileName(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function formatPermissionHint(targetPath) {
  return [
    `ディレクトリへのアクセスがOSにより拒否されました: ${targetPath}`,
    'macOS で Box Drive (~/Library/CloudStorage/Box-Box) に直接アクセスするには権限が必要です。',
    'フルディスクアクセスを避けたい場合は、.gather.local.json を "mode": "shortcut" に設定し、macOS 純正「ショートカット」アプリ経由で実行してください。',
  ].join('\n');
}

function defaultListShortcuts() {
  const stdout = execFileSync('shortcuts', ['list'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function defaultRunShortcut(shortcutName) {
  return execFileSync('shortcuts', ['run', shortcutName], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function gatherViaShortcut(
  { shortcutName, destDir, dryRun = false },
  { listShortcuts = defaultListShortcuts, runShortcut = defaultRunShortcut } = {}
) {
  if (!shortcutName) {
    const err = new Error(
      `ショートカット名が設定されていません。.gather.local.json に "shortcutName" を設定するか、--shortcut または環境変数 GATHER_SHORTCUT_NAME を指定してください。`
    );
    err.code = 'MISSING_SHORTCUT_CONFIG';
    throw err;
  }

  let availableShortcuts;
  try {
    availableShortcuts = listShortcuts();
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      const cliErr = new Error('macOS の shortcuts コマンドが見つかりません (/usr/bin/shortcuts)。');
      cliErr.code = 'SHORTCUTS_CLI_NOT_FOUND';
      throw cliErr;
    }
    throw err;
  }

  if (!availableShortcuts.includes(shortcutName)) {
    const err = new Error(
      [
        `ショートカット "${shortcutName}" が見つかりません。`,
        `macOS 純正の「ショートカット」アプリで "${shortcutName}" を作成してから、もう一度 gather を実行してください。`,
      ].join('\n')
    );
    err.code = 'SHORTCUT_NOT_FOUND';
    throw err;
  }

  if (!dryRun) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const rawPdfsBefore = listCurrentPdfs(destDir);
  const beforeSet = new Set(rawPdfsBefore);

  let shortcutOutput = '';
  if (!dryRun) {
    try {
      shortcutOutput = (runShortcut(shortcutName) || '').trim();
    } catch (err) {
      const stderr = err && err.stderr ? String(err.stderr).trim() : '';
      const runErr = new Error(
        `ショートカット "${shortcutName}" の実行に失敗しました${stderr ? `: ${stderr}` : `: ${err.message}`}`
      );
      runErr.code = 'SHORTCUT_RUN_FAILED';
      throw runErr;
    }
  }

  const rawPdfsAfter = listCurrentPdfs(destDir);
  const newlyAdded = rawPdfsAfter.filter((name) => !beforeSet.has(name));

  return {
    mode: 'shortcut',
    shortcutName,
    sourceDir: null,
    destDir,
    dryRun,
    foundCount: dryRun ? null : newlyAdded.length,
    moved: newlyAdded.map((name) => ({
      relativeSource: name,
      destPath: path.join(destDir, name),
    })),
    skipped: [],
    failed: [],
    shortcutOutput,
    rawPdfsBefore,
    rawPdfsAfter,
  };
}

function gatherPdfs({ mode = 'direct', shortcutName = null, sourceDir, destDir, recursive = true, dryRun = false }, deps = {}) {
  if (mode === 'shortcut') {
    return gatherViaShortcut({ shortcutName, destDir, dryRun }, deps);
  }

  if (!sourceDir) {
    const err = new Error(
      `移動元ディレクトリが設定されていません。.gather.local.json に "sourceDir" を設定するか、--source または環境変数 GATHER_SOURCE_DIR を指定してください。`
    );
    err.code = 'MISSING_SOURCE_CONFIG';
    throw err;
  }

  let sourceStat;
  try {
    sourceStat = fs.statSync(sourceDir);
  } catch (err) {
    if (err && (err.code === 'EPERM' || err.code === 'EACCES')) {
      const permErr = new Error(formatPermissionHint(sourceDir));
      permErr.code = err.code;
      throw permErr;
    }
    if (err && err.code === 'ENOENT') {
      const notFoundErr = new Error(`移動元ディレクトリが見つかりません: ${sourceDir}`);
      notFoundErr.code = 'ENOENT';
      throw notFoundErr;
    }
    throw err;
  }

  if (!sourceStat.isDirectory()) {
    const err = new Error(`移動元パスはディレクトリではありません: ${sourceDir}`);
    err.code = 'ENOTDIR';
    throw err;
  }

  let pdfFiles;
  try {
    pdfFiles = findPdfFiles(sourceDir, { recursive });
  } catch (err) {
    if (err && (err.code === 'EPERM' || err.code === 'EACCES')) {
      const permErr = new Error(formatPermissionHint(sourceDir));
      permErr.code = err.code;
      throw permErr;
    }
    throw err;
  }

  if (!dryRun) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const moved = [];
  const skipped = [];
  const failed = [];
  const plannedDestNames = new Set();

  for (const srcPath of pdfFiles) {
    const relativeSource = path.relative(sourceDir, srcPath);
    const fileName = path.basename(srcPath);
    const destPath = path.join(destDir, fileName);

    if (dryRun) {
      if (fs.existsSync(destPath) || plannedDestNames.has(fileName)) {
        skipped.push({
          srcPath,
          relativeSource,
          destPath,
          reason: 'destination_exists',
        });
      } else {
        plannedDestNames.add(fileName);
        moved.push({
          srcPath,
          relativeSource,
          destPath,
          dryRun: true,
        });
      }
      continue;
    }

    try {
      const result = movePdfSafely(srcPath, destDir);
      if (result.status === 'moved') {
        moved.push({
          srcPath,
          relativeSource,
          destPath: result.destPath,
          size: result.size,
        });
      } else {
        skipped.push({
          srcPath,
          relativeSource,
          destPath: result.destPath,
          reason: result.reason,
        });
      }
    } catch (err) {
      failed.push({
        srcPath,
        relativeSource,
        destPath,
        code: err.code || null,
        error: err.message,
      });
    }
  }

  const rawPdfsAfter = listCurrentPdfs(destDir);

  return {
    mode: 'direct',
    shortcutName: null,
    sourceDir,
    destDir,
    recursive,
    dryRun,
    foundCount: pdfFiles.length,
    moved,
    skipped,
    failed,
    rawPdfsAfter,
  };
}

function printUsage() {
  console.log(`Usage: node scripts/gather_pdfs.js [options]

Options:
  --mode <mode>       Execution mode: "shortcut" (macOS Shortcuts) or "direct" (filesystem)
  --shortcut <name>   macOS Shortcut name to run (implies shortcut mode if --mode is omitted)
  --source <dir>      Source directory for direct mode (overrides .gather.local.json)
  --dest <dir>        Destination directory (default: ./raw_pdfs or .gather.local.json)
  --config <path>     Path to JSON config file (default: ./.gather.local.json)
  --dry-run           Verify configuration/target without moving files
  --no-recursive      Direct mode only: inspect top level of source directory
  --json              Output machine-readable JSON summary
  -h, --help          Show this help message`);
}

function printHumanSummary(summary) {
  const modeLabel = summary.dryRun ? '[DRY RUN] ' : '';
  console.log(`${modeLabel}PDF gather summary`);
  console.log(`  Mode:   ${summary.mode}`);
  if (summary.mode === 'shortcut') {
    console.log(`  Shortcut: ${summary.shortcutName}`);
    console.log(`  Dest:     ${summary.destDir}`);
    if (summary.dryRun) {
      console.log(`  Would run: shortcuts run "${summary.shortcutName}"`);
    } else if (summary.moved.length === 0) {
      console.log('  新しく raw_pdfs に追加されたPDFはありませんでした。');
    } else {
      console.log(`\nMoved / Added (${summary.moved.length}):`);
      for (const item of summary.moved) {
        console.log(`  - ${path.basename(item.destPath)}`);
      }
    }
    if (summary.shortcutOutput) {
      console.log(`\nShortcut output:\n  ${summary.shortcutOutput}`);
    }
  } else {
    console.log(`  Source: ${summary.sourceDir}`);
    console.log(`  Dest:   ${summary.destDir}`);
    console.log(`  Found:  ${summary.foundCount} PDF(s)`);

    if (summary.foundCount === 0) {
      console.log('  移動対象のPDFは見つかりませんでした。');
    }

    if (summary.moved.length > 0) {
      const verb = summary.dryRun ? 'Would move' : 'Moved';
      console.log(`\n${verb} (${summary.moved.length}):`);
      for (const item of summary.moved) {
        console.log(`  - ${item.relativeSource} -> ${path.basename(item.destPath)}`);
      }
    }

    if (summary.skipped.length > 0) {
      console.log(`\nSkipped (${summary.skipped.length}):`);
      for (const item of summary.skipped) {
        console.log(`  - ${item.relativeSource} (${item.reason}: ${path.basename(item.destPath)})`);
      }
    }

    if (summary.failed.length > 0) {
      console.log(`\nFailed (${summary.failed.length}):`);
      for (const item of summary.failed) {
        console.log(`  - ${item.relativeSource}: ${item.error}`);
      }
    }
  }

  console.log(`\nCurrent PDFs in ${summary.destDir} (${summary.rawPdfsAfter.length}):`);
  if (summary.rawPdfsAfter.length === 0) {
    console.log('  (none)');
  } else {
    for (const name of summary.rawPdfsAfter) {
      console.log(`  - ${name}`);
    }
  }
}

function main() {
  let cliOptions;
  try {
    cliOptions = parseArgs(process.argv.slice(2));
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }

  if (cliOptions.help) {
    printUsage();
    process.exit(0);
  }

  try {
    const config = loadConfig({
      cliOptions,
      configPath: cliOptions.configPath,
    });
    const summary = gatherPdfs(config);

    if (cliOptions.json) {
      console.log(JSON.stringify(summary, null, 2));
    } else {
      printHumanSummary(summary);
    }

    if (summary.failed.length > 0) {
      process.exit(1);
    }
  } catch (err) {
    if (cliOptions.json) {
      console.error(JSON.stringify({ error: err.message, code: err.code || null }, null, 2));
    } else {
      console.error(`Error: ${err.message}`);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  parseArgs,
  loadConfig,
  isPdfFileName,
  findPdfFiles,
  movePdfSafely,
  listCurrentPdfs,
  gatherViaShortcut,
  gatherPdfs,
};
