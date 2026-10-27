import type {ReactElement} from 'react';

const ICONS = '/icons/empty';

export type ProjectEmptyKind = 'search' | 'favorites' | 'blocks';

export type BlocksProjectType = 'general' | 'compliance' | 'contracting' | 'ma' | 'litigation';

const BADGE_X = 69.4824;
const BADGE_Y = 45.2441;
const BADGE = 32.3066;

/** Glyph insets match the type-nav badges: top, right, bottom, left, as a fraction of the badge. */
const BLOCK_BADGES: Record<
  BlocksProjectType,
  {bg: string; glyph?: string; inset: [number, number, number, number]}
> = {
  general: {
    bg: '/icons/general-bg.svg',
    glyph: '/icons/general-glyph.svg',
    inset: [0.1667, 0.181, 0.1667, 0.1667],
  },
  compliance: {
    bg: '/icons/compliance-bg.svg',
    glyph: '/icons/compliance-glyph.svg',
    inset: [0.1468, 0.1449, 0.1237, 0.1565],
  },
  contracting: {
    bg: '/icons/empty/contracting.svg',
    inset: [0, 0, 0, 0],
  },
  ma: {
    bg: '/icons/ma-bg.svg',
    glyph: '/icons/ma-glyph.svg',
    inset: [0.2188, 0.2188, 0.2188, 0.2188],
  },
  litigation: {
    bg: '/icons/litigation-bg.svg',
    glyph: '/icons/litigation-glyph.svg',
    inset: [0.1885, 0.1875, 0.1885, 0.1875],
  },
};

