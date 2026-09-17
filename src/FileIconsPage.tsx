import {useMemo, useState, type ReactElement} from 'react';

type FileKind =
  | 'folder'
  | 'pdf'
  | 'ppt'
  | 'excel'
  | 'doc'
  | 'figma'
  | 'msg'
  | 'code'
  | 'img'
  | 'video'
  | 'sound'
  | 'other'
  | 'web';

type FileNode = {
  id: string;
  name: string;
  kind: FileKind;
  contract: string;
  party: string;
  concept: string;
  children?: FileNode[];
};

const ICONS = '/icons/files';

const FILE_SRC: Record<Exclude<FileKind, 'folder'>, string> = {
  pdf: `${ICONS}/pdf.svg`,
  ppt: `${ICONS}/ppt.svg`,
  excel: `${ICONS}/excel.svg`,
  doc: `${ICONS}/doc.svg`,
  figma: `${ICONS}/figma.svg`,
  msg: `${ICONS}/msg.svg`,
  code: `${ICONS}/code.svg`,
  img: `${ICONS}/img.png`,
  video: `${ICONS}/video.png`,
  sound: `${ICONS}/sound.svg`,
  other: `${ICONS}/other.svg`,
  web: `${ICONS}/web.svg`,
};

const BOXED: FileKind[] = ['sound', 'other', 'web'];
const THUMBS: FileKind[] = ['img', 'video'];

const CONTRACTS = [
  'Service Agreement',
  'Software License and Maintenance',
  'Mutual Technology Partnership NDA',
  'Employment Agreement',
  'Master Service Agreement',
  'Professional Consulting Agreement',
  'Strategic Partnership Agreement',
  'Confidentiality Agreement',
  'Employment Terms and Conditions',
  'Procurement Contract',
  'Vendor Agreement',
  'Software Licensing Terms',
  'Partnership Agreement',
  'Consulting Contract',
];

const PARTIES = [
  'TechFlow Solutions Inc.',
  'CloudWorks Systems',
  'DataSync Corporation',
  'InnovateCorp LLC',
  'GlobalTech Enterprises',
  'Digital Dynamics Ltd.',
  'NextGen Technologies',
  'StreamLine Solutions',
  'TechVision Corp.',
  'InnovateFirst LLC',
  'DataBridge Systems',
  'CloudCore Technologies',
  'TechAdvantage Inc.',
  'DigitalWave Solutions',
];

const CONCEPTS = [
  'Defines the scope of services, delivery timelines, and acceptance criteria.',
  'Grants a software license and outlines ongoing maintenance obligations.',
  'Establishes mutual confidentiality obligations between the parties.',
  'Sets out role responsibilities, compensation, and termination terms.',
  'Establishes the overarching terms governing the commercial relationship.',
  'Outlines consulting deliverables, engagement length, and fees.',
  'Defines shared objectives, responsibilities, and joint go-to-market work.',
  'Protects proprietary information exchanged during the engagement.',
  'Details compensation, benefits, and equity terms for the role.',
  'Specifies purchasing terms, delivery requirements, and warranties.',
  'Establishes standard terms for the ongoing vendor relationship.',
  'Defines usage rights, restrictions, and support commitments.',
  'Outlines each party’s contributions, responsibilities, and IP ownership.',
  'Defines the scope of consulting work, timelines, and reporting.',
];

const KINDS: Exclude<FileKind, 'folder'>[] = [
  'pdf',
  'doc',
  'excel',
  'ppt',
  'figma',
  'msg',
  'code',
  'img',
  'video',
  'sound',
  'other',
  'web',
];

const EXT: Record<Exclude<FileKind, 'folder'>, string> = {
  pdf: 'pdf',
  ppt: 'pptx',
  excel: 'xlsx',
  doc: 'docx',
  figma: 'fig',
  msg: 'eml',
  code: 'js',
  img: 'jpg',
  video: 'mp4',
  sound: 'mp3',
  other: 'zip',
  web: 'html',
};

