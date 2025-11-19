const CONFIG = {
  previewDelay: 100, // ms
  maxPreviewLength: 200, // chars
  contentSelectors: [ // Target links within post content
    '.content a'
  ],
  allowedDomains: [ // External domains to show previews for
    'blog.lynkos.dev',
    '127.0.0.1',
    'localhost'
  ]
};

let preview = null;
let hideTimer = null;
let currentLink = null;

// Cache to store fetched content and avoid redundant requests
const contentCache = {};

function createPreviewElement() {
  preview = document.createElement('div');
  preview.className = 'link-preview';
  preview.style.display = 'none';
  preview.style.opacity = '0';
  document.body.appendChild(preview);
}

function showPreview(link, content) {
  if (!preview) return;
  
  preview.innerHTML = content;
  preview.style.display = 'block';
  preview.style.opacity = '1';
  
  // Position preview near the link
  const rect = link.getBoundingClientRect();
  const pageTop = window.pageYOffset || document.documentElement.scrollTop;
      
  // Calculate top position
  let top = rect.top + (rect.height / 2) - (preview.offsetHeight / 2);
  if ((window.innerHeight - rect.top) < (preview.offsetHeight)) { // Link is close to bottom
    top = rect.top + pageTop - preview.offsetHeight - 10; // Position preview above link
  } else { // Link is close to top
    top = rect.top + pageTop + 35; // Position preview below link
  }

  // Calculate left position
  let left = rect.left - (preview.offsetWidth / 2) + (rect.width / 2);
  if ((rect.left + (rect.width / 2)) < (preview.offsetWidth / 2)) {
    left = 10;
  } else if ((document.body.clientWidth - rect.left - (rect.width / 2)) < (preview.offsetWidth / 2)) {
    left = document.body.clientWidth - preview.offsetWidth - 20;
  }
  
  preview.style.left = left + 'px';
  preview.style.top = top + 'px';
}

function hidePreview() {
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    if (preview) {
      preview.innerHTML = '';
      preview.style.display = 'none';
      preview.style.opacity = '0';
    }
    currentLink = null;
  }, CONFIG.previewDelay);
}

function extractContent(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Extract main content
  let content = doc.querySelector('article') || doc.querySelector('main');
  
  if (!content) return '<p>Preview not available</p>';
  
  const postTitle = doc.querySelector('header h1');
  const titleText = postTitle ? postTitle.textContent.trim() : '';
  
  const postDescription = content.querySelector('.post-desc');
  const description = postDescription ? postDescription.textContent.trim() : '';

  // Excerpt from 1st paragraph
  const postExcerpt = content.querySelector('.content p');
  const excerpt = postExcerpt ? postExcerpt.textContent.trim() : '';

  // Limit preview length
  const truncatedDescription = description.length > CONFIG.maxPreviewLength 
    ? description.substring(0, CONFIG.maxPreviewLength) + '...' 
    : description;

  const truncatedExcerpt = excerpt.length > CONFIG.maxPreviewLength 
    ? excerpt.substring(0, CONFIG.maxPreviewLength) + '...' 
    : excerpt;
  
  return `
    <div class="preview-title">${titleText}</div>
    <div class="preview-description">${truncatedDescription}</div>
    <div class="preview-excerpt">${truncatedExcerpt}</div>
  `;
}

async function fetchPreview(url) {
  // Check cache first
  if (contentCache[url]) return contentCache[url];
  
  try {
    // Convert relative URLs to absolute URLs
    const fetchUrl = url.startsWith('/') ? window.location.origin + url : url;
    
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error('Failed to fetch');
    
    const html = await response.text();
    const content = extractContent(html);
    
    // Store in cache
    contentCache[url] = content;
    return content;
  } catch (error) {
    console.error('Error fetching preview:', error);
    return '<p>Preview unavailable</p>';
  }
}

function isAllowedUrl(href) {
  // Skip anchor links
  if (href.startsWith('#')) return false;
  
  // Internal links (relative paths starting with /)
  if (href.startsWith('/')) return true;
  
  // Skip non-HTTP protocols (steam://, mailto:, tel:, etc.)
  if (!href.startsWith('http://') && !href.startsWith('https://')) return false;
  
  // Check for allowed external domains with posts path
  try {
    const url = new URL(href);
    return CONFIG.allowedDomains.includes(url.hostname) && url.pathname.startsWith('/posts/');
  } catch (error) {
    return false;
  }
}

function handleMouseEnter(event) {
  const link = event.currentTarget;
  
  // Check if URL is allowed for previews
  const href = link.getAttribute('href');
  if (!href || !isAllowedUrl(href)) return;
  
  clearTimeout(hideTimer);
  currentLink = link;
  
  // Show loading state
  showPreview(link, '<p class="preview-loading">Loading...</p>');
  
  // Fetch and display content
  fetchPreview(href).then(content => {
    if (currentLink === link) showPreview(link, content);
  });
}

function handleMouseLeave() {
  hidePreview();
}

function attachPreviewEvents() {
  if (!preview) return;
  
  // Prevent preview from disappearing when hovering over it
  preview.addEventListener('mouseenter', () => {
    clearTimeout(hideTimer);
  });

  preview.addEventListener('mouseleave', hidePreview);
  preview.addEventListener('touchend', hidePreview);
}

export function initLinkPreview() {
  // Create preview element
  createPreviewElement();
  
  // Attach preview events
  attachPreviewEvents();
  
  // Initialize - attach event listeners to all content links
  CONFIG.contentSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(link => {
      // Skip anchors and links with certain classes
      const href = link.getAttribute('href');
      if (!href || 
          link.classList.contains('popup') ||
          link.classList.contains('img-link') ||
          link.classList.contains('recently-updated') ||
          link.classList.contains('no-preview') ||
          !isAllowedUrl(href)) {
        return;
      }
      
      link.addEventListener('mouseenter', handleMouseEnter);
      link.addEventListener('mouseleave', handleMouseLeave);
      link.addEventListener('touchend', handleMouseLeave);
    });
  });
}