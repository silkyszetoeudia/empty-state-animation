import {useState, type ReactElement} from 'react';
import './template-states.css';

type TemplateState = 'loading' | 'empty' | 'error';

const STATES: Array<{id: TemplateState; label: string}> = [
  {id: 'loading', label: 'Loading'},
  {id: 'empty', label: 'No results'},
  {id: 'error', label: 'Error'},
];

const ICONS = '/icons/templates';

function LoadingMark(): ReactElement {
  return (
    <svg
      className="tpl-spin"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="18" stroke="#A1C2E2" strokeWidth="3" />
      <g className="tpl-spin__arc">
        <path
          d="M24 6C27.5601 6 31.0402 7.05568 34.0003 9.03355C36.9603 11.0114 39.2675 13.8226 40.6298 17.1117C41.9922 20.4008 42.3487 24.02 41.6541 27.5116C40.9596 31.0033 39.2453 34.2106 36.7279 36.7279"
          stroke="#1366B6"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function EmptyBook(): ReactElement {
  return (
    <div className="tpl-book is-on" aria-hidden="true">
      <svg className="tpl-book__page" width="56.1305" height="74.8407" viewBox="0 0 56.1305 74.8407" fill="none">
        <g className="tpl-book__cover">
          <path
            d="M1.16939 66.655V8.1857C1.16939 4.31503 4.31503 1.16939 8.1857 1.16939H52.6224C53.9087 1.16939 54.9611 2.22183 54.9611 3.50816V73.6713H8.1857C4.31503 73.6713 1.16939 70.5257 1.16939 66.655Z"
            fill="#F9FAFB"
          />
          <path
            d="M1.16939 64.8651V66.655C1.16939 67.4668 1.30777 68.2468 1.56221 68.9725M1.16939 60.0921V56.5124M1.16939 51.7394V48.1596M1.16939 43.3866V39.8068M1.16939 35.0338V31.4541M1.16939 26.6811V23.1013M1.16939 18.3283V14.7486M1.16939 9.97558V8.1857C1.16939 7.37384 1.30777 6.59388 1.56221 5.86816M5.86816 1.56221C6.59389 1.30777 7.37385 1.16939 8.1857 1.16939H10.0901M15.1686 1.16939H18.9775M24.0559 1.16939H27.8648M32.9433 1.16939H36.7521M41.8306 1.16939H45.6395M50.7179 1.16939H52.6224C52.8925 1.16939 53.1524 1.21581 53.3943 1.30108M54.8294 2.73618C54.9147 2.97813 54.9611 3.23799 54.9611 3.50816V5.17871M54.9611 9.63351V12.9746M54.9611 17.4294V20.7705M54.9611 25.2253V28.5664M54.9611 33.0212V36.3623M54.9611 40.8171V44.1582M54.9611 48.613V51.9541M54.9611 56.4089V59.75M54.9611 64.2049V67.546M54.9611 72.0008V73.6713H53.2906M48.8358 73.6713H45.4947M41.0399 73.6713H37.6988M33.244 73.6713H29.9029M25.4481 73.6713H22.107M17.6522 73.6713H14.3111M9.85625 73.6713H8.1857C7.37384 73.6713 6.59388 73.5329 5.86816 73.2785"
            stroke="#5A94CC"
            strokeWidth="2.33877"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M1.16939 66.6559C1.16939 65.8441 1.30777 65.0641 1.56221 64.3384M54.9611 59.6396H53.2906M5.86816 60.0325C6.59389 59.778 7.37384 59.6396 8.1857 59.6396H9.85625M14.3111 59.6396H17.6522M22.107 59.6396H25.4481M29.9029 59.6396H33.244M37.6988 59.6396H41.0399M45.4947 59.6396H48.8358"
            stroke="#5A94CC"
            strokeWidth="2.33877"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path className="tpl-book__line tpl-book__line--1" d="M14.0326 20.7077H42.0978" pathLength="1" />
          <path className="tpl-book__line tpl-book__line--2" d="M14.0326 30.0656H35.0815" pathLength="1" />
        </g>
      </svg>
      <svg className="tpl-book__badge" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 31C24.2843 31 31 24.2843 31 16C31 7.71573 24.2843 1 16 1C7.71573 1 1 7.71573 1 16C1 24.2843 7.71573 31 16 31Z"
          fill="#E7F0F8"
          stroke="#1366B6"
          strokeWidth="2"
        />
        <path className="tpl-badge__plus" d="M16 10V16M16 16V22M16 16H10M16 16H22" pathLength="1" />
      </svg>
    </div>
  );
}

function ErrorMark(): ReactElement {
  return (
    <div className="tpl-error is-on" aria-hidden="true">
      <svg width="82.025" height="82.025" viewBox="0 0 82.0251 82.0251" fill="none">
        <path
          className="tpl-error__circle"
          d="M81.0251 41.0126C81.0251 63.1109 63.1109 81.0251 41.0126 81.0251C18.9142 81.0251 1 63.1109 1 41.0126C1 18.9142 18.9142 1 41.0126 1C63.1109 1 81.0251 18.9142 81.0251 41.0126Z"
          fill="#E7F0F8"
          stroke="#1366B6"
          strokeWidth="2"
        />
        <path
          className="tpl-error__stem"
          d="M36.3777 21.4803C36.3777 18.9219 38.4541 16.8454 41.0126 16.8454C43.571 16.8454 45.6475 18.9219 45.6475 21.4803L43.2638 47.7006C43.2638 48.9433 42.2553 49.9519 41.0126 49.9519C39.7699 49.9519 38.7613 48.9433 38.7613 47.7006L36.3777 21.4803Z"
          fill="#5A94CC"
        />
        <circle className="tpl-error__dot" cx="41.0126" cy="60.5455" r="4.6349" fill="#5A94CC" />
      </svg>
    </div>
  );
}

function DialogClose(): ReactElement {
  return (
    <button className="tpl-dialog__close" type="button" aria-label="Close">
      <img src={`${ICONS}/x.svg`} alt="" width="16" height="16" />
    </button>
  );
}

function TemplateDialog({state}: {state: TemplateState}): ReactElement {
  const description =
    state === 'empty'
      ? 'Add an existing Word or PDF file as a template before starting a draft.'
      : 'Choose a template to start your draft.';

  return (
    <div className="tpl-dialog" role="dialog" aria-modal="true" aria-labelledby="tpl-dialog-title">
      <div className="tpl-dialog__head">
        <h2 className="tpl-dialog__title" id="tpl-dialog-title">
          Draft with template
        </h2>
        <p className="tpl-dialog__desc">{description}</p>
      </div>
      {state === 'loading' ? (
        <div className="tpl-dialog__body">
          <LoadingMark />
          <div className="tpl-dialog__copy">
            <h3 className="tpl-dialog__heading">Loading templates</h3>
            <p className="tpl-dialog__sub">This will only take a moment.</p>
          </div>
        </div>
      ) : null}
      {state === 'empty' ? (
        <div className="tpl-dialog__body is-empty">
          <EmptyBook />
          <div className="tpl-dialog__copy">
            <h3 className="tpl-dialog__heading">No document templates yet</h3>
            <p className="tpl-dialog__sub is-narrow">
              Your templates will be available here whenever you need to draft from a standard form.
            </p>
          </div>
          <div className="tpl-dialog__actions">
            <button className="tpl-btn" type="button">
              Cancel
            </button>
            <button className="tpl-btn tpl-btn--primary" type="button">
              <img src={`${ICONS}/plus.svg`} alt="" width="16" height="16" />
              Add template
              <img src={`${ICONS}/chevron-down.svg`} alt="" width="16" height="16" />
            </button>
          </div>
        </div>
      ) : null}
      {state === 'error' ? (
        <div className="tpl-dialog__body">
          <ErrorMark />
          <div className="tpl-dialog__copy">
            <h3 className="tpl-dialog__heading">Couldn’t load templates</h3>
            <p className="tpl-dialog__sub">Check your connection and try again.</p>
          </div>
          <button className="tpl-btn tpl-btn--primary" type="button">
            Try again
          </button>
        </div>
      ) : null}
      <DialogClose />
    </div>
  );
}

export default function TemplateStates(): ReactElement {
  const [state, setState] = useState<TemplateState>('loading');

  return (
    <>
      <div className="tpl-overlay">
        <TemplateDialog state={state} />
      </div>
      <div className="tpl-toggle" role="tablist" aria-label="Template state">
        {STATES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={state === item.id}
            className={state === item.id ? 'is-on' : undefined}
            onClick={() => setState(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
}