function meta(i: number) {
  return {
    contract: CONTRACTS[i % CONTRACTS.length],
    party: PARTIES[i % PARTIES.length],
    concept: CONCEPTS[i % CONCEPTS.length],
  };
}

function leaf(id: string, name: string, kind: Exclude<FileKind, 'folder'>, i: number): FileNode {
  return {id, name, kind, ...meta(i)};
}

function files(prefix: string, count: number, seed: number): FileNode[] {
  return Array.from({length: count}, (_, i) => {
    const kind = KINDS[(seed + i) % KINDS.length];
    const n = String(i + 1).padStart(2, '0');
    return leaf(`${prefix}-${n}`, `${prefix}_${n}.${EXT[kind]}`, kind, seed + i);
  });
}

function folder(id: string, name: string, children: FileNode[], i = 0): FileNode {
  return {id, name, kind: 'folder', children, ...meta(i)};
}

const FILE_TREE: FileNode[] = [
  folder('contracts', 'Contracts', [
    leaf('c-pdf', 'Contract_Agreement.pdf', 'pdf', 0),
    leaf('c-doc', 'Board_Notes.docx', 'doc', 1),
    leaf('c-xls', 'Q1_Budget.xlsx', 'excel', 2),
    folder('c-exec', 'Executed copies', [
      leaf('c-exec-1', 'MSA_Executed.pdf', 'pdf', 3),
      leaf('c-exec-2', 'SOW_Amendment.docx', 'doc', 4),
      folder('c-exec-wet', 'Wet ink scans', [
        leaf('c-exec-3', 'Signature_Page.pdf', 'pdf', 5),
        leaf('c-exec-4', 'Notary_Stamp.jpg', 'img', 6),
        leaf('c-exec-5', 'Signing_Video.mp4', 'video', 7),
      ], 8),
      ...files('Exhibit', 8, 9),
    ], 10),
    folder('c-drafts', 'Drafts', files('Draft_Contract', 12, 20), 21),
    folder('c-redlines', 'Redlines', [
      leaf('c-rl-1', 'Vendor_Redline.docx', 'doc', 22),
      leaf('c-rl-2', 'Playbook_Markup.pdf', 'pdf', 23),
      leaf('c-rl-3', 'Compare_Notes.txt', 'other', 24),
      ...files('Redline', 6, 25),
    ], 26),
  ], 0),
  folder('finance', 'Financial Reports', [
    folder('fin-q', 'Quarterly packs', files('Q_Pack', 10, 30), 31),
    folder('fin-audit', 'Audit support', [
      leaf('fin-1', 'Financial_Model.xlsx', 'excel', 32),
      leaf('fin-2', 'Audit_Letter.pdf', 'pdf', 33),
      leaf('fin-3', 'Walkthrough.mp4', 'video', 34),
      folder('fin-work', 'Workpapers', files('WP', 9, 35), 36),
    ], 37),
    ...files('Finance', 7, 40),
  ], 4),
  folder('marketing', 'Marketing Assets', [
    leaf('m-img', 'Product_Photo.jpg', 'img', 6),
    leaf('m-vid', 'Demo_Walkthrough.mp4', 'video', 7),
    leaf('m-ppt', 'Sales_Deck.pptx', 'ppt', 8),
    folder('m-brand', 'Brand kit', [
      leaf('m-b1', 'Logo_Lockups.fig', 'figma', 9),
      leaf('m-b2', 'Brand_Guide.pdf', 'pdf', 10),
      leaf('m-b3', 'Hero_Still.jpg', 'img', 11),
      folder('m-brand-old', 'Archived brands', files('Legacy_Brand', 5, 50), 12),
    ], 13),
    folder('m-campaigns', 'Campaigns', [
      folder('m-c-q1', 'Q1 launch', files('Q1_Launch', 8, 55), 14),
      folder('m-c-q2', 'Q2 nurture', files('Q2_Nurture', 8, 63), 15),
      leaf('m-c-html', 'Landing_Page.html', 'web', 16),
    ], 17),
    ...files('Creative', 6, 70),
  ], 5),
  folder('archived', 'Archived Files', [
    folder('arch-2019', '2019', files('Archive_2019', 10, 80), 18),
    folder('arch-2020', '2020', files('Archive_2020', 10, 90), 19),
    folder('arch-2021', '2021', [
      folder('arch-2021-legal', 'Legal hold', files('Hold', 7, 100), 20),
      ...files('Archive_2021', 6, 107),
    ], 21),
    ...files('Cold_Storage', 5, 113),
  ], 9),
  folder('eng', 'Engineering Docs', [
    leaf('e-js', 'build_script.js', 'code', 11),
    leaf('e-fig', 'Wireframes.fig', 'figma', 12),
    leaf('e-doc', 'Team_Update.docx', 'doc', 13),
    folder('e-specs', 'Specs', files('Spec', 11, 120), 22),
    folder('e-api', 'API', [
      leaf('e-api-1', 'OpenAPI.yaml', 'other', 23),
      leaf('e-api-2', 'Auth_Flow.html', 'web', 24),
      folder('e-api-sdk', 'SDK samples', files('SDK', 8, 130), 25),
    ], 26),
    folder('e-recordings', 'Standup recordings', files('Standup', 9, 138), 27),
  ], 10),
  folder('hr', 'HR Records', [
    folder('hr-offer', 'Offer letters', files('Offer', 8, 150), 28),
    folder('hr-policy', 'Policies', files('Policy', 7, 158), 29),
    leaf('hr-xls', 'Headcount.xlsx', 'excel', 30),
    leaf('hr-pdf', 'Handbook.pdf', 'pdf', 31),
    ...files('HR_Misc', 6, 165),
  ], 12),
  folder('meetings', 'Meeting Notes', [
    leaf('mt-eml', 'Client_Thread.eml', 'msg', 16),
    leaf('mt-mp3', 'Interview_Recording.mp3', 'sound', 17),
    leaf('mt-pdf', 'Final_Report.pdf', 'pdf', 18),
    folder('mt-board', 'Board', files('Board_Minutes', 8, 170), 32),
    folder('mt-client', 'Client calls', [
      leaf('mt-c1', 'Kickoff.mp4', 'video', 33),
      leaf('mt-c2', 'Weekly_Sync.mp3', 'sound', 34),
      leaf('mt-c3', 'Follow_Up.eml', 'msg', 35),
      folder('mt-client-q', 'Q&A transcripts', files('QA', 7, 180), 36),
    ], 37),
    ...files('Notes', 5, 187),
  ], 13),
  folder('diligence', 'Due Diligence', [
    folder('dd-corp', 'Corporate', files('Corp', 9, 192), 38),
    folder('dd-ip', 'IP', files('IP', 9, 201), 39),
    folder('dd-lit', 'Litigation', [
      folder('dd-lit-open', 'Open matters', files('Open_Matter', 8, 210), 40),
      folder('dd-lit-closed', 'Closed matters', files('Closed_Matter', 8, 218), 41),
    ], 42),
    leaf('dd-nda', 'NDA_Template.docx', 'doc', 43),
    leaf('dd-pdf', 'Signed_Agreement.pdf', 'pdf', 44),
    ...files('DD_Index', 6, 226),
  ], 1),
  folder('clients', 'Client workspaces', [
    folder('cl-acme', 'Acme Corp', files('Acme', 10, 232), 45),
    folder('cl-north', 'Northstar', files('Northstar', 10, 242), 46),
    folder('cl-horizon', 'Horizon', [
      folder('cl-h-deal', 'Deal room', files('Horizon_Deal', 9, 252), 47),
      ...files('Horizon', 6, 261),
    ], 48),
  ], 49),
  folder('knowledge', 'Knowledge exports', [
    leaf('k-1', 'Playbook.html', 'web', 50),
    leaf('k-2', 'Clause_Library.zip', 'other', 51),
    leaf('k-3', 'Export_Notes.txt', 'other', 52),
    folder('k-runs', 'Twin runs', files('Twin_Run', 12, 270), 53),
    ...files('Knowledge', 6, 282),
  ], 54),
];

