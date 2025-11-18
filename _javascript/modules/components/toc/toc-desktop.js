import { heading } from '../../../../assets/js/data/toc-config.js';

export class TocDesktop {
  /* Tocbot options Ref: https://github.com/tscanlin/tocbot#usage */
  static options = {
    tocSelector: '#toc',
    contentSelector: '.content',
    ignoreSelector: '[data-toc-skip]',
    headingSelector: heading,
    orderedList: false,
    scrollSmooth: false,
    headingsOffset: 16 * 2 // 2rem
  };

  static refresh() {
    tocbot.refresh(this.options);
  }

  static init() {
    console.log('TOC-desktop headingSelector:', tocConfig);
    console.log('TOC-desktop options:', this.options);
    tocbot.init(this.options);
  }
}
