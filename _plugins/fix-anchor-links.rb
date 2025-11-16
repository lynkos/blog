# frozen_string_literal: true

# This plugin fixes links that Enveloppe incorrectly transforms:
# 1. Anchor links from [[#heading]] that become relative URLs with .md extensions
# 2. Wiki-links from [[Another Post]] that become relative paths to .md files
#
# It hooks into Jekyll's post-render stage to scan HTML content and convert
# malformed links into proper URLs.

puts "Loading fix-anchor-links plugin..."

Jekyll::Hooks.register [:posts, :pages, :documents], :post_render do |doc|
  # Only process HTML content (skip XML, JSON, etc.)
  next unless doc.output_ext == ".html"
  
  # puts "Processing: #{doc.url}"
  
  # PART 1: Fix anchor links (original functionality)
  # Pattern matches self-referential anchor links with .md extensions
  anchor_pattern = /<a\s+href="(?:\d{4}-\d{2}-\d{2}-)?[^\/\#"]+\.md\#{1,2}([^"]+)"([^>]*)>([^<]+)<\/a>/
  
  anchor_matches = doc.output.scan(anchor_pattern)
  
  if anchor_matches.length > 0
    puts "  Found #{anchor_matches.length} malformed anchor link(s) to fix in #{doc.url}"
    
    anchor_matches.first(3).each_with_index do |match, idx|
      puts "    Example #{idx + 1}: anchor='#{match[0]}', text='#{match[2]}'"
    end
    
    doc.output = doc.output.gsub(anchor_pattern, '<a href="#\1"\2>\3</a>')
    puts "  Fixed all malformed anchor links!"
  end
  
  # PART 2: Fix inter-post wiki-links
  # Pattern matches links to .md files that should be internal post links
  # Examples this catches:
  # <a href="./2025-03-19-another-note-here.md">2025-03-19-another-note-here</a>
  # <a href="2025-03-19-another-note-here.md">Link Text</a>
  wiki_pattern = /<a\s+href="\.?\/?((?:\d{4}-\d{2}-\d{2}-)?)([^\/\#"]+)\.md"([^>]*)>([^<]+)<\/a>/
  
  wiki_matches = doc.output.scan(wiki_pattern)
  
  if wiki_matches.length > 0
    puts "  Found #{wiki_matches.length} malformed wiki-link(s) to fix in #{doc.url}"
    
    # Build a lookup map of post slugs to their actual URLs
    # This allows us to find the correct post regardless of date prefixes
    post_map = {}
    doc.site.posts.docs.each do |post|
      # Extract the slug from the post (the part after /posts/)
      slug = post.url.split('/').last
      post_map[slug] = post.url
      
      # Also map the filename without extension, in case there's a mismatch
      basename = File.basename(post.path, '.md')
      # Remove date prefix if present (YYYY-MM-DD-)
      basename_without_date = basename.sub(/^\d{4}-\d{2}-\d{2}-/, '')
      post_map[basename_without_date] = post.url
    end
    
    # Process each wiki-link match
    doc.output = doc.output.gsub(wiki_pattern) do |match|
      date_prefix = $1  # Capture group 1: optional date prefix
      slug = $2          # Capture group 2: the actual filename/slug
      attributes = $3    # Capture group 3: any other HTML attributes
      link_text = $4     # Capture group 4: the visible link text
      
      # Try to find the actual post URL
      # First try with the slug as-is, then try without any date prefix
      target_url = post_map[slug] || post_map[slug.sub(/^\d{4}-\d{2}-\d{2}-/, '')]
      
      if target_url
        # Convert to absolute URL with your site's base URL
        absolute_url = "#{doc.site.config['url']}#{target_url}"
        puts "    Fixing: #{slug}.md -> #{absolute_url}"
        
        # Improve link text if it's just the filename
        # Convert "2025-03-19-another-note-here" to "Another Note Here"
        if link_text.match?(/^\d{4}-\d{2}-\d{2}-/)
          cleaned_text = link_text.sub(/^\d{4}-\d{2}-\d{2}-/, '')
                                  .split('-')
                                  .map(&:capitalize)
                                  .join(' ')
          "<a href=\"#{absolute_url}\"#{attributes}>#{cleaned_text}</a>"
        else
          "<a href=\"#{absolute_url}\"#{attributes}>#{link_text}</a>"
        end
      else
        # If we can't find the post, leave the link as-is and warn
        puts "    WARNING: Could not find post for slug '#{slug}'"
        match  # Return the original match unchanged
      end
    end
    
    puts "  Fixed all malformed wiki-links!"
  end
end