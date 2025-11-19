/**
 * TOC Configuration
 * 
 * Reads the heading selector configuration that was injected by Jekyll during build.
 * This allows the TOC heading levels to be controlled from _config.yml without
 * hardcoding values in JavaScript.
 * 
 * The configuration is set in _config.yml under:
 *   toc:
 *     min_heading_level: 2
 *     max_heading_level: 7
 */

export const headings = window.SITE_CONFIG?.tocHeadingSelector || 'h2, h3, h4, h5, h6, h7';