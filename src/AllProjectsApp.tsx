import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
} from 'react';

function clsx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

const ICONS = '/icons';

type ProjectKind = 'general' | 'compliance' | 'ma' | 'litigation';
type TypeFilter = 'favorites' | ProjectKind;
type Ownership = 'all' | 'owned' | 'shared';
type ShellView =
  | 'assistant'
  | 'knowledge'
  | 'intelligence'
  | 'opportunities'
  | 'projects'
  | 'chats'
  | 'configure';
type KnowledgeKind = 'contracts' | 'facts' | 'resources' | 'twin';
type KnowledgeTab = 'active' | 'archived';
type AppIconKind = ProjectKind | 'project2';

type Project = {
  id: string;
  name: string;
  type: ProjectKind;
  owner: 'me' | 'shared';
  favorite: boolean;
  updatedAt: string;
};

type KnowledgeTable = {
  id: string;
  kind: KnowledgeKind;
  name: string;
  archived: boolean;
  updatedAt: string;
};

const SEED_PROJECTS: Project[] = [
  {id: 'm1', name: 'Project 2', type: 'ma', owner: 'me', favorite: true, updatedAt: 'Updated yesterday'},
  {id: 'm2', name: 'Northstar diligence', type: 'ma', owner: 'me', favorite: false, updatedAt: 'Updated 3d ago'},
  {id: 'm3', name: 'Horizon merger', type: 'ma', owner: 'shared', favorite: false, updatedAt: 'Updated 6d ago'},
  {id: 'm4', name: 'Carve-out playbook', type: 'ma', owner: 'me', favorite: false, updatedAt: 'Updated 2w ago'},
  {id: 'm5', name: 'Bid strategy', type: 'ma', owner: 'shared', favorite: false, updatedAt: 'Updated 9d ago'},
  {id: 'm6', name: 'Integration tracker', type: 'ma', owner: 'me', favorite: false, updatedAt: 'Updated 4d ago'},
  {id: 'l1', name: 'Smith v. Acme', type: 'litigation', owner: 'me', favorite: true, updatedAt: 'Updated 1d ago'},
  {id: 'l2', name: 'Patent dispute 2025', type: 'litigation', owner: 'shared', favorite: false, updatedAt: 'Updated 4d ago'},
  {id: 'l3', name: 'Deposition prep', type: 'litigation', owner: 'me', favorite: false, updatedAt: 'Updated 2d ago'},
  {id: 'l4', name: 'Expert report review', type: 'litigation', owner: 'me', favorite: false, updatedAt: 'Updated 1w ago'},
  {id: 'l5', name: 'Motion to dismiss', type: 'litigation', owner: 'shared', favorite: false, updatedAt: 'Updated 5d ago'},
  {id: 'l6', name: 'Discovery tracker', type: 'litigation', owner: 'me', favorite: false, updatedAt: 'Updated 3d ago'},
  {id: 'l7', name: 'Trial war room', type: 'litigation', owner: 'me', favorite: false, updatedAt: 'Updated 6d ago'},
  {id: 'l8', name: 'Settlement analysis', type: 'litigation', owner: 'shared', favorite: false, updatedAt: 'Updated 2w ago'},
  {id: 'l9', name: 'Privilege log', type: 'litigation', owner: 'me', favorite: false, updatedAt: 'Updated 8d ago'},
];

function Icon({src, size}: {src: string; size: number}) {
  return (
    <span className="proto-icon" style={{width: size, height: size}}>
      <img src={src} alt="" />
    </span>
  );
}

function AppIcon({kind, size = 20}: {kind: AppIconKind; size?: number}) {
  const map: Record<AppIconKind, {bg: string; glyph: string}> = {
    general: {bg: assets.generalBg, glyph: assets.generalGlyph},
    compliance: {bg: assets.complianceBg, glyph: assets.complianceGlyph},
    ma: {bg: assets.maBg, glyph: assets.maGlyph},
    litigation: {bg: assets.litigationBg, glyph: assets.litigationGlyph},
    project2: {bg: assets.project2Bg, glyph: assets.project2Glyph},
  };
  const {bg, glyph} = map[kind];
  return (
    <span
      className={clsx('proto-app-icon', `proto-app-icon--${kind}`)}
      style={{width: size, height: size}}
    >
      <img className="proto-app-icon__bg" src={bg} alt="" />
      <span className="proto-app-icon__glyph-wrap">
        <img src={glyph} alt="" />
      </span>
    </span>
  );
}

