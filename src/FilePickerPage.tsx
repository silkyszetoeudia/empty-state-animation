import {useEffect, useMemo, useRef, useState, type ReactElement} from 'react';
import './file-picker.css';

type Kind = 'folder' | 'pdf' | 'email' | 'video' | 'image' | 'audio';
type Thumb = 'nda' | 'deposition' | 'video' | 'forest' | 'email' | 'audio' | 'folder';
type SortKey = 'name' | 'type' | 'size' | 'modified' | 'author';
type PickerTab = 'sources' | 'smart';

type FileNode = {
  id: string;
  name: string;
  kind: Kind;
  modified: string;
  author: string;
  size?: string;
  bytes?: number;
  pages?: number;
  duration?: string;
  thumb?: Thumb;
  children?: FileNode[];
};

const ASSET = '/file-picker';
const TYPE_LABEL: Record<Kind, string> = {
  folder: 'Folder',
  pdf: 'PDF',
  email: 'Email',
  video: 'Video',
  image: 'Image',
  audio: 'Audio',
};
const TYPE_DETAIL: Record<Kind, string> = {
  folder: 'Folder',
  pdf: 'PDF document',
  email: 'Email',
  video: 'Video',
  image: 'Image',
  audio: 'Audio',
};

const AUTHORS = ['Morgan Lee', 'Sam Rivera', 'Priya Shah'];

function file(
  partial: Omit<FileNode, 'modified' | 'author'> & {modified?: string; author?: string},
): FileNode {
  return {
    modified: 'Sep 12, 2026',
    author: 'Morgan Lee',
    ...partial,
  };
}

function generated(folderId: string, count: number, prefix: string, author: string): FileNode[] {
  return Array.from({length: count}, (_, index) => {
    const n = String(index + 1).padStart(2, '0');
    return file({
      id: `${folderId}-${n}`,
      name: `${prefix}_${n}.pdf`,
      kind: 'pdf',
      thumb: index % 2 === 0 ? 'nda' : 'deposition',
      size: `${(1.1 + (index % 5) * 0.3).toFixed(1)} MB`,
      bytes: Math.round((1.1 + (index % 5) * 0.3) * 1_000_000),
      pages: 4 + (index % 12),
      modified: `Aug ${10 + (index % 18)}, 2026`,
      author: AUTHORS[index % AUTHORS.length] ?? author,
    });
  });
}

const WITNESS_NAMED: FileNode[] = [
  file({
    id: 'stmt-chen',
    name: 'Statement_M_Chen_2024.pdf',
    kind: 'pdf',
    thumb: 'nda',
    size: '1.8 MB',
    bytes: 1_800_000,
    pages: 12,
    modified: 'Sep 2, 2026',
    author: 'Morgan Lee',
  }),
  file({
    id: 'stmt-okafor',
    name: 'Statement_R_Okafor_2024.pdf',
    kind: 'pdf',
    thumb: 'deposition',
    size: '2.1 MB',
    bytes: 2_100_000,
    pages: 9,
    modified: 'Aug 30, 2026',
    author: 'Sam Rivera',
  }),
  file({
    id: 'interview-audio',
    name: 'Interview_audio_0211.m4a',
    kind: 'audio',
    thumb: 'audio',
    size: '6 MB',
    bytes: 6_000_000,
    duration: '11:02',
    modified: 'Aug 21, 2026',
    author: 'Priya Shah',
  }),
];

const EXPERT_NAMED: FileNode[] = [
  file({
    id: 'expert-hale',
    name: 'Expert_report_Hale.pdf',
    kind: 'pdf',
    thumb: 'deposition',
    size: '1.8 MB',
    bytes: 1_800_000,
    pages: 22,
    modified: 'Aug 25, 2026',
    author: 'Sam Rivera',
  }),
];