function SearchMark(): ReactElement {
  return (
    <svg className="proj-mag is-on" width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <path
        className="proj-mag__lens"
        d="M63.6429 36C63.6429 51.2667 51.2667 63.6429 36 63.6429C20.7333 63.6429 8.35714 51.2667 8.35714 36C8.35714 20.7333 20.7333 8.35714 36 8.35714C51.2667 8.35714 63.6429 20.7333 63.6429 36Z"
        fill="#E7F0F8"
        stroke="#5A94CC"
        strokeWidth="3"
      />
      <path
        className="proj-mag__glare"
        d="M18 33.4286C18 24.8571 24.8571 18 33.4286 18"
        stroke="#A1C2E2"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path className="proj-mag__neck" d="M56.2566 56.1738L64.2857 64.2859" stroke="#5A94CC" strokeWidth="3" />
      <path
        className="proj-mag__handle"
        d="M65.1429 65.1429L85.7143 85.7143"
        stroke="#1366B6"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FavoritesMark(): ReactElement {
  return (
    <svg className="proj-star is-on" width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <g className="proj-star__shape">
        <path
          d="M44.4194 11.1978C45.873 8.21236 50.127 8.21236 51.5806 11.1978L61.5128 31.5975C62.1099 32.824 63.2932 33.6595 64.6488 33.8117L87.8165 36.414C91.2553 36.8003 92.5991 41.0866 89.9963 43.367L73.167 58.1111C72.0852 59.0589 71.5985 60.5163 71.8937 61.924L76.4051 83.4336C77.098 86.7373 73.624 89.3508 70.6418 87.7693L49.8657 76.7519C48.6989 76.1331 47.3011 76.1331 46.1343 76.7519L25.3582 87.7693C22.376 89.3508 18.902 86.7374 19.5949 83.4336L24.1063 61.924C24.4015 60.5163 23.9148 59.0589 22.833 58.1111L6.00372 43.367C3.40089 41.0866 4.74466 36.8003 8.18348 36.414L31.3512 33.8117C32.7068 33.6594 33.8901 32.824 34.4872 31.5975L44.4194 11.1978Z"
          fill="#E7F0F8"
        />
        <path
          d="M28.7734 34.1013L31.3512 33.8117C32.7068 33.6594 33.8901 32.824 34.4872 31.5975L35.5923 29.3277M22.3451 34.8233L17.1896 35.4024M10.7612 36.1245L8.18348 36.414C7.4506 36.4964 6.81288 36.7558 6.28824 37.1353M4.85942 41.6929C5.07355 42.3039 5.44901 42.881 6.00372 43.367L7.87623 45.0075M12.5458 49.0985L16.2909 52.3795M20.9605 56.4706L22.833 58.1111C23.9148 59.0589 24.4015 60.5163 24.1063 61.924L23.6043 64.3172M22.3525 70.2855L21.3486 75.072M20.0969 81.0403L19.5949 83.4336C19.447 84.1387 19.4889 84.8125 19.6754 85.4207M23.4267 88.2428C24.0627 88.2533 24.7217 88.1069 25.3582 87.7693L27.6699 86.5435M33.4346 83.4865L38.0579 81.0348M43.8226 77.9778L46.1343 76.7519C47.3011 76.1331 48.6989 76.1331 49.8657 76.7519L52.1774 77.9778M57.9421 81.0348L62.5654 83.4865M68.3301 86.5435L70.6418 87.7693C71.2783 88.1069 71.9373 88.2533 72.5733 88.2428M76.3246 85.4207C76.5111 84.8125 76.553 84.1387 76.4051 83.4336L75.9031 81.0403M74.6514 75.072L73.6474 70.2855M72.3957 64.3172L71.8937 61.924C71.5985 60.5163 72.0852 59.0589 73.167 58.1111L75.0395 56.4706M79.7091 52.3795L83.4542 49.0985M88.1238 45.0075L89.9963 43.367C90.551 42.881 90.9264 42.3039 91.1406 41.6929M89.7118 37.1353C89.1871 36.7558 88.5494 36.4964 87.8165 36.414L85.2388 36.1245M78.8104 35.4024L73.6549 34.8233M67.2266 34.1013L64.6488 33.8117C63.2932 33.6594 62.1099 32.824 61.5128 31.5975L60.4077 29.3277M57.6518 23.6674L55.4416 19.1279M52.6857 13.4676L51.5806 11.1978C51.27 10.56 50.8316 10.0584 50.32 9.69308M45.68 9.69308C45.1684 10.0584 44.73 10.56 44.4194 11.1978L43.3143 13.4676M40.5584 19.1279L38.3482 23.6674"
          stroke="#1366B6"
          strokeWidth="2.32306"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g className="proj-star__sparks">
        <path className="proj-star__spark proj-star__spark--1" d="M80.438 15.6498V8.79268" stroke="#1366B6" strokeWidth="2" strokeLinecap="round" />
        <path className="proj-star__spark proj-star__spark--2" d="M85.5808 19.2285L90.7237 14.0857" stroke="#1366B6" strokeWidth="2" strokeLinecap="round" />
        <path className="proj-star__spark proj-star__spark--3" d="M87.2952 25.9353H94.1523" stroke="#1366B6" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function BlocksMark({type}: {type: BlocksProjectType}): ReactElement {
  const badge = BLOCK_BADGES[type];
  const [top, right, bottom, left] = badge.inset;
  return (
    <svg className="proj-blocks is-on" width="106.302" height="96" viewBox="0 0 106.302 96" fill="none" aria-hidden="true">
      <rect className="proj-blocks__base" x="7.6001" y="78.6916" width="97.7023" height="9.80916" rx="2.78669" fill="#A1C2E2" stroke="#1366B6" strokeWidth="2" strokeLinejoin="round" />
      <g className="proj-blocks__ball">
        <svg x={BADGE_X} y={BADGE_Y} width={BADGE} height={BADGE} viewBox="0 0 100 100">
          <defs>
            <clipPath id={`proj-blocks-badge-${type}`}>
              <circle cx="50" cy="50" r="50" />
            </clipPath>
          </defs>
          <g clipPath={`url(#proj-blocks-badge-${type})`}>
            <image href={badge.bg} x="0" y="0" width="100" height="100" preserveAspectRatio="none" />
            {badge.glyph ? (
              <image
                href={badge.glyph}
                x={left * 100}
                y={top * 100}
                width={(1 - left - right) * 100}
                height={(1 - top - bottom) * 100}
                preserveAspectRatio="none"
              />
            ) : null}
          </g>
        </svg>
      </g>
      <rect className="proj-blocks__pillar" x="14.1765" y="48.5959" width="16.0514" height="30.0963" rx="2.78669" fill="#F9FAFB" stroke="#1366B6" strokeWidth="2" strokeLinejoin="round" />
      <rect className="proj-blocks__pillar proj-blocks__pillar--right" x="52.6331" y="48.5959" width="15.8284" height="30.0963" rx="2.78669" fill="#F9FAFB" stroke="#1366B6" strokeWidth="2" strokeLinejoin="round" />
      <path
        className="proj-blocks__arch"
        d="M14.1765 33.66C14.1765 32.1209 15.4242 30.8733 16.9632 30.8733H65.6746C67.2137 30.8733 68.4613 32.1209 68.4613 33.66V45.1412C68.4613 46.6802 67.2137 47.9278 65.6746 47.9278H55.8655C54.3264 47.9278 53.1128 46.6624 52.7531 45.166C51.5118 40.0016 46.8661 36.168 41.3189 36.168C35.7717 36.168 31.126 40.0016 29.8847 45.166C29.525 46.6624 28.3114 47.9278 26.7724 47.9278H16.9632C15.4242 47.9278 14.1765 46.6802 14.1765 45.1412V33.66Z"
        fill="#D0E0F0"
        stroke="#1366B6"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        className="proj-blocks__roof"
        d="M21.7572 30.8727C19.1643 30.8727 17.9768 27.6421 19.9522 25.9628L39.5141 9.3332C40.5547 8.44852 42.0832 8.44852 43.1239 9.3332L62.6858 25.9628C64.6612 27.6421 63.4736 30.8727 60.8808 30.8727H21.7572Z"
        fill="#F9FAFB"
        stroke="#1366B6"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProjectEmpty({
  kind,
  title,
  description,
  action,
  projectType = 'general',
}: {
  kind: ProjectEmptyKind;
  title: string;
  description: string;
  action: ReactElement;
  projectType?: BlocksProjectType;
}): ReactElement {
  return (
    <div className="proj-empty">
      {kind === 'search' ? <SearchMark /> : null}
      {kind === 'favorites' ? <FavoritesMark /> : null}
      {kind === 'blocks' ? <BlocksMark type={projectType} /> : null}
      <div className="proj-empty__copy">
        <h2 className="proj-empty__title">{title}</h2>
        <p className="proj-empty__desc">{description}</p>
      </div>
      {action}
    </div>
  );
}

export const emptyIcons = {
  plus: `${ICONS}/plus.svg`,
  chevron: `${ICONS}/chevron-down.svg`,
  search: `${ICONS}/search.svg`,
  star: `${ICONS}/star.svg`,
  contracting: `${ICONS}/contracting.svg`,
};
