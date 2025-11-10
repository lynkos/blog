(function() {
  const CONFIG = {
    previewDelay: 100, // ms
    maxPreviewLength: 200, // chars
    contentSelectors: [ // Target links within post content
      '.content a'
    ]
  };

  const preview = document.createElement('div');
  preview.className = 'link-previews';
  preview.style.display = 'none';
  preview.style.opacity = '0';
  document.body.appendChild(preview);

  let hideTimer;
  let currentLink = null;

  // Cache to store fetched content and avoid redundant requests
  const contentCache = {};

  function showPreview(link, content) {
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
      preview.innerHTML = '';
      preview.style.display = 'none';
      preview.style.opacity = '0';
      currentLink = null;
    }, CONFIG.previewDelay);
  }

  function extractContent(html) {
    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Try to extract the main content
    let content = doc.querySelector('article') || doc.querySelector('main');
    
    if (!content) return '<p>Preview not available</p>';
    
    // Get post title
    const title = doc.querySelector('header h1');
    const titleText = title ? title.textContent.trim() : '';
    
    // Get post description
    const postDescription = content.querySelector('.post-desc');
    const description = postDescription ? postDescription.textContent.trim() : '';

    // Get excerpt from first paragraph
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
      const response = await fetch(url);
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

  function handleMouseEnter(event) {
    const link = event.currentTarget;
    
    // Only show previews for internal links
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('https') || href.startsWith('#')) return;
    
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

  // Prevent preview from disappearing when hovering over it
  preview.addEventListener('mouseenter', () => {
    clearTimeout(hideTimer);
  });

  preview.addEventListener('mouseleave', hidePreview);
  preview.addEventListener('touchend', hidePreview);

  // Initialize - attach event listeners to all content links
  function initializeLinkPreviews() {
    CONFIG.contentSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(link => {
        // Skip external links, anchors, and links with certain classes
        const href = link.getAttribute('href');
        if (!href || 
            href.startsWith('http') ||
            href.startsWith('https') ||
            href.startsWith('#') ||
            link.classList.contains('popup') ||
            link.classList.contains('img-link') ||
            link.classList.contains('recently-updated') ||
            link.classList.contains('no-preview')) {
          return;
        }
        
        link.addEventListener('mouseenter', handleMouseEnter);
        link.addEventListener('mouseleave', handleMouseLeave);
        link.addEventListener('touchend', handleMouseLeave);
      });
    });
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLinkPreviews);
  } else initializeLinkPreviews();
})();