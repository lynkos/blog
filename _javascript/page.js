import { basic, initSidebar, initTopbar } from './modules/layouts';
import {
  applyRoundedCorners,
  loadImg,
  imgPopup,
  initClipboard,
  loadMermaid
} from './modules/components';

applyRoundedCorners();
loadImg();
imgPopup();
initSidebar();
initTopbar();
initClipboard();
loadMermaid();
basic();