const assets = {
  logo: `${ICONS}/logo.svg`,
  panelLeft: `${ICONS}/panel-left.svg`,
  askAi: `${ICONS}/ask-ai.svg`,
  graduationCap: `${ICONS}/graduation-cap.svg`,
  areaChart: `${ICONS}/area-chart.svg`,
  layoutList: `${ICONS}/layout-list.svg`,
  messageCircle: `${ICONS}/message-circle-more.svg`,
  settings: `${ICONS}/settings-2.svg`,
  chevronRight: `${ICONS}/chevron-right.svg`,
  chevrons: `${ICONS}/chevrons-up-down.svg`,
  star: `${ICONS}/star.svg`,
  archive: `${ICONS}/archive.svg`,
  search: `${ICONS}/search.svg`,
  plus: `${ICONS}/plus.svg`,
  folderOpen: `${ICONS}/folder-open.svg`,
  generalBg: `${ICONS}/general-bg.svg`,
  generalGlyph: `${ICONS}/general-glyph.svg`,
  project2Bg: `${ICONS}/project2-bg.svg`,
  project2Glyph: `${ICONS}/project2-glyph.svg`,
  complianceBg: `${ICONS}/compliance-bg.svg`,
  complianceGlyph: `${ICONS}/compliance-glyph.svg`,
  maBg: `${ICONS}/ma-bg.svg`,
  maGlyph: `${ICONS}/ma-glyph.svg`,
  litigationBg: `${ICONS}/litigation-bg.svg`,
  litigationGlyph: `${ICONS}/litigation-glyph.svg`,
  emptyGeneralLgBg: `${ICONS}/empty-general-lg-bg.svg`,
  emptyGeneralLgGlyph: `${ICONS}/empty-general-lg-glyph.svg`,
  emptyGeneralSmBg: `${ICONS}/empty-general-sm-bg.svg`,
  emptyGeneralSmGlyph: `${ICONS}/empty-general-sm-glyph.svg`,
  emptyComplianceLgBg: `${ICONS}/empty-compliance-lg-bg.svg`,
  emptyComplianceLgGlyph: `${ICONS}/empty-compliance-lg-glyph.svg`,
  emptyComplianceSmBg: `${ICONS}/empty-compliance-sm-bg.svg`,
  emptyComplianceSmGlyph: `${ICONS}/empty-compliance-sm-glyph.svg`,
  emptyMaLgBg: `${ICONS}/empty-ma-lg-bg.svg`,
  emptyMaLgGlyph: `${ICONS}/empty-ma-lg-glyph.svg`,
  emptyMaSmBg: `${ICONS}/empty-ma-sm-bg.svg`,
  emptyMaSmGlyph: `${ICONS}/empty-ma-sm-glyph.svg`,
  emptyLitigationLgBg: `${ICONS}/empty-litigation-lg-bg.svg`,
  emptyLitigationLgGlyph: `${ICONS}/empty-litigation-lg-glyph.svg`,
  emptyLitigationSmBg: `${ICONS}/empty-litigation-sm-bg.svg`,
  emptyLitigationSmGlyph: `${ICONS}/empty-litigation-sm-glyph.svg`,
  scrollOpen: `${ICONS}/scroll-open.svg`,
  scrollClosed: `${ICONS}/scroll-closed.svg`,
  kFilePen: `${ICONS}/k-file-pen.svg`,
  kFilePenLg: `${ICONS}/k-file-pen-lg.svg`,
  kFilePenSm: `${ICONS}/k-file-pen-sm.svg`,
  kBookOpen: `${ICONS}/k-book-open.svg`,
  kBookCopy: `${ICONS}/k-book-copy.svg`,
  kMind: `${ICONS}/k-mind.svg`,
  telescope: `${ICONS}/telescope.svg`,
  oppArrowRight: `${ICONS}/opp-arrow-right.svg`,
  oppScrollGray: `${ICONS}/opp-scroll-gray.svg`,
  oppContractDoc: `${ICONS}/opp-contract-doc.svg`,
  oppSelectBadge: `${ICONS}/opp-select-badge.svg`,
  oppTelescopeBarrel: `${ICONS}/opp-telescope-barrel.svg`,
  oppTelescopeTripod: `${ICONS}/opp-telescope-tripod.svg`,
} as const;

function LucideIcon({name, size}: {name: 'folder' | 'folder-open'; size: number}) {
  const src = `${ICONS}/lucide-${name}.svg`;
  return (
    <span
      className="proto-lucide"
      style={{
        width: size,
        height: size,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
      }}
      aria-hidden="true"
    />
  );
}

function KnowledgeIcon({
  kind,
  size = 16,
  tile = false,
}: {
  kind: KnowledgeKind;
  size?: number;
  tile?: boolean;
}) {
  const nav: Record<KnowledgeKind, string> = {
    contracts: assets.kFilePen,
    facts: assets.kBookOpen,
    resources: assets.kBookCopy,
    twin: assets.kMind,
  };
  const src =
    tile && kind === 'contracts'
      ? size >= 30
        ? assets.kFilePenLg
        : assets.kFilePenSm
      : nav[kind];
  return (
    <span
      className={clsx('proto-k-icon', `proto-k-icon--${kind}`, tile && 'proto-k-icon--tile')}
      style={{width: size, height: size}}
      aria-hidden="true"
    >
      <span className="proto-k-icon__vec">
        <span className="proto-k-icon__pad">
          <img src={src} alt="" />
        </span>
      </span>
    </span>
  );
}

function scrollMask(src: string): CSSProperties {
  return {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
  };
}

function ScrollClosedIcon({size}: {size: number}) {
  const mask = scrollMask(assets.scrollClosed);
  return (
    <span className="proto-scroll-closed" style={{width: size, height: size}} aria-hidden="true">
      <span className="proto-scroll-closed__half proto-scroll-closed__half--top">
        <span className="proto-scroll-closed__inner" style={mask} />
      </span>
      <span className="proto-scroll-closed__half proto-scroll-closed__half--bottom">
        <span className="proto-scroll-closed__flip">
          <span className="proto-scroll-closed__inner" style={mask} />
        </span>
      </span>
    </span>
  );
}

function ScrollOpenIcon({size}: {size: number}) {
  return (
    <span className="proto-scroll-open" style={{width: size, height: size}} aria-hidden="true">
      <span className="proto-scroll-open__vec">
        <span className="proto-scroll-open__pad">
          <img src={assets.scrollOpen} alt="" />
        </span>
      </span>
    </span>
  );
}

function EmptyTile({
  className,
  size,
  bg,
  glyph,
  kind,
  iconSrc,
  lineKind,
  style,
}: {
  className: string;
  size: number;
  bg?: string;
  glyph?: string;
  kind?: AppIconKind;
  iconSrc?: string;
  lineKind?: KnowledgeKind;
  style: CSSProperties;
}) {
  return (
    <div className={className} style={style}>
      <span className="proto-float__motion">
        {lineKind ? (
          <KnowledgeIcon kind={lineKind} size={size} tile />
        ) : iconSrc ? (
          <ScrollOpenIcon size={size} />
        ) : (
          <span
            className={clsx('proto-app-icon', kind && `proto-app-icon--${kind}`)}
            style={{width: size, height: size}}
          >
            <img className="proto-app-icon__bg" src={bg} alt="" />
            <span className="proto-app-icon__glyph-wrap">
              <img src={glyph} alt="" />
            </span>
          </span>
        )}
      </span>
    </div>
  );
}

