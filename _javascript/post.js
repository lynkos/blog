import { basic, initTopbar, initSidebar } from './modules/layouts';

import {
  applyRoundedCorners,
  loadImg,
  imgPopup,
  initLocaleDatetime,
  initClipboard,
  initToc,
  loadMermaid,
  initLinkPreview,
  initTabs
} from './modules/components';

applyRoundedCorners();
loadImg();
initToc();
imgPopup();
initSidebar();
initLocaleDatetime();
initClipboard();
initTopbar();
loadMermaid();
initLinkPreview();
initTabs();
basic();