const DEFAULT_OPEN = new Set([
  'contracts',
  'c-exec',
  'marketing',
  'eng',
  'meetings',
  'diligence',
]);

function clsx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

function countFiles(nodes: FileNode[]): number {
  return nodes.reduce((sum, node) => {
    if (node.kind === 'folder') {
      return sum + countFiles(node.children ?? []);
    }
    return sum + 1;
  }, 0);
}

type FlatRow = {node: FileNode; depth: number};

function flatten(nodes: FileNode[], open: Set<string>, depth = 0): FlatRow[] {
  return nodes.flatMap((node) => {
    const row: FlatRow = {node, depth};
    if (node.kind === 'folder' && open.has(node.id) && node.children?.length) {
      return [row, ...flatten(node.children, open, depth + 1)];
    }
    return [row];
  });
}

function FilesCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}): ReactElement {
  return (
    <label className="files-check">
      <input type="checkbox" checked={checked} onChange={onChange} aria-label={label} />
      <span className="files-check__box" aria-hidden="true">
        {checked ? <img src={`${ICONS}/check.svg`} alt="" /> : null}
      </span>
    </label>
  );
}

function FilesChevron({open}: {open: boolean}): ReactElement {
  return (
    <span className={clsx('files-chevron', open && 'is-open')} aria-hidden="true">
      <span className="proto-stroke-icon proto-stroke-icon--lucide" style={{width: 16, height: 16}}>
        <svg viewBox="0 0 24 24" fill="none">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </span>
  );
}