const EMPTY_TILES: Array<{
  className: string;
  size: number;
  kind: AppIconKind;
  bg: keyof typeof assets;
  glyph: keyof typeof assets;
  left: string;
  top: string;
}> = [
  {
    className: 'proto-float proto-float--lg',
    size: 36,
    kind: 'general' as const,
    bg: 'emptyGeneralLgBg',
    glyph: 'emptyGeneralLgGlyph',
    left: '20.6%',
    top: '32.6%',
  },
  {
    className: 'proto-float proto-float--sm',
    size: 23,
    kind: 'general' as const,
    bg: 'emptyGeneralSmBg',
    glyph: 'emptyGeneralSmGlyph',
    left: '75%',
    top: '57.1%',
  },
  {
    className: 'proto-float proto-float--sm',
    size: 23,
    kind: 'compliance' as const,
    bg: 'emptyComplianceSmBg',
    glyph: 'emptyComplianceSmGlyph',
    left: '24.7%',
    top: '58.8%',
  },
  {
    className: 'proto-float proto-float--sm',
    size: 23,
    kind: 'litigation' as const,
    bg: 'emptyLitigationSmBg',
    glyph: 'emptyLitigationSmGlyph',
    left: '62.5%',
    top: '28.6%',
  },
  {
    className: 'proto-float proto-float--lg',
    size: 36,
    kind: 'compliance' as const,
    bg: 'emptyComplianceLgBg',
    glyph: 'emptyComplianceLgGlyph',
    left: '73.9%',
    top: '24.7%',
  },
  {
    className: 'proto-float proto-float--lg',
    size: 36,
    kind: 'litigation' as const,
    bg: 'emptyLitigationLgBg',
    glyph: 'emptyLitigationLgGlyph',
    left: '30.8%',
    top: '65.4%',
  },
  {
    className: 'proto-float proto-float--lg',
    size: 36,
    kind: 'ma' as const,
    bg: 'emptyMaLgBg',
    glyph: 'emptyMaLgGlyph',
    left: '67.1%',
    top: '63.6%',
  },
  {
    className: 'proto-float proto-float--sm',
    size: 23,
    kind: 'ma' as const,
    bg: 'emptyMaSmBg',
    glyph: 'emptyMaSmGlyph',
    left: '33.2%',
    top: '20.6%',
  },
];

const KNOWLEDGE_TILES = [
  {className: 'proto-float proto-float--lg', size: 36, left: '20.6%', top: '32.6%'},
  {className: 'proto-float proto-float--sm', size: 23, left: '75%', top: '57.1%'},
  {className: 'proto-float proto-float--sm', size: 23, left: '24.7%', top: '58.8%'},
  {className: 'proto-float proto-float--sm', size: 23, left: '62.5%', top: '28.6%'},
  {className: 'proto-float proto-float--lg', size: 36, left: '73.9%', top: '24.7%'},
  {className: 'proto-float proto-float--lg', size: 36, left: '30.8%', top: '65.4%'},
  {className: 'proto-float proto-float--lg', size: 36, left: '67.1%', top: '63.6%'},
  {className: 'proto-float proto-float--sm', size: 23, left: '33.2%', top: '20.6%'},
];

const KNOWLEDGE_TYPES: Array<{
  kind: KnowledgeKind;
  label: string;
  chevron?: boolean;
}> = [
  {kind: 'contracts', label: 'Executed contracts'},
  {kind: 'facts', label: 'Fact libraries'},
  {kind: 'resources', label: 'Resources'},
  {kind: 'twin', label: 'Digital Twin', chevron: true},
];

const KNOWLEDGE_COPY: Record<
  KnowledgeKind,
  {title: string; description: string; noun: string}
> = {
  contracts: {
    title: 'No executed contracts yet',
    description: 'Create a table to start tracking your executed contracts.',
    noun: 'executed contracts',
  },
  facts: {
    title: 'No fact libraries yet',
    description: 'Create a table to start tracking your fact libraries.',
    noun: 'fact libraries',
  },
  resources: {
    title: 'No resources yet',
    description: 'Create a table to start tracking your resources.',
    noun: 'resources',
  },
  twin: {
    title: 'No Digital Twin yet',
    description: 'Create a table to start tracking your Digital Twin.',
    noun: 'Digital Twin tables',
  },
};