const TREE: FileNode = file({
  id: 'root',
  name: 'Original sources',
  kind: 'folder',
  children: [
    file({
      id: 'discovery',
      name: 'Discovery',
      kind: 'folder',
      children: [
        file({
          id: 'depositions',
          name: 'Depositions',
          kind: 'folder',
          children: [
            file({
              id: 'witness',
              name: 'Witness statements',
              kind: 'folder',
              thumb: 'folder',
              modified: 'Sep 18, 2026',
              author: 'Morgan Lee',
              children: [...WITNESS_NAMED, ...generated('witness', 21, 'Witness_statement', 'Morgan Lee')],
            }),
            file({
              id: 'expert',
              name: 'Expert reports',
              kind: 'folder',
              thumb: 'folder',
              modified: 'Sep 15, 2026',
              author: 'Sam Rivera',
              children: [
                ...EXPERT_NAMED,
                file({
                  id: 'hale',
                  name: 'Hale, R.',
                  kind: 'folder',
                  thumb: 'folder',
                  modified: 'Sep 14, 2026',
                  author: 'Sam Rivera',
                  children: generated('hale', 12, 'Hale_exhibit', 'Sam Rivera'),
                }),
                file({
                  id: 'site',
                  name: 'Site inspection',
                  kind: 'folder',
                  thumb: 'folder',
                  modified: 'Aug 28, 2026',
                  author: 'Priya Shah',
                  children: [
                    file({
                      id: 'site-notes',
                      name: 'Site_notes.pdf',
                      kind: 'pdf',
                      thumb: 'nda',
                      size: '0.8 MB',
                      bytes: 800_000,
                      pages: 6,
                      author: 'Priya Shah',
                    }),
                    file({
                      id: 'site-photo-2',
                      name: 'Site_photo_02.jpg',
                      kind: 'image',
                      thumb: 'forest',
                      size: '3.2 MB',
                      bytes: 3_200_000,
                      author: 'Priya Shah',
                    }),
                  ],
                }),
                ...generated('expert', 6, 'Expert_report', 'Sam Rivera'),
              ],
            }),
            file({
              id: 'nda',
              name: 'TechCorp_NDA_executed_2023.pdf',
              kind: 'pdf',
              thumb: 'nda',
              size: '2.4 MB',
              bytes: 2_400_000,
              pages: 18,
              modified: 'Sep 12, 2026',
              author: 'Morgan Lee',
            }),
            file({
              id: 'alvarez',
              name: 'Deposition_J_Alvarez_2024.pdf',
              kind: 'pdf',
              thumb: 'deposition',
              size: '2.4 MB',
              bytes: 2_400_000,
              pages: 18,
              modified: 'Sep 10, 2026',
              author: 'Priya Shah',
            }),
            file({
              id: 'email',
              name: 'Re: Deposition schedule.eml',
              kind: 'email',
              thumb: 'email',
              size: '0.2 MB',
              bytes: 200_000,
              modified: 'Sep 9, 2026',
              author: 'Sam Rivera',
            }),
            file({
              id: 'video',
              name: 'Deposition_video_day1.mp4',
              kind: 'video',
              thumb: 'video',
              size: '15.5 MB',
              bytes: 15_500_000,
              duration: '02:26',
              modified: 'Sep 3, 2026',
              author: 'Morgan Lee',
            }),
            file({
              id: 'photo',
              name: 'Exhibit_14_site_photo.jpg',
              kind: 'image',
              thumb: 'forest',
              size: '4 MB',
              bytes: 4_000_000,
              modified: 'Aug 28, 2026',
              author: 'Priya Shah',
            }),
            file({
              id: 'audio',
              name: 'Hearing_audio_0312.m4a',
              kind: 'audio',
              thumb: 'audio',
              size: '4 MB',
              bytes: 4_000_000,
              duration: '16:45',
              modified: 'Aug 21, 2026',
              author: 'Morgan Lee',
            }),
            file({
              id: 'transcript',
              name: 'Deposition_transcript_vol2.pdf',
              kind: 'pdf',
              thumb: 'deposition',
              size: '3.1 MB',
              bytes: 3_100_000,
              pages: 40,
              modified: 'Sep 8, 2026',
              author: 'Morgan Lee',
            }),
          ],
        }),
      ],
    }),
  ],
});

function walk(node: FileNode, visit: (node: FileNode, parent: FileNode | null) => void, parent: FileNode | null = null) {
  visit(node, parent);
  node.children?.forEach((child) => walk(child, visit, node));
}

const BY_ID = new Map<string, FileNode>();
const PARENT = new Map<string, string | null>();
walk(TREE, (node, parent) => {
  BY_ID.set(node.id, node);
  PARENT.set(node.id, parent?.id ?? null);
});

function descendants(node: FileNode): FileNode[] {
  const files: FileNode[] = [];
  walk(node, (item) => {
    if (item.kind !== 'folder') files.push(item);
  });
  return files;
}

function folderCount(node: FileNode): number {
  if (node.kind !== 'folder') return 0;
  return node.children?.length ?? 0;
}

function pathTo(id: string): FileNode[] {
  const chain: FileNode[] = [];
  let current: string | null = id;
  while (current) {
    const node = BY_ID.get(current);
    if (!node) break;
    chain.unshift(node);
    current = PARENT.get(current) ?? null;
  }
  return chain;
}

function locationLabel(id: string): string {
  return pathTo(id)
    .filter((node) => node.id !== 'root')
    .map((node) => node.name)
    .join(' / ');
}

function chipText(name: string): string {
  if (name.length <= 18) return name;
  const dot = name.lastIndexOf('.');
  const ext = dot > 0 ? name.slice(dot) : '';
  const base = ext ? name.slice(0, dot) : name;
  return `${base.slice(0, 5)}…${base.slice(-4)}${ext}`;
}

function sizeLabel(node: FileNode): string {
  if (node.kind === 'folder') {
    const count = folderCount(node);
    return `${count} item${count === 1 ? '' : 's'}`;
  }
  return node.size ?? '—';
}