function ShellIcon({name, size}: {name: string; size: number}): ReactElement {
  return (
    <span className="files-shell-icon" style={{width: size, height: size}} aria-hidden="true">
      <img src={`${ICONS}/shell/${name}.svg`} alt="" width={size} height={size} />
    </span>
  );
}

function FileTypeIcon({kind, open}: {kind: FileKind; open?: boolean}): ReactElement {
  if (kind === 'folder') {
    return (
      <span className="files-icon files-icon--folder" aria-hidden="true">
        <img
          className={open ? 'files-folder files-folder--open' : 'files-folder files-folder--closed'}
          src={open ? `${ICONS}/folder-open.svg` : `${ICONS}/folder.svg`}
          width={open ? 15.6 : 14.37}
          height={12.19}
          alt=""
        />
      </span>
    );
  }
  if (THUMBS.includes(kind)) {
    return (
      <span className="files-thumb" aria-hidden="true">
        <img src={FILE_SRC[kind]} alt="" />
      </span>
    );
  }
  if (BOXED.includes(kind)) {
    return (
      <span className="files-glyph" aria-hidden="true">
        <img src={FILE_SRC[kind]} alt="" />
      </span>
    );
  }
  return (
    <span className="files-icon" aria-hidden="true">
      <img src={FILE_SRC[kind]} alt="" />
    </span>
  );
}