function EmptyCanvas({
  burst,
  icon = 'folder',
  title,
  description,
  ctaLabel,
  tiles,
  tileKind,
  onCreate,
}: {
  burst: boolean;
  icon?: 'folder' | 'scroll';
  title: string;
  description?: string;
  ctaLabel: string;
  tileKind?: KnowledgeKind;
  tiles: Array<{
    className: string;
    size: number;
    left: string;
    top: string;
    kind?: AppIconKind;
    bg?: keyof typeof assets;
    glyph?: keyof typeof assets;
    icon?: 'scroll';
  }>;
  onCreate: () => void;
}) {
  const folderRef = useRef<HTMLDivElement>(null);
  const floatsRef = useRef<HTMLDivElement>(null);
  const [folderOpen, setFolderOpen] = useState(!burst);
  const [tilesOut, setTilesOut] = useState(!burst);
  const [drifting, setDrifting] = useState(!burst);

  useLayoutEffect(() => {
    const folder = folderRef.current;
    const floats = floatsRef.current;
    if (!burst || !folder || !floats) {
      return;
    }
    const folderBox = folder.getBoundingClientRect();
    const field = floats.getBoundingClientRect();
    const x = ((folderBox.left + folderBox.width / 2 - field.left) / field.width) * 100;
    const y = ((folderBox.top + folderBox.height / 2 - field.top) / field.height) * 100;
    floats.style.setProperty('--origin-x', `${x}%`);
    floats.style.setProperty('--origin-y', `${y}%`);
  }, [burst, folderOpen]);

  useEffect(() => {
    if (!burst) {
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setFolderOpen(true);
      setTilesOut(true);
      setDrifting(true);
      return;
    }
    setFolderOpen(false);
    setTilesOut(false);
    setDrifting(false);
    const open = window.setTimeout(() => setFolderOpen(true), 560);
    const burstOut = window.setTimeout(() => setTilesOut(true), 820);
    const drift = window.setTimeout(() => setDrifting(true), 2000);
    return () => {
      window.clearTimeout(open);
      window.clearTimeout(burstOut);
      window.clearTimeout(drift);
    };
  }, [burst]);

  return (
    <>
      <div
        ref={floatsRef}
        className={clsx(
          'proto-floats',
          burst && 'is-burst',
          tilesOut && 'is-out',
          drifting && 'is-drifting',
        )}
        aria-hidden="true"
      >
        {tiles.map((tile) => (
          <EmptyTile
            key={`${tile.left}-${tile.top}`}
            className={tile.className}
            size={tile.size}
            kind={tile.kind}
            bg={tile.bg ? assets[tile.bg] : undefined}
            glyph={tile.glyph ? assets[tile.glyph] : undefined}
            iconSrc={tile.icon === 'scroll' ? assets.scrollOpen : undefined}
            lineKind={tileKind}
            style={
              {
                ...(burst
                  ? {'--end-left': tile.left, '--end-top': tile.top}
                  : {left: tile.left, top: tile.top}),
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className={clsx('proto-empty', burst && 'is-burst', folderOpen && 'is-open')}>
        {burst ? (
          <div
            ref={folderRef}
            className={clsx('proto-empty__folder', folderOpen && 'is-open')}
            aria-hidden="true"
          >
            <span className="proto-empty__folder-closed">
              {icon === 'scroll' ? (
                <ScrollClosedIcon size={36} />
              ) : (
                <LucideIcon name="folder" size={36} />
              )}
            </span>
            <span className="proto-empty__folder-opened">
              {icon === 'scroll' ? (
                <ScrollOpenIcon size={36} />
              ) : (
                <LucideIcon name="folder-open" size={36} />
              )}
            </span>
          </div>
        ) : icon === 'scroll' ? (
          <ScrollOpenIcon size={36} />
        ) : (
          <Icon src={assets.folderOpen} size={36} />
        )}
        <div className="proto-empty__text">
          <p className="proto-empty__copy">{title}</p>
          {description ? <p className="proto-empty__desc">{description}</p> : null}
        </div>
        <button className="proto-btn" type="button" onClick={onCreate}>
          <Icon src={assets.plus} size={16} />
          {ctaLabel}
        </button>
      </div>
    </>
  );
}

const PLACEHOLDERS: Record<
  Exclude<ShellView, 'projects' | 'knowledge' | 'opportunities'>,
  {title: string; body: string}
> = {
  assistant: {
    title: 'Assistant',
    body: 'Ask Eudia anything across your matters. This pane is a placeholder in the prototype.',
  },
  intelligence: {
    title: 'Intelligence Hub',
    body: 'Cross-matter signals and reporting would appear here.',
  },
  chats: {
    title: 'All chats',
    body: 'Recent conversations would list here. Sidebar entries are still placeholders from the Figma file.',
  },
  configure: {
    title: 'Configure',
    body: 'Workspace and account settings would open from this item.',
  },
};

const OPP_CANVAS = {w: 1136, h: 928};
const OPP_HERO = {w: 532, h: 306, pad: 56};

const OPP_CONTRACTS = [
  {left: 902, top: 512.5, selected: false},
  {left: 162, top: 525, selected: false},
  {left: 531.5, top: 689.75, selected: false},
  {left: 496.5, top: 206.25, selected: false},
  {left: 855.33, top: 285, selected: false},
  {left: 179.5, top: 285, selected: true},
  {left: 650.26, top: 166.14, selected: true},
  {left: 872.83, top: 153.75, selected: false},
  {left: 265.04, top: 621.75, selected: true},
  {left: 833.09, top: 662.25, selected: true},
  {left: 292.04, top: 180, selected: false},
];

function oppPos(left: number, top: number): CSSProperties {
  return {
    '--end-left': `${(left / OPP_CANVAS.w) * 100}%`,
    '--end-top': `${(top / OPP_CANVAS.h) * 100}%`,
  } as CSSProperties;
}

function placeOppTiles(floats: HTMLElement) {
  const field = floats.getBoundingClientRect();
  if (field.width < 8 || field.height < 8) {
    return;
  }

  const hole = {
    left: (field.width - OPP_HERO.w) / 2 - OPP_HERO.pad,
    top: (field.height - OPP_HERO.h) / 2 - OPP_HERO.pad,
    right: (field.width + OPP_HERO.w) / 2 + OPP_HERO.pad,
    bottom: (field.height + OPP_HERO.h) / 2 + OPP_HERO.pad,
  };

  floats.querySelectorAll<HTMLElement>('.opp-contract').forEach((el) => {
    const figLeft = Number(el.dataset.figLeft);
    const figTop = Number(el.dataset.figTop);
    const size = el.dataset.willSelect === '1' ? 54 : 35;
    let x = (figLeft / OPP_CANVAS.w) * field.width;
    let y = (figTop / OPP_CANVAS.h) * field.height;

    const overlaps =
      x < hole.right &&
      x + size > hole.left &&
      y < hole.bottom &&
      y + size > hole.top;

    if (overlaps) {
      const hx = field.width / 2;
      const hy = field.height / 2;
      let dx = x + size / 2 - hx;
      let dy = y + size / 2 - hy;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        dy = -1;
      }
      const len = Math.hypot(dx, dy);
      dx /= len;
      dy /= len;
      const max = Math.max(field.width, field.height);
      for (let dist = 0; dist < max; dist += 4) {
        const nx = hx + dx * dist - size / 2;
        const ny = hy + dy * dist - size / 2;
        const clear =
          nx + size <= hole.left ||
          nx >= hole.right ||
          ny + size <= hole.top ||
          ny >= hole.bottom;
        if (clear) {
          x = nx;
          y = ny;
          break;
        }
      }
    }

    x = Math.min(Math.max(12, x), field.width - size - 12);
    y = Math.min(Math.max(12, y), field.height - size - 12);
    el.style.setProperty('--end-left', `${(x / field.width) * 100}%`);
    el.style.setProperty('--end-top', `${(y / field.height) * 100}%`);
  });
}

function OppScrollIcon({size}: {size: number}) {
  return (
    <span className="opp-scroll" style={{width: size, height: size}}>
      <span className="opp-scroll__vec">
        <span className="opp-scroll__pad">
          <img src={assets.oppScrollGray} alt="" />
        </span>
      </span>
    </span>
  );
}

function OpportunitiesPage(): ReactElement {
  const floatsRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [tilesOut, setTilesOut] = useState(false);
  const [picked, setPicked] = useState<number[]>([]);
  const [drifting, setDrifting] = useState(false);

  useLayoutEffect(() => {
    const floats = floatsRef.current;
    const scope = scopeRef.current;
    if (!floats || !scope) {
      return;
    }

    const place = () => {
      const scopeBox = scope.getBoundingClientRect();
      const field = floats.getBoundingClientRect();
      if (field.width < 8 || field.height < 8) {
        return;
      }
      const x = ((scopeBox.left + scopeBox.width / 2 - field.left) / field.width) * 100;
      const y = ((scopeBox.top + scopeBox.height / 2 - field.top) / field.height) * 100;
      floats.style.setProperty('--origin-x', `${x}%`);
      floats.style.setProperty('--origin-y', `${y}%`);
      placeOppTiles(floats);
    };

    place();
    const observer = new ResizeObserver(place);
    observer.observe(floats);
    return () => observer.disconnect();
  }, [scopeOpen]);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setScopeOpen(true);
      setTilesOut(true);
      setPicked(
        OPP_CONTRACTS.flatMap((item, index) => (item.selected ? [index] : [])),
      );
      setDrifting(true);
      return;
    }

    setScopeOpen(false);
    setTilesOut(false);
    setPicked([]);
    setDrifting(false);

    const selectable = OPP_CONTRACTS.flatMap((item, index) =>
      item.selected ? [index] : [],
    );
    for (let i = selectable.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [selectable[i], selectable[j]] = [selectable[j], selectable[i]];
    }

    const pickStart = 1150;
    const pickGap = 320;

    const pose = window.setTimeout(() => setScopeOpen(true), 40);
    const burst = window.setTimeout(() => setTilesOut(true), 90);
    const picks = selectable.map((index, order) =>
      window.setTimeout(() => {
        setPicked((current) =>
          current.includes(index) ? current : [...current, index],
        );
      }, pickStart + order * pickGap),
    );
    const drift = window.setTimeout(() => setDrifting(true), pickStart + 200);

    return () => {
      window.clearTimeout(pose);
      window.clearTimeout(burst);
      picks.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(drift);
    };
  }, []);

  return (
    <div className="proto-card">
      <header className="proto-page-header">
        <h1 className="proto-page-title">Opportunities</h1>
      </header>
      <div className="proto-body opp-body">
        <div className="opp-canvas">
          <div
            ref={floatsRef}
            className={clsx(
              'opp-floats',
              tilesOut && 'is-out',
              picked.length > 0 && 'is-selected',
              drifting && 'is-drifting',
            )}
            aria-hidden="true"
          >
            {OPP_CONTRACTS.map((item, index) => (
              <div
                key={`${item.left}-${item.top}`}
                className={clsx(
                  'opp-contract',
                  item.selected && picked.includes(index) && 'is-picked',
                )}
                data-fig-left={item.left}
                data-fig-top={item.top}
                data-will-select={item.selected ? '1' : '0'}
                style={
                  {
                    ...oppPos(item.left, item.top),
                    '--opp-stagger': `${index * 55}ms`,
                  } as CSSProperties
                }
              >
                <span className="opp-contract__motion">
                  <span className="opp-contract__tile">
                    <span className="opp-contract__icon opp-contract__icon--gray">
                      <OppScrollIcon size={23.333} />
                    </span>
                    <span className="opp-contract__icon opp-contract__icon--blue">
                      <img
                        className="opp-contract__doc"
                        src={assets.oppContractDoc}
                        alt=""
                        width={30}
                        height={38}
                      />
                    </span>
                    {item.selected ? (
                      <span className="opp-contract__badge">
                        <img src={assets.oppSelectBadge} alt="" />
                      </span>
                    ) : null}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <div
            className="opp-hero is-static"
          >
            <div
              ref={scopeRef}
              className={clsx('opp-scope', scopeOpen && 'is-open')}
              aria-hidden="true"
            >
              <span className="opp-scope__barrel">
                <img src={assets.oppTelescopeBarrel} alt="" width={36} height={36} />
              </span>
              <span className="opp-scope__tripod">
                <img src={assets.oppTelescopeTripod} alt="" width={36} height={36} />
              </span>
            </div>
            <div className="opp-hero__copy">
              <h2 className="opp-hero__title">
                <span className="opp-hero__line">Discover contracts.</span>
                <span className="opp-hero__line">Build proposals that win.</span>
              </h2>
              <p className="opp-hero__desc">
                Create an offering profile to get matched with relevant solicitations, then let
                your agents help you draft a strong, compliant proposal from first draft to
                submission.
              </p>
            </div>
            <button className="opp-cta" type="button">
              Start now
              <Icon src={assets.oppArrowRight} size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AllProjectsApp(): ReactElement {
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState<ShellView>('projects');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('general');
  const [knowledgeType, setKnowledgeType] = useState<KnowledgeKind>('contracts');
  const [knowledgeTab, setKnowledgeTab] = useState<KnowledgeTab>('active');
  const [knowledgeTables, setKnowledgeTables] = useState<KnowledgeTable[]>([]);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [ownership, setOwnership] = useState<Ownership>('all');
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftType, setDraftType] = useState<ProjectKind>('general');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDialogOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((project) => {
      if (typeFilter === 'favorites' && !project.favorite) {
        return false;
      }
      if (typeFilter !== 'favorites' && project.type !== typeFilter) {
        return false;
      }
      if (ownership === 'owned' && project.owner !== 'me') {
        return false;
      }
      if (ownership === 'shared' && project.owner !== 'shared') {
        return false;
      }
      if (q && !project.name.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [ownership, projects, query, typeFilter]);

  const visibleTables = useMemo(() => {
    const archived = knowledgeTab === 'archived';
    return knowledgeTables.filter(
      (table) => table.kind === knowledgeType && table.archived === archived,
    );
  }, [knowledgeTab, knowledgeTables, knowledgeType]);

  const knowledgeCopy = KNOWLEDGE_COPY[knowledgeType];
  const knowledgeEmptyTitle =
    knowledgeTab === 'archived'
      ? `No archived ${knowledgeCopy.noun} yet`
      : knowledgeCopy.title;
  const knowledgeEmptyDescription =
    knowledgeTab === 'archived'
      ? 'Archived tables will appear here.'
      : knowledgeCopy.description;

  const openCreate = () => {
    setDraftName('');
    setDraftType(typeFilter === 'favorites' ? 'general' : typeFilter);
    setDialogOpen(true);
  };

  const createProject = () => {
    const name = draftName.trim();
    if (!name) {
      return;
    }
    const next: Project = {
      id: `new-${Date.now()}`,
      name,
      type: draftType,
      owner: 'me',
      favorite: typeFilter === 'favorites',
      updatedAt: 'Updated just now',
    };
    setProjects((current) => [next, ...current]);
    setTypeFilter(draftType);
    setOwnership('all');
    setQuery('');
    setSelectedId(next.id);
    setDialogOpen(false);
    setView('projects');
  };

  const createTable = () => {
    const label = KNOWLEDGE_TYPES.find((item) => item.kind === knowledgeType)?.label ?? 'Table';
    const count = knowledgeTables.filter((table) => table.kind === knowledgeType).length + 1;
    const next: KnowledgeTable = {
      id: `kt-${Date.now()}`,
      kind: knowledgeType,
      name: `${label} ${count}`,
      archived: knowledgeTab === 'archived',
      updatedAt: 'Updated just now',
    };
    setKnowledgeTables((current) => [next, ...current]);
    setSelectedTableId(next.id);
  };

  const toggleFavorite = (id: string) => {
    setProjects((current) =>
      current.map((project) =>
        project.id === id ? {...project, favorite: !project.favorite} : project,
      ),
    );
  };

  const typeLabel: Record<TypeFilter, string> = {
    favorites: 'Favorites',
    general: 'General projects',
    compliance: 'Compliance',
    ma: 'M&A',
    litigation: 'Litigation',
  };

  return (
    <div className={clsx('proto-app', collapsed && 'proto-app--collapsed')}>
      <aside className="proto-sidebar">
        <div className="proto-sidebar__header">
          <div className="proto-sidebar__top">
            <div className="proto-sidebar__brand">
              <div className="proto-sidebar__logo">
                <img src={assets.logo} alt="EUDIA" />
              </div>
            </div>
            <button
              className="proto-icon-btn"
              type="button"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setCollapsed((value) => !value)}
            >
              <Icon src={assets.panelLeft} size={16} />
            </button>
          </div>
        </div>

        <div className="proto-sidebar__main">
          <div className="proto-nav-group">
            <button
              className={clsx('proto-nav-btn', view === 'assistant' && 'is-active')}
              type="button"
              onClick={() => setView('assistant')}
            >
              <Icon src={assets.askAi} size={16} />
              <span className="proto-nav-btn__label">Assistant</span>
            </button>
            <button
              className={clsx('proto-nav-btn', view === 'knowledge' && 'is-active')}
              type="button"
              onClick={() => setView('knowledge')}
            >
              <Icon src={assets.graduationCap} size={16} />
              <span className="proto-nav-btn__label">Knowledge</span>
            </button>
            <button
              className={clsx('proto-nav-btn', view === 'intelligence' && 'is-active')}
              type="button"
              onClick={() => setView('intelligence')}
            >
              <Icon src={assets.areaChart} size={16} />
              <span className="proto-nav-btn__label">Intelligence Hub</span>
            </button>
            <button
              className={clsx('proto-nav-btn', view === 'opportunities' && 'is-active')}
              type="button"
              onClick={() => setView('opportunities')}
            >
              <Icon src={assets.telescope} size={16} />
              <span className="proto-nav-btn__label">Opportunities</span>
            </button>
          </div>

          <div className="proto-nav-group">
            <div className="proto-nav-label">Recent projects</div>
            <button
              className="proto-switcher"
              type="button"
              onClick={() => {
                setView('projects');
                setTypeFilter('general');
              }}
            >
              <AppIcon kind="general" />
              <span className="proto-switcher__label">Project 1</span>
            </button>
            <button
              className="proto-switcher"
              type="button"
              onClick={() => {
                setView('projects');
                setTypeFilter('ma');
                setSelectedId('m1');
              }}
            >
              <AppIcon kind="project2" />
              <span className="proto-switcher__label">Project 2</span>
            </button>
            <button
              className="proto-switcher"
              type="button"
              onClick={() => {
                setView('projects');
                setTypeFilter('compliance');
              }}
            >
              <AppIcon kind="compliance" />
              <span className="proto-switcher__label">Project 3</span>
            </button>
            <button
              className={clsx('proto-nav-btn', view === 'projects' && 'is-active')}
              type="button"
              onClick={() => setView('projects')}
            >
              <Icon src={assets.layoutList} size={16} />
              <span className="proto-nav-btn__label">All projects</span>
              <span className="proto-nav-btn__badge">{projects.length}</span>
            </button>
          </div>

          <div className="proto-nav-group">
            <div className="proto-nav-label">Recent chats</div>
            <button className="proto-nav-btn" type="button" onClick={() => setView('chats')}>
              <span className="proto-nav-btn__label">{'<Recent chat 1>'}</span>
            </button>
            <button className="proto-nav-btn" type="button" onClick={() => setView('chats')}>
              <span className="proto-nav-btn__label">{'<Recent chat 2>'}</span>
            </button>
            <button className="proto-nav-btn" type="button" onClick={() => setView('chats')}>
              <span className="proto-nav-btn__label">{'<Recent chat 3>'}</span>
            </button>
            <button
              className={clsx('proto-nav-btn', view === 'chats' && 'is-active')}
              type="button"
              onClick={() => setView('chats')}
            >
              <Icon src={assets.messageCircle} size={16} />
              <span className="proto-nav-btn__label">All chats</span>
            </button>
          </div>

          <div className="proto-nav-group">
            <button
              className={clsx('proto-nav-btn', view === 'configure' && 'is-active')}
              type="button"
              onClick={() => setView('configure')}
            >
              <Icon src={assets.settings} size={16} />
              <span className="proto-nav-btn__label">Configure</span>
              <Icon src={assets.chevronRight} size={16} />
            </button>
          </div>
        </div>

        <div className="proto-sidebar__footer">
          <button className="proto-user" type="button">
            <span className="proto-avatar">JD</span>
            <span className="proto-user__meta">
              <span className="proto-user__name">John Doe</span>
              <span className="proto-user__email">john.doe@eudia.com</span>
            </span>
            <Icon src={assets.chevrons} size={16} />
          </button>
        </div>
      </aside>

      <main className="proto-main">
        {view === 'projects' ? (
          <div className="proto-card">
            <header className="proto-page-header">
              <h1 className="proto-page-title">All your projects</h1>
            </header>
            <div className="proto-body">
              <div className="proto-split">
                <nav className="proto-types" aria-label="Project type">
                  <div className="proto-types__header">
                    <p>Type</p>
                  </div>
                  <div className="proto-types__list">
                    <button
                      className={clsx('proto-type-btn', typeFilter === 'favorites' && 'is-active')}
                      type="button"
                      onClick={() => setTypeFilter('favorites')}
                    >
                      <Icon src={assets.star} size={16} />
                      <span className="proto-type-btn__label">Favorites</span>
                    </button>
                    <button
                      className={clsx('proto-type-btn', typeFilter === 'general' && 'is-active')}
                      type="button"
                      onClick={() => setTypeFilter('general')}
                    >
                      <AppIcon kind="general" />
                      <span className="proto-type-btn__label">General projects</span>
                    </button>
                    <button
                      className={clsx('proto-type-btn', typeFilter === 'compliance' && 'is-active')}
                      type="button"
                      onClick={() => setTypeFilter('compliance')}
                    >
                      <AppIcon kind="compliance" />
                      <span className="proto-type-btn__label">Compliance</span>
                    </button>
                    <button
                      className={clsx('proto-type-btn', typeFilter === 'ma' && 'is-active')}
                      type="button"
                      onClick={() => setTypeFilter('ma')}
                    >
                      <AppIcon kind="ma" />
                      <span className="proto-type-btn__label">M&A</span>
                    </button>
                    <button
                      className={clsx('proto-type-btn', typeFilter === 'litigation' && 'is-active')}
                      type="button"
                      onClick={() => setTypeFilter('litigation')}
                    >
                      <AppIcon kind="litigation" />
                      <span className="proto-type-btn__label">Litigation</span>
                    </button>
                  </div>
                </nav>

                <section className="proto-workspace">
                  <div className="proto-workspace__header">
                    <div className="proto-workspace__tabs-wrap">
                      <div className="proto-tabs" role="tablist" aria-label="Ownership">
                        <button
                          className={clsx('proto-tab', ownership === 'all' && 'is-active')}
                          type="button"
                          onClick={() => setOwnership('all')}
                        >
                          All
                        </button>
                        <button
                          className={clsx('proto-tab', ownership === 'owned' && 'is-active')}
                          type="button"
                          onClick={() => setOwnership('owned')}
                        >
                          <Icon src={assets.archive} size={16} />
                          Owned by me
                        </button>
                        <button
                          className={clsx('proto-tab', ownership === 'shared' && 'is-active')}
                          type="button"
                          onClick={() => setOwnership('shared')}
                        >
                          Shared with me
                        </button>
                      </div>
                    </div>
                    <div className="proto-actions">
                      {visible.length > 0 || query.trim() ? (
                        <>
                          <label className="proto-search">
                            <Icon src={assets.search} size={16} />
                            <input
                              type="search"
                              placeholder="Search"
                              value={query}
                              onChange={(event) => setQuery(event.target.value)}
                              aria-label="Search projects"
                            />
                          </label>
                          <button className="proto-btn" type="button" onClick={openCreate}>
                            <Icon src={assets.plus} size={16} />
                            Project
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>

                  <div className="proto-workspace__body">
                    {visible.length === 0 ? (
                      <EmptyCanvas
                        key={`${typeFilter}-${ownership}-${query}`}
                        burst={typeFilter === 'compliance'}
                        title="No projects found"
                        ctaLabel="Project"
                        tiles={EMPTY_TILES}
                        onCreate={openCreate}
                      />
                    ) : (
                      <div className="proto-list">
                        {visible.map((project) => (
                          <div
                            key={project.id}
                            className="proto-list-row"
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedId(project.id)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                setSelectedId(project.id);
                              }
                            }}
                            style={
                              selectedId === project.id
                                ? {background: 'var(--base-sec-sidebar-active)'}
                                : undefined
                            }
                          >
                            <AppIcon kind={project.type} />
                            <span className="proto-list-row__name">{project.name}</span>
                            <span className="proto-list-row__meta">
                              {project.owner === 'me' ? 'John Doe' : 'Shared'}
                            </span>
                            <span className="proto-list-row__meta">{project.updatedAt}</span>
                            <button
                              className={clsx('proto-star', project.favorite && 'is-on')}
                              type="button"
                              aria-label={
                                project.favorite ? 'Remove from favorites' : 'Add to favorites'
                              }
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleFavorite(project.id);
                              }}
                            >
                              <Icon src={assets.star} size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {dialogOpen && (
                      <div className="proto-overlay" onClick={() => setDialogOpen(false)}>
                        <form
                          className="proto-dialog"
                          onClick={(event) => event.stopPropagation()}
                          onSubmit={(event) => {
                            event.preventDefault();
                            createProject();
                          }}
                        >
                          <h2>New project</h2>
                          <div className="proto-field">
                            <label htmlFor="proto-project-name">Name</label>
                            <input
                              id="proto-project-name"
                              autoFocus
                              value={draftName}
                              onChange={(event) => setDraftName(event.target.value)}
                              placeholder={`${typeLabel[draftType]} name`}
                            />
                          </div>
                          <div className="proto-field">
                            <span>Type</span>
                            <div className="proto-type-picks">
                              {(
                                [
                                  ['general', 'General'],
                                  ['compliance', 'Compliance'],
                                  ['ma', 'M&A'],
                                  ['litigation', 'Litigation'],
                                ] as const
                              ).map(([kind, label]) => (
                                <button
                                  key={kind}
                                  className={clsx(
                                    'proto-type-pick',
                                    draftType === kind && 'is-active',
                                  )}
                                  type="button"
                                  onClick={() => setDraftType(kind)}
                                >
                                  <AppIcon kind={kind} />
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="proto-dialog__actions">
                            <button
                              className="proto-btn proto-btn--ghost"
                              type="button"
                              onClick={() => setDialogOpen(false)}
                            >
                              Cancel
                            </button>
                            <button className="proto-btn" type="submit">
                              <Icon src={assets.plus} size={16} />
                              Project
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        ) : view === 'knowledge' ? (
          <div className="proto-card">
            <header className="proto-page-header">
              <h1 className="proto-page-title">Knowledge</h1>
            </header>
            <div className="proto-body">
              <div className="proto-split">
                <nav className="proto-types" aria-label="Knowledge type">
                  <div className="proto-types__header">
                    <p>Type</p>
                  </div>
                  <div className="proto-types__list">
                    {KNOWLEDGE_TYPES.map((item) => {
                      const count = knowledgeTables.filter(
                        (table) => table.kind === item.kind,
                      ).length;
                      return (
                        <button
                          key={item.kind}
                          className={clsx(
                            'proto-type-btn proto-type-btn--knowledge',
                            knowledgeType === item.kind && 'is-active',
                          )}
                          type="button"
                          onClick={() => setKnowledgeType(item.kind)}
                        >
                          <KnowledgeIcon kind={item.kind} />
                          <span className="proto-type-btn__label">{item.label}</span>
                          {item.chevron ? (
                            <span className="proto-type-btn__chevron">
                              <Icon src={assets.chevronRight} size={16} />
                            </span>
                          ) : (
                            <span className="proto-type-btn__badge">{count}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </nav>

                <section className="proto-workspace">
                  <div className="proto-workspace__header">
                    <div className="proto-workspace__tabs-wrap">
                      <div className="proto-tabs" role="tablist" aria-label="Status">
                        <button
                          className={clsx('proto-tab', knowledgeTab === 'active' && 'is-active')}
                          type="button"
                          onClick={() => setKnowledgeTab('active')}
                        >
                          Active
                        </button>
                        <button
                          className={clsx('proto-tab', knowledgeTab === 'archived' && 'is-active')}
                          type="button"
                          onClick={() => setKnowledgeTab('archived')}
                        >
                          Archived
                        </button>
                      </div>
                    </div>
                    <div className="proto-actions">
                      {visibleTables.length > 0 ? (
                        <button className="proto-btn" type="button" onClick={createTable}>
                          <Icon src={assets.plus} size={16} />
                          Create table
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="proto-workspace__body">
                    {visibleTables.length === 0 ? (
                      <EmptyCanvas
                        key={`${knowledgeType}-${knowledgeTab}`}
                        burst
                        icon="scroll"
                        title={knowledgeEmptyTitle}
                        description={knowledgeEmptyDescription}
                        ctaLabel="Create table"
                        tiles={KNOWLEDGE_TILES}
                        tileKind={knowledgeType}
                        onCreate={createTable}
                      />
                    ) : (
                      <div className="proto-list">
                        {visibleTables.map((table) => (
                          <div
                            key={table.id}
                            className="proto-list-row proto-list-row--knowledge"
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedTableId(table.id)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                setSelectedTableId(table.id);
                              }
                            }}
                            style={
                              selectedTableId === table.id
                                ? {background: 'var(--base-sec-sidebar-active)'}
                                : undefined
                            }
                          >
                            <KnowledgeIcon kind={table.kind} />
                            <span className="proto-list-row__name">{table.name}</span>
                            <span className="proto-list-row__meta">{table.updatedAt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        ) : view === 'opportunities' ? (
          <OpportunitiesPage />
        ) : (
          <div className="proto-card">
            <div className="proto-placeholder">
              <h1>{PLACEHOLDERS[view].title}</h1>
              <p>{PLACEHOLDERS[view].body}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
