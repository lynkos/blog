# frozen_string_literal: true

# This plugin fixes anchor links that Enveloppe incorrectly transforms
# from [[#heading]] or [text](#heading) into relative URLs with .md extensions.
#
# It hooks into Jekyll's post-render stage to scan HTML content and convert
# malformed self-referential links back into proper anchor-only links.

puts "Loading fix_anchor_links plugin..."

Jekyll::Hooks.register [:posts, :pages, :documents], :post_render do |doc|
  # Only process HTML content (skip XML, JSON, etc.)
  next unless doc.output_ext == ".html"
  
  puts "Processing: #{doc.url}"
  
  # Pattern explanation:
  # This matches anchor links that incorrectly reference the current markdown file
  # instead of being simple anchor-only links.
  #
  # Examples of what this matches:
  # <a href="2025-03-19-play-windows-games.md#method-1">text</a>
  # <a href="2025-03-19-play-windows-games.md##method-1">text</a>
  # <a href="my-post.md#section">text</a>
  #
  # The pattern breaks down as:
  # - <a\s+href=" - Opening anchor tag with href attribute
  # - (?:\d{4}-\d{2}-\d{2}-)? - Optional date prefix (YYYY-MM-DD-)
  # - [^/\#"]+\.md - Filename ending in .md (no slashes or hashes in filename)
  # - \#{1,2} - One or two hash symbols (handles both # and ##)
  # - ([^"]+) - Capture group 1: the anchor text (everything after the hash(es))
  # - "([^>]*) - Capture group 2: closing quote and any other attributes
  # - >([^<]+)</a> - Capture group 3: link text between tags
  pattern = /<a\s+href="(?:\d{4}-\d{2}-\d{2}-)?[^\/\#"]+\.md\#{1,2}([^"]+)"([^>]*)>([^<]+)<\/a>/
  
  # Find all matches for detailed logging
  matches = doc.output.scan(pattern)
  
  if matches.length > 0
    puts "  Found #{matches.length} malformed anchor link(s) to fix in #{doc.url}"
    
    # Log the first few matches for debugging
    matches.first(3).each_with_index do |match, idx|
      puts "    Example #{idx + 1}: anchor='#{match[0]}', text='#{match[2]}'"
    end
    
    # Replace all matches with clean anchor-only links
    # \1 = the anchor text (without the # symbol(s))
    # \2 = additional attributes (class, id, etc.)
    # \3 = link text
    doc.output = doc.output.gsub(pattern, '<a href="#\1"\2>\3</a>')
    
    puts "  ✓ Fixed all malformed anchor links"
  end
end