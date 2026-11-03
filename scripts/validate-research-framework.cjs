'use strict';

// This validates the scalar/array subset used here, not arbitrary YAML or runtime behavior.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const roots = ['Research Run', 'Research Auto'];
const rootChildren = ['Research Investigate', 'Implementation Lead', 'Experiment Lead', 'Literature Scout', 'Evidence Auditor', 'Experiment Designer', 'Reproducibility Engineer', 'Research Implementer', 'Experiment Runner', 'Critic', 'Debate Moderator', 'Explore'];
const expected = {
  'Research Run': rootChildren,
  'Research Auto': rootChildren,
  'Research Investigate': ['Explore', 'Critic', 'Literature Scout', 'Evidence Auditor', 'Experiment Designer', 'Reproducibility Engineer', 'Debate Moderator'],
  'Research Explore': ['Explore', 'Critic', 'Literature Scout', 'Evidence Auditor', 'Experiment Designer', 'Reproducibility Engineer', 'Research Investigate'],
  'Debate Moderator': ['Literature Scout', 'Evidence Auditor', 'Experiment Designer', 'Reproducibility Engineer', 'Critic'],
  'Implementation Lead': ['Explore', 'Reproducibility Engineer', 'Research Implementer', 'Critic'],
  'Experiment Lead': ['Experiment Designer', 'Experiment Runner', 'Evidence Auditor', 'Reproducibility Engineer'],
};
const builtins = new Set(['Explore']);
const executors = new Set(['Research Implementer', 'Experiment Runner']);
const fail = message => { throw new Error(message); };