export default function FileIconsPage(): ReactElement {
  const [open, setOpen] = useState<Set<string>>(() => new Set(DEFAULT_OPEN));
  const [selected, setSelected] = useState<Set<string>>(() => new Set(['contracts']));
  const [shellTab, setShellTab] = useState<'tables' | 'sources' | 'configure'>('sources');

  const rows = useMemo(() => flatten(FILE_TREE, open), [open]);
  const fileCount = useMemo(() => countFiles(FILE_TREE), []);
  const visibleIds = useMemo(() => rows.map((row) => row.node.id), [rows]);
  const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => selected.has(id));

  const toggleFolder = (id: string) => {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelected = (id: string) => {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAllVisible = () => {
    setSelected((current) => {
      if (allVisibleSelected) {
        const next = new Set(current);
        for (const id of visibleIds) {
          next.delete(id);
        }
        return next;
      }
      const next = new Set(current);
      for (const id of visibleIds) {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="files-page">
      <div className="files-shell">
        <header className="files-shell__header">
          <div className="files-shell__title-block">
            <div className="files-crumb">
              <ShellIcon name="file-pen" size={20} />
              <span>Knowledge: Executed Contracts</span>
              <span className="files-crumb__sep">/</span>
            </div>
            <h1 className="files-shell__title">Sales Insights</h1>
          </div>
          <div className="files-shell__tabs-row">
            <div className="proto-tabs" role="tablist" aria-label="Workspace">
              <button
                className={clsx('proto-tab', shellTab === 'tables' && 'is-active')}
                type="button"
                onClick={() => setShellTab('tables')}
              >
                <ShellIcon name="table" size={16} />
                Tables
              </button>
              <button
                className={clsx('proto-tab', shellTab === 'sources' && 'is-active')}
                type="button"
                onClick={() => setShellTab('sources')}
              >
                <ShellIcon name="files" size={16} />
                <span>Sources</span>
                <span className="files-tab-count"> • {fileCount.toLocaleString()}</span>
              </button>
              <button
                className={clsx('proto-tab', shellTab === 'configure' && 'is-active')}
                type="button"
                onClick={() => setShellTab('configure')}
              >
                <ShellIcon name="settings" size={16} />
                Configure
              </button>
            </div>
            <div className="files-shell__actions">
              <button className="files-assistant" type="button">
                <ShellIcon name="ask-ai" size={16} />
                Assistant
              </button>
              <button className="files-icon-btn" type="button" aria-label="More">
                <ShellIcon name="ellipsis" size={16} />
              </button>
            </div>
          </div>
        </header>
        <div className="files-shell__body">
          <div className="files-card">
            <header className="files-header">
              <h2 className="files-title">Sales Insights</h2>
              <p className="files-count"> • {fileCount.toLocaleString()} files</p>
              <div className="files-toolbar">
                <button className="files-zoom" type="button">
                  100%
                  <ShellIcon name="chevron-down" size={16} />
                </button>
                <button className="files-ghost" type="button">
                  <ShellIcon name="columns" size={16} />
                  Columns
                </button>
                <button className="files-ghost" type="button">
                  <ShellIcon name="group" size={16} />
                  Group by
                </button>
                <button className="files-ghost" type="button">
                  <ShellIcon name="wrap" size={16} />
                  Wrap text
                </button>
                <button className="files-icon-btn" type="button" aria-label="Table more">
                  <ShellIcon name="ellipsis" size={16} />
                </button>
              </div>
            </header>
            <div className="files-table" role="treegrid" aria-label="Sales Insights files">
              <div className="files-row files-row--head">
                <FilesCheckbox
                  checked={allVisibleSelected}
                  onChange={toggleAllVisible}
                  label="Select all visible rows"
                />
                <span className="files-col files-col--name">Document name</span>
                <span className="files-col">Contract name</span>
                <span className="files-col">Party 1 name</span>
                <span className="files-col">Extracted Concept</span>
              </div>
              {rows.map(({node, depth}) => {
                const isFolder = node.kind === 'folder';
                const isOpen = open.has(node.id);
                return (
                  <div
                    key={node.id}
                    className={clsx('files-row', selected.has(node.id) && 'is-selected')}
                    role="row"
                    aria-expanded={isFolder ? isOpen : undefined}
                    aria-level={depth + 1}
                  >
                    <div onClick={(event) => event.stopPropagation()}>
                      <FilesCheckbox
                        checked={selected.has(node.id)}
                        onChange={() => toggleSelected(node.id)}
                        label={`Select ${node.name}`}
                      />
                    </div>
                    <button
                      className="files-name"
                      type="button"
                      style={{paddingLeft: 8 + depth * 24}}
                      onClick={() => (isFolder ? toggleFolder(node.id) : toggleSelected(node.id))}
                    >
                      {isFolder ? <FilesChevron open={isOpen} /> : <span className="files-chevron is-leaf" />}
                      <FileTypeIcon kind={node.kind} open={isOpen} />
                      <span className="files-name__text">{node.name}</span>
                    </button>
                    <span className="files-col">{node.contract}</span>
                    <span className="files-col">{node.party}</span>
                    <span className="files-col">{node.concept}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
