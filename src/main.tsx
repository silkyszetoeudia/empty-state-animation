import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import AllProjectsApp from './AllProjectsApp';
import './product-tokens.css';
import './tokens.css';
import './prototype.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AllProjectsApp />
  </StrictMode>,
);
