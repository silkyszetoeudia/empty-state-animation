import {
  useCallback,
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
  | 'note'
  | 'assistant'
  | 'knowledge'
  | 'intelligence'
  | 'opportunities'
  | 'horizon'
  | 'acquisition'
  | 'acq-fill'
  | 'onboarding'
  | 'connectors'
  | 'twin'
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

function AskAiIcon(): ReactElement {
  return (
    <span className="proto-ask-ai" aria-hidden="true">
      <svg viewBox="0 0 16 16" fill="none">
        <path
          className="proto-ask-ai__ring proto-ask-ai__ring--a"
          d="M7.12549 14.2491C4.76186 14.7364 2.6964 14.2564 1.86731 12.8164C0.645494 10.6927 2.56549 7.28908 6.16549 5.20908C9.76549 3.12908 13.6782 3.16544 14.9 5.28908C15.5764 6.45999 15.2928 8.02362 14.2964 9.53635"
          pathLength={1}
        />
        <path
          className="proto-ask-ai__ring proto-ask-ai__ring--b"
          d="M11.3914 2.29278C12.3654 3.97985 10.8342 6.68738 7.97144 8.34022C5.10864 9.99306 1.99828 9.96531 1.02425 8.27824C0.0502192 6.59117 1.58137 3.88364 4.44417 2.2308C7.30697 0.577966 10.4173 0.605715 11.3914 2.29278Z"
          pathLength={1}
        />
        <path
          className="proto-ask-ai__star"
          d="M11.2855 14.9909L10.3691 13.2891L8.72549 12.4309L10.4273 11.5654L11.2855 9.86362L12.1437 11.5291L13.8455 12.4309L12.2164 13.2891L11.2855 14.9909Z"
        />
      </svg>
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
  hsCalendar: `${ICONS}/hs-calendar.svg`,
  hsClockBadge: `${ICONS}/hs-clock-badge.svg`,
  onboardEudia: `${ICONS}/onboard-eudia.svg`,
  loaderPinwheel: `${ICONS}/loader-pinwheel.svg`,
  connLaptop: `${ICONS}/connectors/laptop.svg`,
  twinHalo: `${ICONS}/twin/brain-halo.svg`,
  twinMid: `${ICONS}/twin/brain-mid.svg`,
  twinEmpty: `${ICONS}/twin/brain-empty.svg`,
  twinFill: `${ICONS}/twin/brain-fill.svg`,
  twinStroke: `${ICONS}/twin/brain-stroke.svg`,
  twinDoc: `${ICONS}/twin/doc.svg`,
  twinPdf: `${ICONS}/twin/pdf.svg`,
  acqBlocks: `${ICONS}/acq/blocks.svg`,
  acqFileText: `${ICONS}/acq/file-text.svg`,
  acqHammer: `${ICONS}/acq/hammer.svg`,
  acqSettings: `${ICONS}/acq/settings.svg`,
  acqCheck: `${ICONS}/acq/check.svg`,
  acqAward: `${ICONS}/acq/award.svg`,
  acqChevronDown: `${ICONS}/acq/chevron-down.svg`,
  acqListTodo: `${ICONS}/acq/list-todo.svg`,
  acqPackage: `${ICONS}/acq/package.svg`,
  acqHandCoins: `${ICONS}/acq/hand-coins.svg`,
  acqFileBadge: `${ICONS}/acq/file-badge.svg`,
  acqArrowDownUp: `${ICONS}/acq/arrow-down-up.svg`,
  acqEllipsis: `${ICONS}/acq/ellipsis.svg`,
} as const;

const TWIN_CIRCUIT: Array<{src: string; inset: string}> = [
  {src: `${ICONS}/twin/circuit-node.svg`, inset: '26.36% 44.18% 70.07% 54.16%'},
  {src: `${ICONS}/twin/circuit-node.svg`, inset: '41.79% 38.22% 54.64% 60.12%'},
  {src: `${ICONS}/twin/circuit-node.svg`, inset: '49.68% 41.8% 46.75% 56.55%'},
  {src: `${ICONS}/twin/circuit-node.svg`, inset: '57.12% 38.22% 39.31% 60.12%'},
  {src: `${ICONS}/twin/circuit-node.svg`, inset: '70.07% 41.8% 26.36% 56.55%'},
  {src: `${ICONS}/twin/circuit-node.svg`, inset: '31.51% 39.41% 64.92% 58.93%'},
  {src: `${ICONS}/twin/circuit-node.svg`, inset: '26.36% 52.52% 70.07% 45.82%'},
  {src: `${ICONS}/twin/circuit-node-alt.svg`, inset: '41.79% 57.29% 54.64% 41.06%'},
  {src: `${ICONS}/twin/circuit-node.svg`, inset: '49.68% 53.71% 46.75% 44.63%'},
  {src: `${ICONS}/twin/circuit-node.svg`, inset: '57.12% 57.29% 39.31% 41.06%'},
  {src: `${ICONS}/twin/circuit-node.svg`, inset: '70.07% 53.71% 26.36% 44.63%'},
  {src: `${ICONS}/twin/circuit-node.svg`, inset: '31.51% 56.1% 64.92% 42.25%'},
  {src: `${ICONS}/twin/circuit-5.svg`, inset: '29.41% 48.58% 66.71% 47.23%'},
  {src: `${ICONS}/twin/circuit-6.svg`, inset: '34.67% 48.58% 59% 43.72%'},
  {src: `${ICONS}/twin/circuit-7.svg`, inset: '45.04% 55.23% 49.73% 42.35%'},
  {src: `${ICONS}/twin/circuit-node.svg`, inset: '57.12% 51.33% 39.31% 47.01%'},
  {src: `${ICONS}/twin/circuit-node.svg`, inset: '57.12% 44.18% 39.31% 54.16%'},
  {src: `${ICONS}/twin/circuit-8.svg`, inset: '58.91% 48.58% 41.09% 48.67%'},
  {src: `${ICONS}/twin/circuit-9.svg`, inset: '29.93% 45.01% 53.94% 51.42%'},
  {src: `${ICONS}/twin/circuit-10.svg`, inset: '45.36% 39.05% 42.88% 60.95%'},
  {src: `${ICONS}/twin/circuit-11.svg`, inset: '51.44% 45.51% 42.51% 51.42%'},
  {src: `${ICONS}/twin/circuit-12.svg`, inset: '34.74% 40.73% 50.32% 57.38%'},
  {src: `${ICONS}/twin/circuit-13.svg`, inset: '33.29% 43.2% 29.51% 51.42%'},
  {src: `${ICONS}/twin/circuit-14.svg`, inset: '60.07% 54.59% 29.98% 42.62%'},
];

const TWIN_BRAIN_CX = 296.15;
const TWIN_BRAIN_CY = 133.51;

const TWIN_SATS = [
  {id: 'doc', left: 17.24, top: 53.41, width: 58.37, height: 80.79, src: `${ICONS}/twin/doc.svg`},
  {id: 'pdf', left: 97.9, top: 32.53, width: 33.22, height: 45.98, src: `${ICONS}/twin/pdf.svg`},
  {id: 'contract', left: 97.9, top: 160.06, width: 50.26, height: 62.38, src: `${ICONS}/twin/contract.svg`},
  {id: 'folder-sm', left: 448.08, top: 11.77, width: 32.13, height: 24.35, src: `${ICONS}/twin/folder-sm.svg`},
  {id: 'folder-lg', left: 494.29, top: 57.65, width: 42.86, height: 32.46, src: `${ICONS}/twin/folder-lg.svg`},
  {id: 'message-1', left: 472.91, top: 120.41, width: 95.79, height: 43.51, src: `${ICONS}/twin/message-1.svg`},
  {id: 'message-2', left: 423.43, top: 179.49, width: 81.43, height: 36.98, src: `${ICONS}/twin/message-2.svg`},
];

const CONNECTORS = [
  {id: 'sharepoint', icon: `${ICONS}/connectors/sharepoint.svg`, angle: 270},
  {id: 'dropbox', icon: `${ICONS}/connectors/dropbox.svg`, angle: 315},
  {id: 'onedrive', icon: `${ICONS}/connectors/onedrive.svg`, angle: 0},
  {id: 'imanage', icon: `${ICONS}/connectors/imanage.svg`, angle: 45},
  {id: 'word', icon: `${ICONS}/connectors/word.svg`, angle: 90},
  {id: 'relativity', icon: `${ICONS}/connectors/relativity.svg`, angle: 135},
  {id: 'salesforce', icon: `${ICONS}/connectors/salesforce.svg`, angle: 180},
  {id: 'box', icon: `${ICONS}/connectors/box.svg`, angle: 225},
] as const;

const ONBOARD_TYPES = [
  {id: 'sigma', name: 'General Assistant', icon: `${ICONS}/onboard/sigma.svg`},
  {id: 'compliance', name: 'Compliance', icon: `${ICONS}/onboard/compliance.svg`},
  {id: 'contracting', name: 'Contracting', icon: `${ICONS}/onboard/contracting.svg`},
  {id: 'corp-governance', name: 'Corporate Governance', icon: `${ICONS}/onboard/corp-governance.svg`},
  {id: 'intel-property', name: 'Intellectual Property', icon: `${ICONS}/onboard/intel-property.svg`},
  {id: 'litigation', name: 'Litigation', icon: `${ICONS}/onboard/litigation.svg`},
  {id: 'ma', name: 'M&A', icon: `${ICONS}/onboard/ma.svg`},
  {id: 'real-estate', name: 'Real Estate', icon: `${ICONS}/onboard/real-estate.svg`},
  {id: 'reg-compliance', name: 'Regulatory Compliance', icon: `${ICONS}/onboard/reg-compliance.svg`},
  {id: 'solicitation', name: 'Solicitation', icon: `${ICONS}/onboard/solicitation.svg`},
] as const;

const ONBOARD_HOLD_MS = 1200;
const ONBOARD_MOVE_MS = 400;
const ONBOARD_NAME_FADE_MS = 140;

function onboardSlot(index: number, center: number, count: number) {
  let delta = ((index - center) % count + count) % count;
  if (delta > Math.floor((count - 1) / 2)) delta -= count;
  return delta;
}

function LucideIcon({
  name,
  size,
}: {
  name: 'folder' | 'folder-open' | 'loader-pinwheel' | 'calendar-clock';
  size: number;
}) {
  const src = name === 'loader-pinwheel' ? assets.loaderPinwheel : `${ICONS}/lucide-${name}.svg`;
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
}: {
  kind: KnowledgeKind;
  size?: number;
}) {
  const nav: Record<KnowledgeKind, string> = {
    contracts: assets.kFilePen,
    facts: assets.kBookOpen,
    resources: assets.kBookCopy,
    twin: assets.kMind,
  };
  return (
    <span
      className={clsx('proto-k-icon', `proto-k-icon--${kind}`)}
      style={{width: size, height: size}}
      aria-hidden="true"
    >
      <span className="proto-k-icon__vec">
        <span className="proto-k-icon__pad">
          <img src={nav[kind]} alt="" />
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
          <KnowledgeIcon kind={lineKind} size={size} />
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
  Exclude<
    ShellView,
    | 'projects'
    | 'knowledge'
    | 'opportunities'
    | 'horizon'
    | 'acquisition'
    | 'acq-fill'
    | 'onboarding'
    | 'connectors'
    | 'twin'
  >,
  {title: string; body: string; href?: string}
> = {
  note: {
    title: 'Note to dev',
    body: 'This is for animation staging previews built with Cursor. View explorations in the left nav.',
    href: 'https://github.com/silkyszetoeudia/empty-state-animation',
  },
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
    const size = 35;
    const expand = el.dataset.willSelect === '1' ? 54 : 35;
    const inset = (expand - size) / 2;
    let x = (figLeft / OPP_CANVAS.w) * field.width;
    let y = (figTop / OPP_CANVAS.h) * field.height;

    const overlaps =
      x - inset < hole.right &&
      x + size + inset > hole.left &&
      y - inset < hole.bottom &&
      y + size + inset > hole.top;

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
        const nx = hx + dx * dist - expand / 2;
        const ny = hy + dy * dist - expand / 2;
        const clear =
          nx + expand <= hole.left ||
          nx >= hole.right ||
          ny + expand <= hole.top ||
          ny >= hole.bottom;
        if (clear) {
          x = nx + inset;
          y = ny + inset;
          break;
        }
      }
    }

    x = Math.min(Math.max(12 + inset, x), field.width - size - inset - 12);
    y = Math.min(Math.max(12 + inset, y), field.height - size - inset - 12);
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
  const [faded, setFaded] = useState<number[]>([]);
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
      setFaded(OPP_CONTRACTS.map((_, index) => index));
      setPicked(
        OPP_CONTRACTS.flatMap((item, index) => (item.selected ? [index] : [])),
      );
      setDrifting(true);
      return;
    }

    setScopeOpen(false);
    setTilesOut(false);
    setFaded([]);
    setPicked([]);
    setDrifting(false);

    const fadeOrder = OPP_CONTRACTS.map((_, index) => index);
    for (let i = fadeOrder.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [fadeOrder[i], fadeOrder[j]] = [fadeOrder[j], fadeOrder[i]];
    }

    const fadeStart = 1180;
    const fadeGap = 70;

    const pose = window.setTimeout(() => setScopeOpen(true), 40);
    const burst = window.setTimeout(() => setTilesOut(true), 90);
    const fades = fadeOrder.map((index, order) =>
      window.setTimeout(() => {
        setFaded((current) =>
          current.includes(index) ? current : [...current, index],
        );
        if (OPP_CONTRACTS[index].selected) {
          setPicked((current) =>
            current.includes(index) ? current : [...current, index],
          );
        }
      }, fadeStart + order * fadeGap),
    );
    const drift = window.setTimeout(() => setDrifting(true), fadeStart + 180);

    return () => {
      window.clearTimeout(pose);
      window.clearTimeout(burst);
      fades.forEach((id) => window.clearTimeout(id));
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
              drifting && 'is-drifting',
            )}
            aria-hidden="true"
          >
            {OPP_CONTRACTS.map((item, index) => (
              <div
                key={`${item.left}-${item.top}`}
                className={clsx(
                  'opp-contract',
                  faded.includes(index) && 'is-fading',
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
                  <span className="opp-contract__tile opp-contract__tile--gray">
                    <span className="opp-contract__icon opp-contract__icon--gray">
                      <OppScrollIcon size={23.333} />
                    </span>
                  </span>
                  {item.selected ? (
                    <span className="opp-contract__blue">
                      <span className="opp-contract__tile opp-contract__tile--blue">
                        <span className="opp-contract__icon opp-contract__icon--blue">
                          <img
                            className="opp-contract__doc"
                            src={assets.oppContractDoc}
                            alt=""
                            width={30}
                            height={38}
                          />
                        </span>
                        <span className="opp-contract__badge">
                          <img src={assets.oppSelectBadge} alt="" />
                        </span>
                      </span>
                    </span>
                  ) : null}
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

function HorizonClockIcon({size, open}: {size: number; open: boolean}) {
  return (
    <svg
      className={clsx('hs-clock', open && 'is-open')}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 2v4" />
      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
      <path d="M3 10h5" />
      <path d="M8 2v4" />
      <circle cx="16" cy="16" r="6" />
      <g className="hs-clock__hour">
        <line x1="16" y1="16" x2="16" y2="14" />
      </g>
      <g className="hs-clock__minute">
        <line x1="16" y1="16" x2="16" y2="13.2" />
      </g>
    </svg>
  );
}

function HorizonScanningPage(): ReactElement {
  const floatsRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<HTMLDivElement>(null);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [tilesOut, setTilesOut] = useState(false);
  const [faded, setFaded] = useState<number[]>([]);
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
      setFaded(OPP_CONTRACTS.map((_, index) => index));
      setPicked(
        OPP_CONTRACTS.flatMap((item, index) => (item.selected ? [index] : [])),
      );
      setDrifting(true);
      return;
    }

    setScopeOpen(false);
    setTilesOut(false);
    setFaded([]);
    setPicked([]);
    setDrifting(false);

    const fadeOrder = OPP_CONTRACTS.map((_, index) => index);
    for (let i = fadeOrder.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [fadeOrder[i], fadeOrder[j]] = [fadeOrder[j], fadeOrder[i]];
    }

    const fadeStart = 1180;
    const fadeGap = 70;

    const pose = window.setTimeout(() => setScopeOpen(true), 40);
    const burst = window.setTimeout(() => setTilesOut(true), 90);
    const fades = fadeOrder.map((index, order) =>
      window.setTimeout(() => {
        setFaded((current) =>
          current.includes(index) ? current : [...current, index],
        );
        if (OPP_CONTRACTS[index].selected) {
          setPicked((current) =>
            current.includes(index) ? current : [...current, index],
          );
        }
      }, fadeStart + order * fadeGap),
    );
    const drift = window.setTimeout(() => setDrifting(true), fadeStart + 180);

    return () => {
      window.clearTimeout(pose);
      window.clearTimeout(burst);
      fades.forEach((id) => window.clearTimeout(id));
      window.clearTimeout(drift);
    };
  }, []);

  return (
    <div className="proto-card">
      <header className="proto-page-header">
        <h1 className="proto-page-title">Horizon Scanning</h1>
      </header>
      <div className="proto-body opp-body">
        <div className="opp-canvas">
          <div
            ref={floatsRef}
            className={clsx(
              'opp-floats',
              tilesOut && 'is-out',
              drifting && 'is-drifting',
            )}
            aria-hidden="true"
          >
            {OPP_CONTRACTS.map((item, index) => (
              <div
                key={`${item.left}-${item.top}`}
                className={clsx(
                  'opp-contract',
                  faded.includes(index) && 'is-fading',
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
                  <span className="opp-contract__tile opp-contract__tile--gray">
                    <span className="opp-contract__icon opp-contract__icon--gray">
                      <LucideIcon name="calendar-clock" size={23.333} />
                    </span>
                  </span>
                  {item.selected ? (
                    <span className="opp-contract__blue">
                      <span className="opp-contract__tile opp-contract__tile--blue">
                        <span className="opp-contract__icon opp-contract__icon--blue">
                          <img
                            className="hs-calendar"
                            src={assets.hsCalendar}
                            alt=""
                            width={31.131}
                            height={30.069}
                          />
                        </span>
                        <span className="opp-contract__badge hs-clock-badge">
                          <img
                            src={assets.hsClockBadge}
                            alt=""
                            width={30}
                            height={30}
                          />
                        </span>
                      </span>
                    </span>
                  ) : null}
                </span>
              </div>
            ))}
          </div>
          <div className="opp-hero is-static">
            <div
              ref={scopeRef}
              className={clsx('opp-scope', scopeOpen && 'is-open')}
              aria-hidden="true"
            >
              <HorizonClockIcon size={36} open={scopeOpen} />
            </div>
            <div className="opp-hero__copy">
              <h2 className="opp-hero__title">
                <span className="opp-hero__line">Monitor changes, stay ahead.</span>
              </h2>
              <p className="opp-hero__desc">
                Continuously monitor regulatory changes and emerging signals across
                the world. Share alerts across your team, get updates right in your
                inbox.
              </p>
            </div>
            <button className="opp-cta" type="button">
              Set up a new scan
              <Icon src={assets.oppArrowRight} size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type AcqGlyphName = 'file-text' | 'hammer' | 'settings';
type AcqVisual = 'waiting' | 'tile' | 'icon' | 'text' | 'done' | 'exit';
type AcqScreen = 'paths' | 'building' | 'hub';

const ACQ_SWAP_MS = 240;

const ACQ_STEPS = [
  {id: 'need', label: 'Summarizing your need', icon: 'file-text' as const},
  {id: 'request', label: 'Creating your request', icon: 'hammer' as const},
  {id: 'templates', label: 'Setting up the right templates and review checks', icon: 'settings' as const},
];

const ACQ_ENTER_MS = 420;
const ACQ_TILE_HOLD_MS = 280;
const ACQ_ICON_MS = 560;
const ACQ_TEXT_MS = 400;
const ACQ_HOLD_MS = 900;
const ACQ_SETTLE_MS = 420;
const ACQ_LINE_MS = 280;
const ACQ_LINE_HOLD_MS = 180;
const ACQ_FINISH_MS = 1400;

const ACQ_PATHS = [
  {
    id: 'gsa',
    title: 'Competitive GSA MAS order',
    body: 'FAR Subpart 8.4 procedures with FAR Part 12 commercial terms · Firm-Fixed-Price · fair opportunity.',
    recommended: true,
  },
  {
    id: 'open-market',
    title: 'Open-market competitive acquisition',
    body: 'Use FAR Part 12 with Part 15 when the strongest sources or required capabilities are outside MAS scope. It broadens industry access but generally adds solicitation and source-selection effort.',
    recommended: false,
  },
  {
    id: 'bpa',
    title: 'Multiple-award MAS BPA',
    body: 'Consider when the wing expects repetitive analytics orders over time. A BPA can preserve ongoing competition, but its setup and administration are unnecessary for a single defined order.',
    recommended: false,
  },
  {
    id: 'cso',
    title: 'Commercial Solutions Opening',
    body: 'Consider only if the need is an innovative capability gap and meaningfully different technical approaches are expected. The current intake reads as a defined support-services buy, so qualification is not yet',
    recommended: false,
  },
] as const;

const ACQ_BOARD_COLUMNS = [
  {id: 'requirements', label: 'Requirements', count: 1, icon: 'acqListTodo' as const},
  {id: 'pre-sol', label: 'Pre-solicitation', count: 0, icon: 'acqPackage' as const},
  {id: 'solicitation', label: 'Solicitation', count: 0, icon: 'acqHandCoins' as const},
  {id: 'pre-award', label: 'Pre-award', count: 0, icon: 'acqFileBadge' as const},
] as const;

function acqPhase(index: number, cursor: number, visual: AcqVisual): AcqVisual {
  if (index < cursor) {
    return 'exit';
  }
  if (index === cursor) {
    return visual;
  }
  return 'waiting';
}

function acqDepth(index: number, cursor: number, visual: AcqVisual): number {
  if (index > cursor) {
    return 0;
  }
  if (visual === 'done') {
    return cursor - index + 1;
  }
  if (index < cursor) {
    return cursor - index;
  }
  return 0;
}

function AcqGlyph({name, size}: {name: AcqGlyphName; size: number}) {
  if (name === 'file-text') {
    return (
      <svg
        className="acq-glyph acq-glyph--file"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
      >
        <g
          className="acq-file-outline"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 3V9C21 9.79565 21.3161 10.5587 21.8787 11.1213C22.4413 11.6839 23.2044 12 24 12H30" />
          <path d="M22.5 3H9C8.20435 3 7.44129 3.31607 6.87868 3.87868C6.31607 4.44129 6 5.20435 6 6V30C6 30.7956 6.31607 31.5587 6.87868 32.1213C7.44129 32.6839 8.20435 33 9 33H27C27.7956 33 28.5587 32.6839 29.1213 32.1213C29.6839 31.5587 30 30.7956 30 30V10.5L22.5 3Z" />
        </g>
        <g
          className="acq-file-lines"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 13.5H12" />
          <path d="M24 19.5H12" />
          <path d="M24 25.5H12" />
        </g>
      </svg>
    );
  }

  if (name === 'hammer') {
    return (
      <svg
        className="acq-glyph acq-glyph--spin"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M22.5003 18L9.94077 30.5595C9.34403 31.1562 8.53468 31.4915 7.69077 31.4915C6.84686 31.4915 6.03751 31.1562 5.44077 30.5595C4.84403 29.9628 4.50879 29.1534 4.50879 28.3095C4.50879 27.4656 4.84403 26.6562 5.44077 26.0595L18.0003 13.5M27 22.5L33 16.5M32.25 17.2499L29.379 14.3789C28.8164 13.8165 28.5002 13.0535 28.5 12.2579V10.4999L25.11 7.10994C23.4368 5.43772 21.1725 4.49148 18.807 4.47594L13.5 4.43994L14.88 5.66994C15.8602 6.53903 16.645 7.60599 17.1828 8.80051C17.7206 9.99502 17.9991 11.2899 18 12.5999V14.9999L21 17.9999H22.758C23.5536 18.0001 24.3165 18.3163 24.879 18.8789L27.75 21.7499"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      className="acq-glyph acq-glyph--cog"
      width={size}
      height={size}
      viewBox="0 0 25.0491 25.0491"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12.7542 2.08742H12.2949C11.7413 2.08742 11.2104 2.30735 10.8189 2.69882C10.4274 3.09028 10.2075 3.62123 10.2075 4.17485V4.36272C10.2071 4.72877 10.1105 5.08829 9.92731 5.40522C9.74412 5.72214 9.48081 5.98531 9.16379 6.16834L8.715 6.42927C8.39767 6.61248 8.03771 6.70893 7.67129 6.70893C7.30487 6.70893 6.9449 6.61248 6.62757 6.42927L6.47102 6.34577C5.99202 6.06946 5.42296 5.9945 4.88875 6.13735C4.35454 6.2802 3.89884 6.62917 3.62168 7.10768L3.39207 7.50429C3.11576 7.98329 3.0408 8.55235 3.18365 9.08656C3.32649 9.62076 3.67547 10.0765 4.15398 10.3536L4.31053 10.458C4.62602 10.6401 4.88835 10.9017 5.07145 11.2166C5.25455 11.5315 5.35205 11.8889 5.35425 12.2532V12.7855C5.35571 13.1533 5.25995 13.515 5.07666 13.8339C4.89338 14.1528 4.62908 14.4176 4.31053 14.6015L4.15398 14.6955C3.67547 14.9726 3.32649 15.4283 3.18365 15.9625C3.0408 16.4967 3.11576 17.0658 3.39207 17.5448L3.62168 17.9414C3.89884 18.4199 4.35454 18.7689 4.88875 18.9117C5.42296 19.0546 5.99202 18.9796 6.47102 18.7033L6.62757 18.6198C6.9449 18.4366 7.30487 18.3402 7.67129 18.3402C8.03771 18.3402 8.39767 18.4366 8.715 18.6198L9.16379 18.8808C9.48081 19.0638 9.74412 19.327 9.92731 19.6439C10.1105 19.9608 10.2071 20.3203 10.2075 20.6864V20.8742C10.2075 21.4279 10.4274 21.9588 10.8189 22.3503C11.2104 22.7417 11.7413 22.9617 12.2949 22.9617H12.7542C13.3078 22.9617 13.8387 22.7417 14.2302 22.3503C14.6217 21.9588 14.8416 21.4279 14.8416 20.8742V20.6864C14.842 20.3203 14.9386 19.9608 15.1218 19.6439C15.305 19.327 15.5683 19.0638 15.8853 18.8808L16.3341 18.6198C16.6514 18.4366 17.0114 18.3402 17.3778 18.3402C17.7442 18.3402 18.1042 18.4366 18.4215 18.6198L18.5781 18.7033C19.0571 18.9796 19.6261 19.0546 20.1603 18.9117C20.6946 18.7689 21.1503 18.4199 21.4274 17.9414L21.657 17.5344C21.9333 17.0554 22.0083 16.4863 21.8654 15.9521C21.7226 15.4179 21.3736 14.9622 20.8951 14.685L20.7386 14.6015C20.42 14.4176 20.1557 14.1528 19.9724 13.8339C19.7891 13.515 19.6934 13.1533 19.6949 12.7855V12.2636C19.6934 11.8958 19.7891 11.5341 19.9724 11.2152C20.1557 10.8963 20.42 10.6315 20.7386 10.4476L20.8951 10.3536C21.3736 10.0765 21.7226 9.62076 21.8654 9.08656C22.0083 8.55235 21.9333 7.98329 21.657 7.50429L21.4274 7.10768C21.1503 6.62917 20.6946 6.2802 20.1603 6.13735C19.6261 5.9945 19.0571 6.06946 18.5781 6.34577L18.4215 6.42927C18.1042 6.61248 17.7442 6.70893 17.3778 6.70893C17.0114 6.70893 16.6514 6.61248 16.3341 6.42927L15.8853 6.16834C15.5683 5.98531 15.305 5.72214 15.1218 5.40522C14.9386 5.08829 14.842 4.72877 14.8416 4.36272V4.17485C14.8416 3.62123 14.6217 3.09028 14.2302 2.69882C13.8387 2.30735 13.3078 2.08742 12.7542 2.08742Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5245 15.6557C14.2538 15.6557 15.6557 14.2538 15.6557 12.5245C15.6557 10.7953 14.2538 9.39341 12.5245 9.39341C10.7953 9.39341 9.39341 10.7953 9.39341 12.5245C9.39341 14.2538 10.7953 15.6557 12.5245 15.6557Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AcquisitionPaths({onContinue}: {onContinue: () => void}): ReactElement {
  return (
    <div className="proto-body acq-paths">
      <div className="acq-paths__canvas">
          <div className="acq-paths__toolbar">
            <button className="acq-paths__ghost" type="button">
              See all 4 paths
            </button>
          </div>
          <div className="acq-paths__stack">
            <div className="acq-paths__intro">
              <span className="acq-paths__mark" aria-hidden="true">
                <img src={assets.onboardEudia} alt="" width={16} height={16} />
              </span>
              <p>
                Here are all the acquisition paths you can use. I’ve included when
                each is a good fit and the main tradeoff so you can compare.
              </p>
            </div>
            <div className="acq-paths__list">
              {ACQ_PATHS.map((path) => (
                <article
                  key={path.id}
                  className={clsx('acq-path', path.recommended && 'is-recommended')}
                >
                  {path.recommended ? (
                    <span className="acq-path__badge">
                      <Icon src={assets.acqAward} size={16} />
                      Recommended path
                    </span>
                  ) : null}
                  <h3>{path.title}</h3>
                  <p>{path.body}</p>
                  <button className="acq-path__rationale" type="button">
                    Rationale
                    <Icon src={assets.acqChevronDown} size={16} />
                  </button>
                  {path.recommended ? (
                    <button className="proto-btn" type="button" onClick={onContinue}>
                      Continue
                    </button>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}

function AcquisitionBuilding({onComplete}: {onComplete: () => void}): ReactElement {
  const [cursor, setCursor] = useState(-1);
  const [visual, setVisual] = useState<AcqVisual>('waiting');
  const [lined, setLined] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setCursor(ACQ_STEPS.length - 1);
      setVisual('text');
      setLined(true);
      const id = window.setTimeout(onComplete, 400);
      return () => window.clearTimeout(id);
    }

    let cancelled = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    const runStep = (index: number) => {
      if (cancelled) {
        return;
      }
      setCursor(index);
      setVisual('tile');
      later(() => {
        if (cancelled) {
          return;
        }
        setVisual('icon');
        later(() => {
          if (cancelled) {
            return;
          }
          setVisual('text');
          if (index >= ACQ_STEPS.length - 1) {
            later(onComplete, ACQ_TEXT_MS + ACQ_FINISH_MS);
            return;
          }
          later(() => {
            if (cancelled) {
              return;
            }
            setVisual('done');
            setLined(false);
            later(() => {
              if (cancelled) {
                return;
              }
              setLined(true);
              later(() => {
                if (cancelled) {
                  return;
                }
                runStep(index + 1);
              }, ACQ_LINE_MS + ACQ_LINE_HOLD_MS);
            }, ACQ_SETTLE_MS);
          }, ACQ_TEXT_MS + ACQ_HOLD_MS);
        }, ACQ_ICON_MS);
      }, ACQ_ENTER_MS + ACQ_TILE_HOLD_MS);
    };

    later(() => runStep(0), 80);
    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [onComplete]);

  return (
    <div className="proto-body acq-body">
      <div className="acq-canvas">
          <div className="acq-hero">
            <h2 className="acq-title">Building your Acquisition Hub…</h2>
            <div
              className="acq-stage"
              aria-label="Acquisition setup progress"
              aria-live="polite"
              aria-atomic="true"
            >
              {ACQ_STEPS.map((step, index) => {
                const phase = acqPhase(index, cursor, visual);
                const active = phase === 'tile' || phase === 'icon' || phase === 'text';
                const depth = acqDepth(index, cursor, visual);
                const built =
                  phase === 'icon' ||
                  phase === 'text' ||
                  phase === 'done' ||
                  phase === 'exit';
                const showLine =
                  lined &&
                  ((phase === 'done' && depth === 1) ||
                    (phase === 'exit' && depth === 1));
                const chrome = phase === 'done' ? 'exit' : phase;
                return (
                  <div
                    key={step.id}
                    className={clsx(
                      'acq-card',
                      `is-${chrome}`,
                      built && 'has-icon',
                      showLine && 'is-lined',
                    )}
                    data-depth={depth || undefined}
                    aria-current={active ? 'step' : undefined}
                    aria-hidden={!active}
                  >
                    <span className="acq-card__well">
                      <AcqGlyph name={step.icon} size={36} />
                      <span
                        className="acq-glyph acq-glyph--check"
                        style={{
                          width: 25,
                          height: 25,
                          WebkitMaskImage: `url(${assets.acqCheck})`,
                          maskImage: `url(${assets.acqCheck})`,
                        }}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="acq-card__spine" aria-hidden="true" />
                    <span className="acq-card__label">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
    </div>
  );
}

function AcquisitionHub(): ReactElement {
  return (
    <>
      <div className="acq-hub-toolbar">
        <div className="proto-tabs" role="tablist" aria-label="Acquisition views">
          <button className="proto-tab is-active" type="button">
            Active
          </button>
          <button className="proto-tab" type="button">
            Post-award
          </button>
        </div>
        <div className="proto-actions">
          <button className="proto-btn" type="button">
            <Icon src={assets.plus} size={16} />
            Request
          </button>
          <button className="proto-icon-btn acq-hub-more" type="button" aria-label="More">
            <Icon src={assets.acqEllipsis} size={16} />
          </button>
        </div>
      </div>
      <div className="proto-body acq-hub-body">
        <div className="acq-board">
          {ACQ_BOARD_COLUMNS.map((column) => (
            <section key={column.id} className="acq-board__col">
              <div className="acq-board__heading">
                <div className="acq-board__label">
                  <Icon src={assets[column.icon]} size={16} />
                  <span>{column.label}</span>
                  <span className="acq-board__count"> • {column.count}</span>
                </div>
                <div className="acq-board__tools">
                  <button className="acq-board__icon" type="button" aria-label="Sort">
                    <Icon src={assets.acqArrowDownUp} size={12} />
                  </button>
                  <button className="acq-board__icon" type="button" aria-label="Column menu">
                    <Icon src={assets.acqEllipsis} size={12} />
                  </button>
                </div>
              </div>
              {column.id === 'requirements' ? (
                <article className="acq-board__card">
                  <h3>Cybersecurity monitoring tool</h3>
                  <p>Competitive GSA MAS order</p>
                  <div className="acq-board__meta">
                    <span>Today</span>
                    <span className="acq-board__avatar">JD</span>
                  </div>
                </article>
              ) : null}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

function AcquisitionPage(): ReactElement {
  const [screen, setScreen] = useState<AcqScreen>('paths');
  const [outgoing, setOutgoing] = useState<AcqScreen | null>(null);
  const screenRef = useRef(screen);
  screenRef.current = screen;

  const goTo = useCallback((next: AcqScreen) => {
    const current = screenRef.current;
    if (next === current) {
      return;
    }
    setOutgoing(current);
    setScreen(next);
  }, []);

  const goBuilding = useCallback(() => goTo('building'), [goTo]);
  const goHub = useCallback(() => goTo('hub'), [goTo]);

  useEffect(() => {
    if (!outgoing) {
      return;
    }
    const id = window.setTimeout(() => setOutgoing(null), ACQ_SWAP_MS);
    return () => window.clearTimeout(id);
  }, [outgoing, screen]);

  const showPaths = screen === 'paths' || outgoing === 'paths';
  const showBuilding = screen === 'building' || outgoing === 'building';
  const showHub = screen === 'hub' || outgoing === 'hub';

  return (
    <div className="proto-card acq-flow">
      <header className="proto-page-header">
        <h1 className="proto-page-title">Acquisition</h1>
      </header>
      <div className="acq-flow__stage">
        {showPaths ? (
          <div
            className={clsx('acq-pane', screen === 'paths' ? 'is-in' : 'is-out')}
            aria-hidden={screen !== 'paths'}
          >
            <AcquisitionPaths onContinue={goBuilding} />
          </div>
        ) : null}
        {showBuilding ? (
          <div
            className={clsx('acq-pane', screen === 'building' ? 'is-in' : 'is-out')}
            aria-hidden={screen !== 'building'}
          >
            <AcquisitionBuilding onComplete={goHub} />
          </div>
        ) : null}
        {showHub ? (
          <div
            className={clsx('acq-pane', screen === 'hub' ? 'is-in' : 'is-out')}
            aria-hidden={screen !== 'hub'}
          >
            <AcquisitionHub />
          </div>
        ) : null}
      </div>
    </div>
  );
}

const ACQ_FILL_MS = 1500;
const ACQ_FILL_H_ON = 61.14;
const ACQ_FILL_H_OFF = 55.58;
const ACQ_FILL_GAP = 22;

function acqFillRail(active: number): CSSProperties {
  const heightAt = (index: number) => (index === active ? ACQ_FILL_H_ON : ACQ_FILL_H_OFF);
  const center = (index: number) => {
    let y = 0;
    for (let i = 0; i < index; i += 1) {
      y += heightAt(i) + ACQ_FILL_GAP;
    }
    return y + heightAt(index) / 2;
  };
  const last = Math.min(active + 1, ACQ_STEPS.length - 1);
  const top = center(0);
  const fade = last > active;
  return {
    top,
    height: Math.max(0, center(last) - top),
    WebkitMaskImage: fade ? 'linear-gradient(to bottom, #000 55%, transparent 100%)' : 'none',
    maskImage: fade ? 'linear-gradient(to bottom, #000 55%, transparent 100%)' : 'none',
  };
}

function AcquisitionFillPage(): ReactElement {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      return;
    }
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % ACQ_STEPS.length);
    }, ACQ_FILL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="proto-card">
      <header className="proto-page-header">
        <h1 className="proto-page-title">Acquisition</h1>
      </header>
      <div className="proto-body acq-fill-body">
        <div className="acq-fill-well">
          <div className="acq-fill" aria-label="Acquisition setup progress" aria-live="polite">
            <h2 className="acq-fill__title">Building your Acquisition Hub…</h2>
            <div className="acq-fill__thread">
              <div className="acq-fill__rail" style={acqFillRail(active)} aria-hidden="true" />
              {ACQ_STEPS.map((step, index) => {
                const done = index < active;
                const on = index === active;
                const next = index === active + 1;
                return (
                  <div
                    key={step.id}
                    className={clsx(
                      'acq-fill__row',
                      on && 'is-active',
                      done && 'is-done',
                      next && 'is-next',
                      !done && !on && !next && 'is-beyond',
                    )}
                    aria-current={on ? 'step' : undefined}
                  >
                    <span className="acq-fill__disc">
                      <span
                        className="acq-fill__check"
                        style={{
                          WebkitMaskImage: `url(${assets.acqCheck})`,
                          maskImage: `url(${assets.acqCheck})`,
                        }}
                        aria-hidden="true"
                      />
                      <span className="acq-fill__glyph" aria-hidden="true">
                        <AcqGlyph name={step.icon} size={22} />
                      </span>
                    </span>
                    <span className="acq-fill__label">{step.label}</span>
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

function OnboardTypeSpinner(): ReactElement {
  const count = ONBOARD_TYPES.length;
  const [center, setCenter] = useState(0);
  const [nameIn, setNameIn] = useState(true);
  const prevSlots = useRef<number[]>(ONBOARD_TYPES.map((_, index) => onboardSlot(index, 0, count)));

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let cancelled = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    let isFirst = true;
    const loop = () => {
      later(() => {
        if (cancelled) return;
        setNameIn(false);
        later(() => {
          if (cancelled) return;
          setCenter((value) => (value + 1) % count);
          later(() => {
            if (cancelled) return;
            setNameIn(true);
            loop();
          }, ONBOARD_MOVE_MS);
        }, ONBOARD_NAME_FADE_MS);
      }, isFirst ? 500 : ONBOARD_HOLD_MS);
      isFirst = false;
    };

    loop();
    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [count]);

  const slots = ONBOARD_TYPES.map((_, index) => onboardSlot(index, center, count));

  useLayoutEffect(() => {
    prevSlots.current = slots;
  }, [center, slots]);

  return (
    <div className="onboard-spin">
      <div className="onboard-spin__track" aria-hidden="true">
        {ONBOARD_TYPES.map((item, index) => {
          const slot = slots[index];
          const abs = Math.abs(slot);
          const prev = prevSlots.current[index] ?? slot;
          const wrapping = Math.abs(slot - prev) > 4;
          const isCenter = slot === 0;
          return (
            <div
              key={item.id}
              className={clsx(
                'onboard-spin__tile',
                isCenter && 'is-center',
                wrapping && 'is-wrap',
                abs > 3 && 'is-off',
              )}
              style={{'--slot': slot} as CSSProperties}
            >
              <img src={item.icon} alt="" width={46} height={46} />
            </div>
          );
        })}
        <div className="onboard-spin__fade onboard-spin__fade--left" />
        <div className="onboard-spin__fade onboard-spin__fade--right" />
      </div>
      <p className={clsx('onboard-spin__name', nameIn && 'is-in')} aria-live="polite">
        {ONBOARD_TYPES[center].name}
      </p>
    </div>
  );
}

function OnboardingSpinnerPage({onHome}: {onHome: () => void}): ReactElement {
  return (
    <div className="onboard">
      <header className="onboard__top">
        <button className="onboard__logo" type="button" onClick={onHome} aria-label="Back to All projects">
          <img src={assets.onboardEudia} alt="" width={24} height={24} />
        </button>
      </header>
      <div className="onboard__body">
        <div className="onboard__content">
          <OnboardTypeSpinner />
          <div className="onboard__copy">
            <h1 className="onboard__title">All set, John!</h1>
            <p className="onboard__desc">
              These files become your fact library, containing the approved claims and entity details
              Eudia uses to substantiate your compliance reviews. You can add more at any time.
            </p>
          </div>
          <button className="onboard__cta" type="button" onClick={onHome}>
            Get started
          </button>
        </div>
      </div>
    </div>
  );
}

function ConnectorsOrbit({phase}: {phase: 'idle' | 'in' | 'pop' | 'spin'}): ReactElement {
  return (
    <div
      className={clsx(
        'conn-orbit',
        phase !== 'idle' && 'is-in',
        (phase === 'pop' || phase === 'spin') && 'is-pop',
        phase === 'spin' && 'is-spin',
      )}
      aria-hidden="true"
    >
      <div className="conn-orbit__ring">
        {CONNECTORS.map((item, index) => (
          <div
            key={item.id}
            className="conn-orbit__slot"
            style={
              {
                '--angle': `${item.angle}deg`,
                '--delay': `${index * 50}ms`,
              } as CSSProperties
            }
          >
            <span className="conn-orbit__icon">
              <img src={item.icon} alt="" width={47} height={47} />
            </span>
          </div>
        ))}
      </div>
      <div className="conn-orbit__laptop">
        <img src={assets.connLaptop} alt="" width={136} height={78} />
      </div>
    </div>
  );
}

function TwinSatellite({
  item,
  index,
}: {
  item: (typeof TWIN_SATS)[number];
  index: number;
}): ReactElement {
  const inX = TWIN_BRAIN_CX - (item.left + item.width / 2);
  const inY = TWIN_BRAIN_CY - (item.top + item.height / 2);

  return (
    <span
      className="twin-sat"
      style={
        {
          left: item.left,
          top: item.top,
          width: item.width,
          height: item.height,
          '--sat-i': index,
          '--in-x': `${inX}px`,
          '--in-y': `${inY}px`,
        } as CSSProperties
      }
    >
      <img src={item.src} alt="" width={item.width} height={item.height} />
    </span>
  );
}

function TwinArt(): ReactElement {
  return (
    <div className="twin-art" aria-hidden="true">
      <div className="twin-sats">
        {TWIN_SATS.map((item, index) => (
          <TwinSatellite key={item.id} item={item} index={index} />
        ))}
      </div>
      <img className="twin-art__halo" src={assets.twinHalo} alt="" width={213.02} height={219.92} />
      <img className="twin-art__mid" src={assets.twinMid} alt="" width={189.87} height={196.77} />
      <img className="twin-art__well" src={assets.twinEmpty} alt="" width={166.74} height={173.57} />
      <span className="twin-art__fill">
        <img src={assets.twinFill} alt="" width={164.74} height={171.57} />
      </span>
      <img className="twin-art__stroke" src={assets.twinStroke} alt="" width={166.74} height={173.57} />
      {TWIN_CIRCUIT.map((piece, index) => (
        <img
          key={`${piece.inset}-${index}`}
          className="twin-art__circuit"
          src={piece.src}
          alt=""
          style={{inset: piece.inset}}
        />
      ))}
    </div>
  );
}

function DigitalTwinPage({onHome}: {onHome: () => void}): ReactElement {
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setBeat(2);
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    later(() => {
      if (!cancelled) setBeat(1);
    }, 40);
    later(() => {
      if (!cancelled) setBeat(2);
    }, 1100);

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <div className={clsx('onboard', 'twin-stage', beat >= 1 && 'is-in', beat >= 2 && 'is-filling')}>
      <header className="onboard__top">
        <button className="onboard__logo" type="button" onClick={onHome} aria-label="Back to All projects">
          <img src={assets.onboardEudia} alt="" width={24} height={24} />
        </button>
      </header>
      <div className="onboard__body">
        <div className="onboard__content">
          <TwinArt />
          <div className="onboard__copy twin-copy">
            <h1 className="onboard__title twin-title">All set, John!</h1>
            <p className="onboard__desc twin-desc">
              These documents is now turning into your Digital Twin — a working copy of your playbook
              and the judgement behind it — and review against it in the Word plugin. You can keep
              teaching it as you go.
            </p>
          </div>
          <button className="onboard__cta twin-cta" type="button" onClick={onHome}>
            Get started
          </button>
        </div>
      </div>
    </div>
  );
}

function OnboardingConnectorsPage({onHome}: {onHome: () => void}): ReactElement {
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setBeat(6);
      return;
    }

    let cancelled = false;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms));
    };

    later(() => {
      if (!cancelled) setBeat(1);
    }, 40);
    later(() => {
      if (!cancelled) setBeat(2);
    }, 560);
    later(() => {
      if (!cancelled) setBeat(6);
    }, 1000);

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const orbitPhase = beat >= 6 ? 'spin' : beat >= 1 ? 'pop' : 'idle';

  return (
    <div className={clsx('onboard', 'conn-stage', beat >= 1 && `is-beat-${beat}`)}>
      <header className="onboard__top">
        <button className="onboard__logo" type="button" onClick={onHome} aria-label="Back to All projects">
          <img src={assets.onboardEudia} alt="" width={24} height={24} />
        </button>
      </header>
      <div className="onboard__body">
        <div className="onboard__content">
          <ConnectorsOrbit phase={orbitPhase} />
          <div className="onboard__copy conn-copy">
            <h1 className="onboard__title conn-title">All set, John!</h1>
            <p className="onboard__desc conn-desc">
              Eudia is tuned to how you work and pointed at reading across your contract set.
            </p>
          </div>
          <button className="onboard__cta conn-cta" type="button" onClick={onHome}>
            Get started
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AllProjectsApp(): ReactElement {
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState<ShellView>('note');
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

  const goHome = () => setView('projects');

  if (view === 'onboarding') {
    return <OnboardingSpinnerPage onHome={goHome} />;
  }

  if (view === 'connectors') {
    return <OnboardingConnectorsPage onHome={goHome} />;
  }

  if (view === 'twin') {
    return <DigitalTwinPage onHome={goHome} />;
  }

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
              <AskAiIcon />
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
            <button
              className={clsx('proto-nav-btn', view === 'horizon' && 'is-active')}
              type="button"
              onClick={() => setView('horizon')}
            >
              <LucideIcon name="calendar-clock" size={16} />
              <span className="proto-nav-btn__label">Horizon Scanning</span>
            </button>
            <button
              className={clsx('proto-nav-btn', view === 'note' && 'is-active')}
              type="button"
              onClick={() => setView('note')}
            >
              <span className="proto-nav-dot" aria-hidden="true" />
              <span className="proto-nav-btn__label">NOTE TO DEV</span>
            </button>
            <button
              className={clsx('proto-nav-btn', view === 'acq-fill' && 'is-active')}
              type="button"
              onClick={() => setView('acq-fill')}
            >
              <span className="proto-nav-dot" aria-hidden="true" />
              <span className="proto-nav-btn__label">Acquisition Filling</span>
            </button>
            <button
              className="proto-nav-btn"
              type="button"
              onClick={() => setView('onboarding')}
            >
              <span className="proto-nav-dot" aria-hidden="true" />
              <span className="proto-nav-btn__label">Onboarding Spinner</span>
            </button>
            <button
              className="proto-nav-btn"
              type="button"
              onClick={() => setView('connectors')}
            >
              <span className="proto-nav-dot" aria-hidden="true" />
              <span className="proto-nav-btn__label">Classic Univ Login</span>
            </button>
            <button
              className="proto-nav-btn"
              type="button"
              onClick={() => setView('twin')}
            >
              <span className="proto-nav-dot" aria-hidden="true" />
              <span className="proto-nav-btn__label">Digital Twin Creation</span>
            </button>
          </div>
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
        ) : view === 'horizon' ? (
          <HorizonScanningPage />
        ) : view === 'acquisition' ? (
          <AcquisitionPage />
        ) : view === 'acq-fill' ? (
          <AcquisitionFillPage />
        ) : (
          <div className="proto-card">
            <div className="proto-placeholder">
              <h1>{PLACEHOLDERS[view].title}</h1>
              <p>{PLACEHOLDERS[view].body}</p>
              {PLACEHOLDERS[view].href ? (
                <a
                  className="proto-placeholder__link"
                  href={PLACEHOLDERS[view].href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {PLACEHOLDERS[view].href}
                </a>
              ) : null}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