function scalar(value) {
  if (value === 'true' || value === 'false') return value === 'true';
  if (value.startsWith('"')) return JSON.parse(value);
  if (value.startsWith("'")) {
    if (!value.endsWith("'")) fail(`Unclosed quote: ${value}`);
    return value.slice(1, -1).replace(/''/g, "'");
  }
  if (!value || /^(?:[>|{[&*!]|null$)/.test(value) || /\s#|:\s/.test(value)) {
    fail(`Unsupported scalar syntax (not validated): ${value}`);
  }
  return value;
}

function parseHeader(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  if (lines[0] !== '---') fail('Missing frontmatter opening');
  const end = lines.indexOf('---', 1);
  if (end < 0) fail('Missing frontmatter closing');
  const result = {};
  let arrayKey;
  for (const line of lines.slice(1, end)) {
    if (!line.trim()) continue;
    const item = line.match(/^  - (.+)$/);
    if (item && arrayKey) { result[arrayKey].push(scalar(item[1])); continue; }
    const field = line.match(/^([a-z][a-z-]*|applyTo):(?: (.*))?$/);
    if (!field) fail(`Unsupported frontmatter syntax (not validated): ${line}`);
    const [, key, raw] = field;
    if (Object.hasOwn(result, key)) fail(`Duplicate key: ${key}`);
    arrayKey = undefined;
    if (raw === undefined) { result[key] = []; arrayKey = key; }
    else if (raw.startsWith('[') && raw.endsWith(']')) {
      result[key] = raw.slice(1, -1).trim() ? raw.slice(1, -1).split(',').map(x => scalar(x.trim())) : [];
    } else result[key] = scalar(raw);
  }
  return result;
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

function validateGraph(roles) {
  const visiting = new Set();
  const visit = name => {
    if (builtins.has(name)) return 0;
    if (!roles.has(name)) fail(`Unknown child role: ${name}`);
    if (visiting.has(name)) fail(`Delegation cycle: ${name}`);
    visiting.add(name);
    const children = roles.get(name).agents;
    if (children.includes('*')) fail(`Unbounded child allowlist: ${name}`);
    for (const child of children) {
      if (!builtins.has(child) && roles.has(child) && roles.get(child)['disable-model-invocation'] !== false) {
        // A back-edge to the manual root remains a cycle, not a visibility failure.
        if (!visiting.has(child)) fail(`Role must be configured callable: ${child}`);
      }
    }
    const depth = children.length ? 1 + Math.max(...children.map(visit)) : 0;
    visiting.delete(name);
    return depth;
  };
  const depths = new Map([...roles.keys()].map(name => [name, visit(name)]));
  if ([...depths.values()].some(depth => depth > 3)) fail('Graph exceeds three delegation edges');
  return depths;
}

function validateExploration(roles) {
  const role = roles.get('Research Explore');
  if (!role || !role.agents.length || !role.tools.includes('agent') || role['user-invocable'] !== true || role['disable-model-invocation'] !== true) {
    fail('Research Explore must be a user-started entry with bounded delegation');
  }
}

function validateDirectoryLayout(records) {
  const expectedDirectories = new Map([
    ['entry', ['autonomous-research-orchestrator.agent.md', 'research-explore.agent.md', 'research-orchestrator.agent.md', 'research.agent.md']],
    ['coordination', ['debate-moderator.agent.md', 'experiment-lead.agent.md', 'implementation-lead.agent.md']],
    ['specialists', ['evidence-auditor.agent.md', 'experiment-designer.agent.md', 'experiment-runner.agent.md', 'literature-scout.agent.md', 'reproducibility-engineer.agent.md', 'research-implementer.agent.md']],
    ['inactive', ['method-lead.agent.md']],
  ]);
  const actual = new Map([...expectedDirectories.keys()].map(name => [name, []]));
  for (const { file, header } of records) {
    const relative = path.relative(path.join(root, 'agents/research'), file).split(path.sep);
    if (relative[0] in Object.fromEntries([...expectedDirectories.keys()].map(name => [name, true]))) {
      actual.get(relative[0]).push(relative.slice(1).join('/'));
    }
    if (header.name === 'Method Lead') {
      assert.deepEqual(relative, ['inactive', 'method-lead.agent.md'], 'Method Lead must remain inactive and unregistered as an active role');
      assert.equal(header['user-invocable'], false);
      assert.equal(header['disable-model-invocation'], true);
    }
  }
  for (const [directory, files] of expectedDirectories) {
    assert.deepEqual(actual.get(directory).sort(), files, `Unexpected files in research/${directory}`);
  }
  const rootLevel = records.filter(({ file }) => path.dirname(file) === path.join(root, 'agents/research'));
  assert.equal(rootLevel.length, 0, 'Legacy flat research Agent files must be migrated');
}

// These are static contract checks, not a simulation of Agent decisions or writes.
function validateResearchDelivery(files) {
  const get = name => {
    if (!files.has(name)) fail(`Missing delivery document: ${name}`);
    return files.get(name);
  };
  const requireText = (name, fragments) => {
    const text = get(name);
    for (const fragment of fragments) {
      if (!text.includes(fragment)) fail(`Missing delivery contract in ${name}: ${fragment}`);
    }
  };
  const entries = [
    'research-explore.agent.md', 'research.agent.md',
    'research-orchestrator.agent.md', 'autonomous-research-orchestrator.agent.md',
  ];
  for (const name of entries) requireText(`agents/research/entry/${name}`, [
    '../../../research-guides/proposal-delivery.md', '../../../research-guides/project-records.md',
  ]);
  requireText('research-guides/proposal-delivery.md', [
    '短查询', '必要子问题', '假设或探索目标', '证据要求与判读',
    '具体方法的交付内容', 'project-records.md', 'orchestration.md',
  ]);
  requireText('research-guides/project-records.md', [
    '单一课题且无既有约定', 'research/topic-a/brief.md', 'notes/study-a/index.md',
    '不预建空模板', 'method.md', 'methods/<method-id>.md', '每类当前正文只有一个权威位置',
    '同一课题', '实际路径独占写者',
  ]);
  requireText('research-guides/orchestration.md', [
    '| topic |', 'Research Auto 默认授权', '不是用户批准队列',
    '候选假设', '用户明确锁定的条件', 'proposal-delivery.md', 'method/methods',
  ]);
  const autoFile = 'agents/research/entry/autonomous-research-orchestrator.agent.md';
  requireText(autoFile, [
    'Research Auto 默认授权', '旧笔记未列逐项许可不是启动阻塞',
    '方法、候选假设和必要协议调整本身不是停止或索权条件',
    '宿主实际阻断', '用户明确锁定',
  ]);
  for (const name of [autoFile, 'research-guides/orchestration.md']) {
    if (/不能更换核心研究问题或已有假设|必须改变核心问题、已有假设、评价标准或数据规则|存在会改变研究含义的实质决策时才询问用户/.test(get(name))) {
      fail(`Obsolete Auto approval gate: ${name}`);
    }
  }
  for (const name of ['orchestration-record.md', 'experiment-run.md']) {
    requireText(`research-guides/templates/${name}`, ['课题', '入口', '方法', '默认授权']);
  }
  for (const name of ['research-entry', 'research-question', 'research-hypothesis', 'research-design']) {
    requireText(`skills/${name}/SKILL.md`, ['项目记录规范', 'Auto 委派时继承其默认授权']);
  }
}

function deliverySelfTest(files) {
  validateResearchDelivery(files);
  const guide = 'research-guides/proposal-delivery.md';
  const entry = 'agents/research/entry/research-explore.agent.md';
  const auto = 'agents/research/entry/autonomous-research-orchestrator.agent.md';
  const protocol = 'research-guides/orchestration.md';
  const missingGuide = new Map(files);
  missingGuide.delete(guide);
  assert.throws(() => validateResearchDelivery(missingGuide), /Missing delivery document/);
  const missingPointer = new Map(files);
  missingPointer.set(entry, files.get(entry).replace('../../../research-guides/proposal-delivery.md', 'missing-guide.md'));
  assert.throws(() => validateResearchDelivery(missingPointer), /Missing delivery contract/);
  for (const name of [auto, protocol]) {
    const staleGate = new Map(files);
    staleGate.set(name, `${files.get(name)}\n必须改变核心问题、已有假设、评价标准或数据规则\n`);
    assert.throws(() => validateResearchDelivery(staleGate), /Obsolete Auto approval gate/);
  }
  console.log('PASS: proposal/topic/method/default-authority static contracts, including 4 negative mutations');
}

function selfTest() {
  const fixture = new Map([
    ['Root', { agents: ['Lead'] }],
    ['Lead', { agents: ['Leaf'], 'disable-model-invocation': false }],
    ['Leaf', { agents: [], 'disable-model-invocation': false }],
  ]);
  validateGraph(fixture);
  assert.equal(parseHeader('---\nname: "Leaf"\nagents: []\nuser-invocable: false\n---').name, 'Leaf');
  assert.equal(parseHeader('---\napplyTo: "**"\n---').applyTo, '**');
  assert.throws(() => parseHeader('---\napplyTo: "**"\napplyTo: "*.md"\n---'), /Duplicate/);
  assert.throws(() => parseHeader('---\nname: A\nname: B\n---'), /Duplicate/);
  assert.throws(() => parseHeader('---\nname: >-\n  Folded\n---'), /Unsupported/);
  assert.throws(() => parseHeader('---\nname: A'), /closing/);
  assert.throws(() => validateGraph(new Map([...fixture, ['Leaf', { agents: ['Root'], 'disable-model-invocation': false }]])), /cycle/);
  assert.throws(() => validateGraph(new Map([...fixture, ['Leaf', { agents: ['Missing'], 'disable-model-invocation': false }]])), /Unknown/);
  assert.throws(() => validateGraph(new Map([...fixture, ['Leaf', { agents: ['*'], 'disable-model-invocation': false }]])), /Unbounded/);
  assert.throws(() => validateGraph(new Map([...fixture, ['Leaf', { agents: [], 'disable-model-invocation': true }]])), /callable/);
  const exploration = { agents: ['Leaf'], tools: ['read', 'agent'], 'user-invocable': true, 'disable-model-invocation': true };
  validateExploration(new Map([['Research Explore', exploration]]));
  assert.throws(() => validateExploration(new Map([['Research Explore', { ...exploration, agents: [], tools: ['read'] }]])), /user-started/);
  assert.throws(() => validateExploration(new Map([['Research Explore', { ...exploration, 'disable-model-invocation': false }]])), /user-started/);
  assert.throws(() => parseHeader('---\nagents:\n\t- Leaf\n---'), /Unsupported/);
  const tooDeep = new Map([...fixture, ['Leaf', { agents: ['Deep'], 'disable-model-invocation': false }], ['Deep', { agents: ['End'], 'disable-model-invocation': false }], ['End', { agents: [], 'disable-model-invocation': false }]]);
  assert.throws(() => validateGraph(tooDeep), /exceeds/);
  console.log('PASS: parser/graph/visibility self-checks, including 12 negative fixtures');
}

function main() {
  selfTest();
  const agentFiles = walk(path.join(root, 'agents')).filter(file => file.endsWith('.agent.md'));
  const roles = new Map();
  const records = [];
  for (const file of agentFiles) {
    const text = fs.readFileSync(file, 'utf8');
    const header = parseHeader(text);
    if (typeof header.name !== 'string' || !header.name || roles.has(header.name)) fail(`Missing/duplicate name: ${file}`);
    if (typeof header.description !== 'string' || !header.description.trim()) fail(`Missing description: ${file}`);
    for (const key of ['tools', 'agents']) {
      if (!Array.isArray(header[key]) || !header[key].every(x => typeof x === 'string')) fail(`Invalid ${key}: ${file}`);
    }
    for (const key of ['user-invocable', 'disable-model-invocation']) {
      if (typeof header[key] !== 'boolean') fail(`Invalid ${key}: ${file}`);
    }
    if (header.agents.length && !header.tools.includes('agent')) fail(`Children without agent tool: ${header.name}`);
    if (!header.agents.length && header.tools.includes('agent')) fail(`Leaf exposes agent tool: ${header.name}`);
    roles.set(header.name, header);
    records.push({ file, text, header });
  }
  const depths = validateGraph(roles);
  validateExploration(roles);
  for (const [name, children] of Object.entries(expected)) {
    assert.deepEqual(roles.get(name)?.agents, children, `Unexpected allowed edges for ${name}`);
  }
  const userEntries = [...roots, 'Research Explore'];
  for (const name of [...Object.keys(expected).filter(x => !userEntries.includes(x) && x !== 'Research Investigate'), ...executors]) {
    const header = roles.get(name);
    assert.equal(header?.['user-invocable'], false, `${name} must be hidden`);
    assert.equal(header?.['disable-model-invocation'], false, `${name} must be callable`);
    if (header.model !== undefined) fail(`Unexpected fixed model on ${name}`);
  }
  for (const name of userEntries) {
    assert.equal(roles.get(name)['user-invocable'], true, `${name} must be user-selectable`);
    assert.equal(roles.get(name)['disable-model-invocation'], true, `${name} must be user-started only`);
  }
  const coordinator = roles.get('Research Investigate');
  assert.equal(coordinator['user-invocable'], true);
  assert.equal(coordinator['disable-model-invocation'], false);
  for (const name of roots) assert.equal(depths.get(name), 3, `${name} must account for the bounded Moderator path`);
  validateDirectoryLayout(records);
  for (const { header } of records) if (header.model !== undefined) fail(`Unexpected fixed model: ${header.name}`);
  for (const name of executors) {
    assert.deepEqual(roles.get(name).agents, []);
    if (!roles.get(name).tools.includes('execute') || !roles.get(name).tools.includes('edit')) fail(`Missing executor tools: ${name}`);
  }
  for (const name of ['Experiment Lead', 'Implementation Lead', 'Debate Moderator']) {
    if (roles.get(name).tools.includes('edit')) fail(`Lead may not rewrite shared state: ${name}`);
  }
  const protocolUsers = new Set([...roots, 'Research Investigate', 'Implementation Lead', 'Experiment Lead', ...executors]);
  for (const { text, header, file } of records) {
    const depth = path.relative(root, path.dirname(file)).split(path.sep).length;
    const prefix = '../'.repeat(depth);
    if (protocolUsers.has(header.name) && !text.includes(`${prefix}research-guides/orchestration.md`)) fail(`Missing protocol entry: ${header.name}`);
  }
  const instructionRecords = walk(path.join(root, 'instructions')).filter(file => file.endsWith('.instructions.md')).map(file => {
    const text = fs.readFileSync(file, 'utf8');
    const header = parseHeader(text);
    if (typeof header.description !== 'string' || !header.description.trim()) fail(`Missing instruction description: ${file}`);
    if (header.applyTo !== undefined && typeof header.applyTo !== 'string') fail(`Unsupported instruction applyTo: ${file}`);
    return { file, text, header };
  });
  const engineering = instructionRecords.find(record => path.basename(record.file) === 'engineering.instructions.md');
  for (const [filename, name] of [['experiment-comparison.instructions.md', 'Experiment Comparison'], ['experiment-execution.instructions.md', 'Experiment Execution']]) {
    const record = instructionRecords.find(item => path.basename(item.file) === filename);
    assert.equal(record?.header.name, name, `Missing experiment instruction: ${filename}`);
    assert.equal(record.header.applyTo, undefined, `Experiment instruction should use task relevance: ${filename}`);
    if (!engineering?.text.includes(`](${filename})`)) fail(`Missing engineering policy pointer: ${filename}`);
    for (const role of ['Experiment Lead', 'Experiment Runner']) {
      if (!records.find(item => item.header.name === role)?.text.includes(`../../../instructions/${filename}`)) fail(`Missing experiment policy pointer on ${role}: ${filename}`);
    }
    const policy = fs.readFileSync(path.join(root, 'research-guides/orchestration.md'), 'utf8');
    if (!policy.includes(`../instructions/${filename}`)) fail(`Missing protocol policy pointer: ${filename}`);
  }
  const docs = [...records, ...instructionRecords, ...walk(path.join(root, 'research-guides')).filter(file => file.endsWith('.md')).map(file => ({ file, text: fs.readFileSync(file, 'utf8') })),
    ...['research-entry', 'research-question', 'research-hypothesis', 'research-design'].flatMap(name =>
      walk(path.join(root, 'skills', name)).filter(file => file.endsWith('.md')).map(file => ({ file, text: fs.readFileSync(file, 'utf8') }))),
    ...['COPILOT_USER_LAYER_SPEC.md', 'docs/research-orchestration-validation.md', 'docs/research-agent-collaboration-plan.md', 'docs/agent-content-review.md', 'docs/skill-validation.md', 'docs/discussions/research-proposal-and-record-layout.md', 'docs/discussions/archive/research-proposal-and-record-layout.md'].map(name => {
      const file = path.join(root, name); return { file, text: fs.readFileSync(file, 'utf8') };
    })];
  deliverySelfTest(new Map(docs.map(({ file, text }) => [path.relative(root, file).split(path.sep).join('/'), text])));
  let links = 0;
  for (const { file, text } of docs) {
    if (/[^\S\r\n]+$/m.test(text)) fail(`Trailing whitespace: ${file}`);
    for (const match of text.matchAll(/\[[^\]\n]*\]\(([^)\s]+)\)/g)) {
      const link = match[1];
      if (/^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(link)) continue;
      const target = decodeURIComponent(link.split('#')[0]);
      if (!target) continue;
      if (!fs.existsSync(path.resolve(path.dirname(file), target))) fail(`Broken link in ${file}: ${link}`);
      links += 1;
    }
  }
  console.log(`PASS: ${agentFiles.length} agents, restricted frontmatter syntax and required fields`);
  console.log('PASS: research Agent directory layout, no legacy flat files, and inactive Method Lead isolation');
  console.log('PASS: approved allowlists, no cycles/wildcards, maximum three delegation edges including Moderator, leaf/tool and visibility constraints');
  console.log(`PASS: ${instructionRecords.length} user instructions, frontmatter, task-scoped experiment policies and engineering/worker/protocol pointers`);
  console.log(`PASS: ${docs.length} documents, ${links} local file links, protocol entry references and whitespace`);
  console.log('NOT TESTED: arbitrary YAML, tool discovery, semantic permission enforcement, concurrent locking, live nesting or scientific efficacy');
}

try { main(); } catch (error) { console.error(`FAIL: ${error.message}`); process.exitCode = 1; }