function metaLine(node: FileNode): string {
  if (node.kind === 'folder') return sizeLabel(node);
  if (node.kind === 'pdf' && node.pages) return `${node.pages} pages • ${node.size}`;
  if (node.duration) return `${node.duration} • ${node.size}`;
  return node.size ?? '';
}

function detailSize(node: FileNode): string {
  if (node.kind === 'pdf' && node.pages) return `${node.size}, ${node.pages} pages`;
  if (node.duration) return `${node.size}, ${node.duration}`;
  return node.size ?? '—';
}

const ICONS: Record<string, string[]> = {
  plus: ['M5 12h14', 'M12 5v14'],
  search: ['M21 21l-4.34-4.34', 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16'],
  x: ['M18 6 6 18', 'M6 6l12 12'],
  chevron: ['m6 9 6 6 6-6'],
  list: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
  grid: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M14 14h7v7h-7z', 'M3 14h7v7H3z'],
  panel: ['M3 3h18v18H3z', 'M15 3v18'],
  up: ['M12 19V5', 'm5 12 7-7 7 7'],
  mic: ['M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z', 'M19 10v2a7 7 0 0 1-14 0v-2', 'M12 19v3'],
  spark: ['M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z', 'M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z'],
  pen: ['M12 20h9', 'M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z'],
  file: ['M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z', 'M14 2v4a2 2 0 0 0 2 2h4'],
  folder: ['M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z'],
  home: ['M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8', 'M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'],
  library: ['M12 7v14', 'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  share: ['M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8', 'M16 6l-4-4-4 4', 'M12 2v13'],
  lock: ['M7 11V7a5 5 0 0 1 10 0v4', 'M5 11h14v10H5z'],
  scale: ['M12 3v18', 'M3 7h18', 'M6 7l-3 7a4 4 0 0 0 6 0z', 'M18 7l-3 7a4 4 0 0 0 6 0z'],
  case: ['M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16', 'M2 8h20v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z'],
  compare: ['M18 8a3 3 0 1 0-2.83-4', 'M6 16a3 3 0 1 0 2.83 4', 'M8 8h8', 'm15 5 3 3-3 3', 'M16 16H8', 'm9 19-3-3 3-3'],
  user: ['M18 20a6 6 0 0 0-12 0', 'M12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8'],
  ruler: ['m15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9', 'M9 11l2 2', 'm18 13 1.5-1.5', 'M21 6l-7.5 7.5'],
  languages: ['m5 8 6 6', 'm4 14 6-6 2-3', 'M2 5h12', 'M7 2h1', 'm22 22-5-10-5 10', 'M14 18h6'],
  check: ['M20 6 9 17l-5-5'],
  chevronRight: ['m9 18 6-6-6-6'],
};

function Stroke({name, size = 16}: {name: keyof typeof ICONS; size?: number}): ReactElement {
  return (
    <span className="fp-icon" style={{width: size, height: size}} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        {ICONS[name].map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    </span>
  );
}

function IconFile({kind}: {kind: Kind}): ReactElement {
  const src =
    kind === 'folder'
      ? '/icons/files/folder.svg'
      : kind === 'pdf'
        ? '/icons/files/pdf.svg'
        : kind === 'email'
          ? '/icons/files/msg.svg'
          : kind === 'video'
            ? '/icons/files/video.png'
            : kind === 'image'
              ? '/icons/files/img.png'
              : kind === 'audio'
                ? '/icons/files/sound.svg'
                : '/icons/files/other.svg';
  return <img className="fp__file-icon" src={src} alt="" width={16} height={16} />;
}

function previewShape(node: FileNode): 'portrait' | 'wide' | 'landscape' | 'icon' {
  if (node.kind === 'image' || node.kind === 'video') return 'wide';
  if (node.thumb === 'deposition') return 'landscape';
  if (node.kind === 'pdf') return 'portrait';
  return 'icon';
}

function PreviewArt({node}: {node: FileNode}): ReactElement {
  if (node.kind === 'image') {
    return <img className="fp__fill" src={`${ASSET}/photo-16x9.jpg`} alt="" />;
  }
  if (node.kind === 'video') {
    return (
      <>
        <img className="fp__fill" src={`${ASSET}/video.jpg`} alt="" />
        <img className="fp__play" src={`${ASSET}/play.svg`} alt="" />
      </>
    );
  }
  if (node.thumb === 'deposition') {
    return <img className="fp__fill" src={`${ASSET}/deposition-preview.png`} alt="" />;
  }
  if (node.kind === 'pdf') {
    return <img className="fp__fill" src={`${ASSET}/nda.png`} alt="" />;
  }
  if (node.thumb === 'audio' || node.kind === 'audio') {
    return (
      <span className="fp__glyph">
        <img className="fp__wave" src={`${ASSET}/waveform.svg`} alt="" />
      </span>
    );
  }
  if (node.kind === 'email') {
    return (
      <span className="fp__glyph">
        <img className="fp__mail" src={`${ASSET}/envelope.svg`} alt="" />
      </span>
    );
  }
  if (node.kind === 'folder') {
    return (
      <span className="fp__glyph">
        <img src="/icons/files/folder.svg" alt="" />
      </span>
    );
  }
  return (
    <span className="fp__glyph">
      <IconFile kind={node.kind} />
    </span>
  );
}

function Thumb({node, cover}: {node: FileNode; cover?: boolean}): ReactElement {
  if (node.thumb === 'nda') {
    return <img className="fp__page" src={`${ASSET}/nda.png`} alt="" />;
  }
  if (node.thumb === 'deposition') {
    return <img className="fp__page" src={`${ASSET}/deposition.png`} alt="" />;
  }
  if (node.thumb === 'forest') {
    return <img className={cover ? 'fp__cover' : 'fp__page'} src={`${ASSET}/forest.jpg`} alt="" />;
  }
  if (node.thumb === 'video') {
    return (
      <>
        <img className="fp__cover" src={`${ASSET}/video.jpg`} alt="" />
        <img className="fp__play" src={`${ASSET}/play.svg`} alt="" />
      </>
    );
  }
  if (node.thumb === 'audio') {
    return (
      <span className="fp__glyph">
        <img src={`${ASSET}/waveform.svg`} alt="" />
      </span>
    );
  }
  if (node.kind === 'folder') {
    return (
      <span className="fp__glyph">
        <img src="/icons/files/folder.svg" alt="" />
      </span>
    );
  }
  return (
    <span className="fp__glyph">
      <IconFile kind={node.kind} />
    </span>
  );
}

function bytesOf(nodes: FileNode[]): number {
  return nodes.reduce((sum, node) => sum + (node.bytes ?? 0), 0);
}

function formatBytes(bytes: number): string {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`;
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1000))} KB`;
}

const VISIBLE_CHIPS = 8;

export default function FilePickerPage(): ReactElement {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<PickerTab>('sources');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [previewOn, setPreviewOn] = useState(true);
  const [folderId, setFolderId] = useState('depositions');
  const [selected, setSelected] = useState<string[]>(['nda']);
  const [activeId, setActiveId] = useState<string | null>('nda');
  const [jumpId, setJumpId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [shareOpen, setShareOpen] = useState(false);
  const [share, setShare] = useState('All');
  const [listOpen, setListOpen] = useState(false);
  const [listQuery, setListQuery] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);
  const [attached, setAttached] = useState<string[]>([]);
  const [toast, setToast] = useState<{label: string; ids: string[]} | null>(null);
  const [prompt, setPrompt] = useState('');
  const rowRefs = useRef(new Map<string, HTMLElement>());

  const folder = BY_ID.get(folderId) ?? TREE;
  const crumbs = pathTo(folderId);

  const rows = useMemo(() => {
    const children = [...(folder.children ?? [])];
    if (sortKey) {
      children.sort((a, b) => {
        const folderBias = Number(a.kind !== 'folder') - Number(b.kind !== 'folder');
        if (folderBias) return folderBias;
        const av = sortKey === 'size' ? a.bytes ?? 0 : sortKey === 'type' ? a.kind : a[sortKey];
        const bv = sortKey === 'size' ? b.bytes ?? 0 : sortKey === 'type' ? b.kind : b[sortKey];
        if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sortDir;
        return String(av).localeCompare(String(bv)) * sortDir;
      });
    }
    return children;
  }, [folder.children, sortDir, sortKey]);

  const selectedNodes = selected.map((id) => BY_ID.get(id)).filter((node): node is FileNode => Boolean(node));
  const selectedFiles = selectedNodes.filter((node) => node.kind !== 'folder');
  const previewFiles = (activeId ? [BY_ID.get(activeId)].filter((node): node is FileNode => Boolean(node && node.kind !== 'folder')) : []).length
    ? selectedFiles.filter((node) => node.id === activeId).concat(selectedFiles.filter((node) => node.id !== activeId))
    : selectedFiles;
  const focus = previewFiles[0] ?? null;
  const stack = previewFiles.slice(0, 3);
  const showSingle = Boolean(activeId && focus && focus.id === activeId) || previewFiles.length === 1;

  useEffect(() => {
    if (!jumpId) return;
    const node = rowRefs.current.get(jumpId);
    node?.scrollIntoView({block: 'center', behavior: 'smooth'});
    const timer = window.setTimeout(() => setJumpId(null), 1600);
    return () => window.clearTimeout(timer);
  }, [jumpId, folderId, view]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((dir) => (dir === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setSortDir(1);
    }
  }

  function fileIdsFor(node: FileNode): string[] {
    return node.kind === 'folder' ? descendants(node).map((item) => item.id) : [node.id];
  }

  function isChecked(node: FileNode): boolean {
    const ids = fileIdsFor(node);
    return ids.length > 0 && ids.every((id) => selected.includes(id));
  }

  function isPartial(node: FileNode): boolean {
    if (node.kind !== 'folder') return false;
    const ids = fileIdsFor(node);
    const count = ids.filter((id) => selected.includes(id)).length;
    return count > 0 && count < ids.length;
  }

  function toggleNode(node: FileNode) {
    const ids = fileIdsFor(node);
    const on = isChecked(node);
    setSelected((current) => {
      if (on) return current.filter((id) => !ids.includes(id));
      return [...current, ...ids.filter((id) => !current.includes(id))];
    });
    if (on) {
      if (node.kind === 'folder') setToast({label: `Removed ${node.name} from selection`, ids});
      if (activeId && ids.includes(activeId)) setActiveId(null);
    } else if (node.kind !== 'folder') {
      setActiveId(node.id);
    } else {
      setActiveId(null);
    }
    setListOpen(false);
  }

  function openNode(node: FileNode) {
    if (node.kind === 'folder') {
      setFolderId(node.id);
      setJumpId(null);
      return;
    }
    setActiveId(node.id);
    setPreviewOn(true);
    setListOpen(false);
  }

  function jumpTo(id: string) {
    const parent = PARENT.get(id);
    if (parent) setFolderId(parent);
    setActiveId(id);
    setJumpId(id);
    setPreviewOn(true);
    setListOpen(false);
  }

  function removeIds(ids: string[], label: string) {
    setSelected((current) => current.filter((id) => !ids.includes(id)));
    if (activeId && ids.includes(activeId)) setActiveId(null);
    setToast({label, ids});
  }

  const visibleChips = selectedFiles.slice(0, VISIBLE_CHIPS);
  const hiddenCount = Math.max(0, selectedFiles.length - visibleChips.length);
  const allIds = rows.flatMap(fileIdsFor);
  const allOn = allIds.length > 0 && allIds.every((id) => selected.includes(id));
  const someOn = allIds.some((id) => selected.includes(id));

  function toggleAll() {
    setSelected((current) => {
      if (allOn) return current.filter((id) => !allIds.includes(id));
      return [...current, ...allIds.filter((id) => !current.includes(id))];
    });
    setActiveId(null);
  }

  const groups = useMemo(() => {
    const query = listQuery.trim().toLowerCase();
    const map = new Map<string, FileNode[]>();
    selectedFiles.forEach((node) => {
      if (query && !node.name.toLowerCase().includes(query)) return;
      const parent = PARENT.get(node.id);
      const key = parent ?? 'root';
      map.set(key, [...(map.get(key) ?? []), node]);
    });
    return [...map.entries()];
  }, [listQuery, selectedFiles]);

  const typeSummary = useMemo(() => {
    const counts = new Map<string, number>();
    previewFiles.forEach((node) => counts.set(TYPE_LABEL[node.kind], (counts.get(TYPE_LABEL[node.kind]) ?? 0) + 1));
    return [...counts.entries()].map(([label, count]) => `${count} ${label}${count > 1 ? 's' : ''}`).join(', ');
  }, [previewFiles]);

  const addLabel =
    selectedFiles.length === 0 ? 'Add files' : selectedFiles.length === 1 ? 'Add 1 file' : `Add ${selectedFiles.length} files`;

  return (
    <div className="fp">
      <div className="fp__main">
        <div className="fp__sheet">
          <header className="fp__head">
            <div className="fp__crumb">
              <Stroke name="folder" size={14} />
              Litigation projects /
            </div>
            <div className="fp__title-row">
              <h1 className="fp__title">&lt;Project name&gt;</h1>
              <button className="fp__add" type="button">
                <Stroke name="plus" size={16} />
                Add files
              </button>
            </div>
            <div className="fp__tabs">
              <button className="fp__tab is-on" type="button"><Stroke name="home" size={14} /> Home</button>
              <button className="fp__tab" type="button"><Stroke name="library" size={14} /> Project count</button>
              <button className="fp__tab" type="button"><Stroke name="file" size={14} /> Files · 5,000</button>
              <button className="fp__tab" type="button"><Stroke name="users" size={14} /> Collaborators</button>
            </div>
          </header>
          <div className="fp__body">
            <p className="fp__hello">Ready when you are, Morgan.</p>
            <div className="fp__ask">
              {attached.length > 0 ? (
                <div className="fp__ask-files">
                  {attached.map((id) => {
                    const node = BY_ID.get(id);
                    if (!node) return null;
                    return (
                      <span key={id} className="fp__chip">
                        <IconFile kind={node.kind} />
                        <button type="button" onClick={() => jumpTo(id)}>{chipText(node.name)}</button>
                        <button className="fp__chip-x" type="button" aria-label={`Remove ${node.name}`} onClick={() => setAttached((current) => current.filter((item) => item !== id))}><Stroke name="x" size={14} /></button>
                      </span>
                    );
                  })}
                </div>
              ) : null}
              <textarea value={prompt} placeholder="Ask anything..." onChange={(event) => setPrompt(event.target.value)} />
              <div className="fp__ask-bar">
                <div className="fp__ask-left">
                  <button className="fp__icon" type="button" aria-label="Add"><Stroke name="plus" size={16} /></button>
                  <button className="fp__ghost" type="button" onClick={() => { setOpen(true); setSelected(attached.length ? attached : ['nda']); setActiveId(attached[0] ?? 'nda'); setFolderId('depositions'); }}>
                    <IconFile kind="pdf" /> Select project files
                  </button>
                </div>
                <div className="fp__ask-right">
                  <button className="fp__ghost" type="button">Thinking <Stroke name="chevron" size={14} /></button>
                  <button className="fp__icon" type="button" aria-label="Attach"><Stroke name="file" size={16} /></button>
                  <button className="fp__icon" type="button" aria-label="Tools"><Stroke name="spark" size={16} /></button>
                  <button className="fp__icon" type="button" aria-label="Voice"><Stroke name="mic" size={16} /></button>
                  <button className={prompt.trim() ? 'fp__send is-ready' : 'fp__send'} type="button" aria-label="Send"><Stroke name="up" size={16} /></button>
                </div>
              </div>
            </div>
            <section className="fp__section">
              <h2>Agents <span className="fp__section-note">Get started with Agents on Eudia</span></h2>
              <div className="fp__agents">
                {([
                  ['lock', 'Redact PII', 'Redact sensitive information from documents.'],
                  ['scale', 'Argument Analysis', 'Analyzes argument evolution and inconsistencies.'],
                  ['case', 'Case Analysis', 'Comprehensive analysis of case documents and themes.'],
                  ['compare', 'Compare', 'Compare and highlight differences between documents.'],
                  ['user', 'Witness Analysis', 'Analyze testimonies and depositions for inconsistencies.'],
                ] as Array<[keyof typeof ICONS, string, string]>).map(([icon, name, copy]) => (
                  <div key={name} className="fp__agent">
                    <Stroke name={icon} size={16} />
                    <strong>{name}</strong>
                    <span>{copy}</span>
                  </div>
                ))}
              </div>
              <button className="fp__see" type="button">See all</button>
            </section>
            <section className="fp__section">
              <h2>Recent agent outputs</h2>
              <div className="fp__outputs">
                <div className="fp__output">
                  <Stroke name="ruler" size={16} />
                  <strong>Generate Report</strong>
                  <span className="fp__pill">ML Me</span>
                  <span className="fp__pill"><i className="fp__dot is-progress" /> In progress</span>
                  <span className="fp__muted">2 days ago</span>
                </div>
                <div className="fp__output">
                  <Stroke name="languages" size={16} />
                  <strong>Translate</strong>
                  <span className="fp__pill">SR sam.rivera@eudia.com</span>
                  <span className="fp__pill"><Stroke name="check" size={14} /> Completed</span>
                  <span className="fp__muted">Jan 6, 2025</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {open ? (
        <div className="fp__backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <div className="fp__dialog" role="dialog" aria-modal="true" aria-labelledby="fp-title">
            <button className="fp__close" type="button" aria-label="Close" onClick={() => setOpen(false)}><Stroke name="x" size={16} /></button>
            <div className="fp__dialog-head">
              <h2 id="fp-title">Select project files</h2>
              <p>Selected sources will be used as context to answer your questions</p>
            </div>
            <div className="fp__tools">
              <div className="fp__source-tabs">
                <button className={tab === 'sources' ? 'is-on' : ''} type="button" onClick={() => setTab('sources')}>Original sources</button>
                <button className={tab === 'smart' ? 'is-on' : ''} type="button" onClick={() => setTab('smart')}>AI smart folders</button>
              </div>
              <div className="fp__tools-right">
                <div className="fp__share">
                  <button type="button" onClick={() => setShareOpen((value) => !value)}><Stroke name="share" size={14} /> Shared: {share} <Stroke name="chevron" size={14} /></button>
                  {shareOpen ? (
                    <div className="fp__menu">
                      {['All', 'Shared with me', 'Owned by me'].map((option) => (
                        <button key={option} className={share === option ? 'is-on' : ''} type="button" onClick={() => { setShare(option); setShareOpen(false); }}>{option}</button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <label className="fp__search">
                  <Stroke name="search" size={14} />
                  <input placeholder="Search" aria-label="Search" readOnly />
                </label>
                <div className="fp__seg" role="group" aria-label="View">
                  <button className={view === 'list' ? 'is-on' : ''} type="button" aria-label="List view" onClick={() => setView('list')}><Stroke name="list" size={16} /></button>
                  <button className={view === 'grid' ? 'is-on' : ''} type="button" aria-label="Grid view" onClick={() => setView('grid')}><Stroke name="grid" size={16} /></button>
                </div>
                <button className={previewOn ? 'fp__preview-toggle is-on' : 'fp__preview-toggle'} type="button" aria-pressed={previewOn} aria-label="Toggle preview" onClick={() => { setPreviewOn((value) => !value); setListOpen(false); }}><Stroke name="panel" size={16} /></button>
              </div>
            </div>
            <div className="fp__path">
              {crumbs.map((crumb, index) => (
                <span key={crumb.id}>
                  {index > 0 ? <span> &gt; </span> : null}
                  <button className={crumb.id === folderId ? 'is-current' : ''} type="button" onClick={() => setFolderId(crumb.id)}>{crumb.name}</button>
                </span>
              ))}
            </div>
            <div className="fp__browser">
              <div className="fp__files">
                {tab === 'smart' ? (
                  <div className="fp__empty">AI smart folders stay out of this prototype.</div>
                ) : view === 'list' ? (
                  <div className="fp__scroll">
                    <table className="fp__table">
                      <thead>
                        <tr>
                          <th style={{width: 36}}>
                            <input className="fp__check" type="checkbox" checked={allOn} ref={(element) => { if (element) element.indeterminate = !allOn && someOn; }} onChange={toggleAll} aria-label="Select all" />
                          </th>
                          <th />
                          {([
                            ['name', 'Name'],
                            ['type', 'Type'],
                            ['size', 'Size'],
                            ['modified', 'Modified'],
                            ['author', 'Uploaded by'],
                          ] as Array<[SortKey, string]>).map(([key, label]) => (
                            <th key={key}>
                              <button type="button" onClick={() => toggleSort(key)}>{label} <Stroke name="chevron" size={12} /></button>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((node) => (
                          <tr
                            key={node.id}
                            className={[isChecked(node) || activeId === node.id ? 'is-active' : '', jumpId === node.id ? 'is-jump' : ''].filter(Boolean).join(' ')}
                            ref={(element) => {
                              if (element) rowRefs.current.set(node.id, element);
                              else rowRefs.current.delete(node.id);
                            }}
                          >
                            <td>
                              <input className="fp__check" type="checkbox" checked={isChecked(node)} ref={(element) => { if (element) element.indeterminate = isPartial(node); }} onChange={() => toggleNode(node)} aria-label={`Select ${node.name}`} />
                            </td>
                            <td><IconFile kind={node.kind} /></td>
                            <td>
                              <button className="fp__name" type="button" onClick={() => openNode(node)}>
                                <span>{node.name}</span>
                              </button>
                            </td>
                            <td>{TYPE_LABEL[node.kind]}</td>
                            <td>{sizeLabel(node)}</td>
                            <td>{node.modified}</td>
                            <td>{node.author}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <>
                    <div className="fp__grid-head">
                      <input className="fp__check" type="checkbox" checked={allOn} ref={(element) => { if (element) element.indeterminate = !allOn && someOn; }} onChange={toggleAll} aria-label="Select all" />
                      <span>{rows.filter((node) => node.kind === 'folder').length} folders, {rows.filter((node) => node.kind !== 'folder').length} files</span>
                    </div>
                    <div className="fp__scroll">
                      <div className="fp__grid">
                        {rows.map((node) => (
                          <div
                            key={node.id}
                            className={['fp__card', isChecked(node) || activeId === node.id ? 'is-active' : '', jumpId === node.id ? 'is-jump' : ''].filter(Boolean).join(' ')}
                            ref={(element) => {
                              if (element) rowRefs.current.set(node.id, element);
                              else rowRefs.current.delete(node.id);
                            }}
                          >
                            <input className="fp__check" type="checkbox" checked={isChecked(node)} ref={(element) => { if (element) element.indeterminate = isPartial(node); }} onChange={() => toggleNode(node)} aria-label={`Select ${node.name}`} />
                            <button type="button" onClick={() => openNode(node)} style={{border: 0, background: 'transparent', padding: 0, width: '100%', textAlign: 'left'}}>
                              <div className={node.thumb === 'video' ? 'fp__thumb is-video' : 'fp__thumb'}>
                                <Thumb node={node} cover={node.kind === 'image' || node.kind === 'video'} />
                              </div>
                              <span className="fp__card-name">{node.name}</span>
                              <span className="fp__card-meta">{metaLine(node)}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                <div className="fp__tray">
                  {visibleChips.map((node) => (
                    <span key={node.id} className={activeId === node.id ? 'fp__chip is-active' : 'fp__chip'}>
                      <IconFile kind={node.kind} />
                      <button type="button" onClick={() => jumpTo(node.id)}>{chipText(node.name)}</button>
                      <button className="fp__chip-x" type="button" aria-label={`Remove ${node.name}`} onClick={() => removeIds([node.id], `Removed ${node.name}`)}><Stroke name="x" size={14} /></button>
                    </span>
                  ))}
                  {hiddenCount > 0 ? (
                    <button className={listOpen ? 'fp__more is-active' : 'fp__more'} type="button" onClick={() => { setListOpen(true); setPreviewOn(true); }}>+{hiddenCount}</button>
                  ) : null}
                </div>
              </div>
              {previewOn && listOpen ? (
                <aside className="fp__picked">
                  <div className="fp__picked-head">
                    <strong>Selected files ({selectedFiles.length})</strong>
                    <span className="fp__picked-tools">
                      <button className="fp__link" type="button" onClick={() => { setToast({label: 'Cleared selection', ids: selected}); setSelected([]); setActiveId(null); }}>Clear all</button>
                      <button className="fp__icon" type="button" aria-label="Close selected files" onClick={() => setListOpen(false)}><Stroke name="x" size={16} /></button>
                    </span>
                  </div>
                  <p className="fp__muted" style={{margin: '0 16px 8px', fontSize: 12}}>
                    {selectedFiles.length} files · {formatBytes(bytesOf(selectedFiles))}
                  </p>
                  <label className="fp__picked-search">
                    <Stroke name="search" size={14} />
                    <input value={listQuery} placeholder="Search selected files" aria-label="Search selected files" onChange={(event) => setListQuery(event.target.value)} />
                  </label>
                  <div className="fp__picked-body">
                    {groups.map(([groupId, nodes]) => {
                      const group = BY_ID.get(groupId);
                      const collapsed = collapsedGroups.includes(groupId);
                      return (
                        <div key={groupId} className="fp__group">
                          <button className="fp__group-title" type="button" onClick={() => setCollapsedGroups((current) => current.includes(groupId) ? current.filter((id) => id !== groupId) : [...current, groupId])}>
                            <Stroke name={collapsed ? 'chevronRight' : 'chevron'} size={14} />
                            <IconFile kind="folder" />
                            <span style={{flex: 1}}>{group?.name ?? 'Files'}</span>
                            <em>{nodes.length}</em>
                            <button className="fp__chip-x" type="button" aria-label={`Remove ${group?.name ?? 'group'}`} onClick={(event) => { event.stopPropagation(); removeIds(nodes.map((node) => node.id), `Removed ${group?.name ?? 'files'} from selection`); }}><Stroke name="x" size={14} /></button>
                          </button>
                          {collapsed ? null : nodes.map((node) => (
                            <div key={node.id} className="fp__picked-row" style={{paddingLeft: 22}}>
                              <IconFile kind={node.kind} />
                              <button type="button" onClick={() => jumpTo(node.id)} style={{border: 0, background: 'transparent', padding: 0, flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{node.name}</button>
                              <em>{node.size}</em>
                              <button className="fp__chip-x" type="button" aria-label={`Remove ${node.name}`} onClick={() => removeIds([node.id], `Removed ${node.name}`)}><Stroke name="x" size={14} /></button>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </aside>
              ) : previewOn ? (
                <aside className="fp__preview">
                  <div className="fp__preview-head">
                    Preview
                    <button className="fp__icon" type="button" aria-label="Close preview" onClick={() => setPreviewOn(false)}><Stroke name="x" size={16} /></button>
                  </div>
                  <div className="fp__preview-body">
                    {focus ? (
                      <>
                        <div className="fp__stack">
                          {showSingle ? (
                            <div className={`fp__sheet-page is-${previewShape(focus)}`}>
                              <PreviewArt node={focus} />
                            </div>
                          ) : (
                            stack.map((node, index) => (
                              <div key={node.id} className={['fp__sheet-page', `is-${previewShape(node)}`, index === 0 ? 'is-back' : '', index === 1 ? 'is-mid' : ''].filter(Boolean).join(' ')} style={{zIndex: index + 1}}>
                                <PreviewArt node={node} />
                              </div>
                            ))
                          )}
                        </div>
                        <div className="fp__details">
                          <h3>{showSingle ? focus.name : `${previewFiles.length} files selected`}</h3>
                          <dl className="fp__meta">
                            <dt>{showSingle ? 'Type' : 'Types'}</dt>
                            <dd>{showSingle ? TYPE_DETAIL[focus.kind] : typeSummary}</dd>
                            <dt>{showSingle ? 'Size' : 'Total size'}</dt>
                            <dd>{showSingle ? detailSize(focus) : formatBytes(bytesOf(previewFiles))}</dd>
                            <dt>Modified</dt>
                            <dd>{focus.modified}</dd>
                            {showSingle ? (
                              <>
                                <dt>Uploaded by</dt>
                                <dd>{focus.author}</dd>
                              </>
                            ) : null}
                            <dt>Location</dt>
                            <dd>{locationLabel(PARENT.get(focus.id) ?? focus.id)}</dd>
                          </dl>
                        </div>
                      </>
                    ) : (
                      <div className="fp__empty">Select a file to preview it.</div>
                    )}
                  </div>
                </aside>
              ) : null}
            </div>
            <div className="fp__foot">
              <button className="fp__btn fp__btn--quiet" type="button" onClick={() => setOpen(false)}>Cancel</button>
              <button className="fp__btn fp__btn--primary" type="button" disabled={selectedFiles.length === 0} onClick={() => { setAttached(selectedFiles.map((node) => node.id)); setOpen(false); }}>
                {addLabel}
              </button>
            </div>
            {toast ? (
              <div className="fp__toast" role="status">
                {toast.label}
                <button type="button" onClick={() => { setSelected((current) => [...current, ...toast.ids.filter((id) => !current.includes(id))]); setToast(null); }}>Undo</button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
