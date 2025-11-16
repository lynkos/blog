# frozen_string_literal: true

# Graph Generator Plugin for Jekyll
# This plugin analyzes all posts to build a graph of internal links

require 'json'
require 'fileutils'

Jekyll::Hooks.register :site, :post_write do |site|
  puts "\n=== Graph Generator Hook Triggered ==="
  
  # Ensure the data directory exists
  data_dir = File.join(site.dest, 'assets', 'js', 'data')
  FileUtils.mkdir_p(data_dir)

  # Read existing search.json file
  search_json_path = File.join(data_dir, 'search.json')
  
  # If search.json doesn't exist, create basic structure from posts
  unless File.exist?(search_json_path)
    search_data = site.posts.docs.map do |post|
      {
        'title' => post.data['title'] || post.basename,
        'url' => post.url
      }
    end
    
    File.open(search_json_path, 'w') do |file|
      file.write(JSON.pretty_generate(search_data))
    end
  end

  begin
    search_data = JSON.parse(File.read(search_json_path))
    puts "Loaded search data with #{search_data.length} items"
  rescue JSON::ParserError => e
    puts "Error parsing search.json: #{e.message}"
    return
  end

  edges = []
  posts_map = {}
  title_to_url = {}
  filename_to_url = {}
  slug_to_url = {}

  # Create comprehensive mappings
  search_data.each_with_index do |item, index|
    if item['url'] && item['title']
      posts_map[item['url']] = index
      
      # Extract slug from URL (last part)
      url_parts = item['url'].split('/')
      slug = url_parts.last || url_parts[-2] # Handle both /slug/ and /slug
      slug_to_url[slug] = item['url'] if slug && !slug.empty?
      
      # Create various title mappings for wikilinks
      title = item['title']
      title_to_url[title.downcase] = item['url']
      title_to_url[title.downcase.gsub(/[^a-z0-9\s]/, '').gsub(/\s+/, ' ').strip] = item['url']
      title_to_url[title.downcase.gsub(/\s+/, '-')] = item['url']
      title_to_url[title.downcase.gsub(/[^a-z0-9]/, '-').gsub(/-+/, '-').gsub(/^-|-$/, '')] = item['url']
    end
  end

  # Create filename mappings
  site.posts.docs.each do |post|
    filename = File.basename(post.path)
    filename_base = File.basename(post.path, '.md')
    filename_to_url[filename] = post.url
    filename_to_url[filename_base] = post.url
  end

  puts "Created posts map with #{posts_map.length} entries"
  puts "Created title map with #{title_to_url.length} entries"
  puts "Created filename map with #{filename_to_url.length} entries"
  puts "Created slug map with #{slug_to_url.length} entries"

  # Build edges by finding internal links
  site.posts.docs.each do |post|
    source_url = post.url
    source_index = posts_map[source_url]
    next unless source_index

    content = post.content
    found_links = []
    
    puts "Analyzing post: #{File.basename(post.path)} (#{post.data['title']})"
    
    # 1. Find standard markdown links [text](url)
    content.scan(/\[([^\]]*)\]\(([^)]+)\)/) do |text, url|
      clean_url = normalize_url(url, site.baseurl, site.config['url'], filename_to_url, slug_to_url, site.posts.docs)
      if clean_url
        found_links << clean_url
        # puts "  Markdown link: #{url} -> #{clean_url}"
      end
    end
    
    # 2. Find wikilinks [[Page Name]]
    content.scan(/\[\[([^\]]+)\]\]/) do |match|
      page_name = match[0].strip
      
      # Try different variations to find matching post
      variations = [
        page_name.downcase,
        page_name.downcase.gsub(/[^a-z0-9\s]/, '').gsub(/\s+/, ' ').strip,
        page_name.downcase.gsub(/\s+/, '-'),
        page_name.downcase.gsub(/[^a-z0-9]/, '-').gsub(/-+/, '-').gsub(/^-|-$/, '')
      ]
      
      found_url = nil
      variations.each do |variation|
        if title_to_url[variation]
          found_url = title_to_url[variation]
          break
        end
      end
      
      # If not found by title, try to find by URL pattern
      unless found_url
        slug = page_name.downcase.gsub(/[^a-z0-9\s]/, '').gsub(/\s+/, '-')
        site.posts.docs.each do |target_post|
          if target_post.url.include?(slug) || target_post.data['title']&.downcase&.include?(page_name.downcase)
            found_url = target_post.url
            break
          end
        end
      end
      
      if found_url
        found_links << found_url
        # puts "  Wikilink: [[#{page_name}]] -> #{found_url}"
      end
    end
    
    # 3. Find relative URLs that might be internal links
    content.scan(/href=["']([^"']+)["']/) do |match|
      url = match[0]
      clean_url = normalize_url(url, site.baseurl, site.config['url'], filename_to_url, slug_to_url, site.posts.docs)
      if clean_url
        found_links << clean_url
        # puts "  href link: #{url} -> #{clean_url}"
      end
    end
    
    # Create edges for found links
    found_links.uniq.each do |target_url|
      target_index = posts_map[target_url]
      if target_index && target_index != source_index
        edges << {
          source: source_index,
          target: target_index
        }
        puts "  ✓ Created edge: #{source_index} -> #{target_index} (#{post.data['title']} -> #{search_data[target_index]['title']})"
      end
    end
  end

  # Write edges data
  edges_data = { edges: edges }
  edges_path = File.join(data_dir, 'graph-edges.json')
  
  begin
    File.open(edges_path, 'w') do |file|
      file.write(JSON.pretty_generate(edges_data))
    end
    puts "Successfully wrote graph-edges.json with #{edges.length} edges"
  rescue => e
    puts "Error writing graph-edges.json: #{e.message}"
  end
  
  puts "=== Graph Generator Hook Completed ==="
end

# Enhanced helper function to normalize URLs and handle all patterns
def normalize_url(url, baseurl, site_url, filename_to_url, slug_to_url, posts)
  return nil if url.nil? || url.empty?
  
  original_url = url
  # puts "    Normalizing: #{original_url}"
  
  # Handle different URL patterns
  
  # 1. YYYY-MM-DD-*.md filename pattern
  if url.match?(/^\d{4}-\d{2}-\d{2}-.+\.md$/)
    result = filename_to_url[url]
    # puts "      Filename pattern match: #{result}" if result
    return result
  end
  
  # 2. YYYY-MM-DD-* filename pattern (without .md)
  if url.match?(/^\d{4}-\d{2}-\d{2}-.+$/) && !url.include?('/')
    result = filename_to_url[url] || filename_to_url["#{url}.md"]
    # puts "      Filename base pattern match: #{result}" if result
    return result
  end
  
  # 3. _posts/* or /_posts/* patterns
  if url.match?(%r{^/?_posts/.+\.md$})
    filename = File.basename(url)
    result = filename_to_url[filename]
    # puts "      _posts pattern match: #{result}" if result
    return result
  end
  
  # 4. Full domain URLs - extract the path
  if url.match?(%r{^https?://})
    # Check if it's one of our supported domains
    supported_domains = [
      'blog.lynkos.dev',
      '127.0.0.1:4000', 
      'localhost:4000'
    ]
    
    is_supported = supported_domains.any? { |domain| url.include?(domain) }
    if site_url && url.include?(site_url.gsub(%r{^https?://}, ''))
      is_supported = true
    end
    
    unless is_supported
      # puts "      External URL, skipping"
      return nil
    end
    
    # Extract path from URL
    uri_parts = url.split('/', 4)
    if uri_parts.length >= 4
      path = "/#{uri_parts[3]}"
    else
      # puts "      Invalid URL format"
      return nil
    end
    
    url = path
    # puts "      Extracted path from full URL: #{url}"
  end
  
  # 5. Domain without protocol (blog.lynkos.dev/posts/*)
  if url.match?(%r{^blog\.lynkos\.dev/})
    path = "/#{url.split('/', 2)[1]}"
    url = path
    # puts "      Extracted path from domain URL: #{url}"
  end
  
  # Skip anchors, mailto, etc.
  if url.start_with?('#', 'mailto:', 'tel:', 'javascript:')
    # puts "      Skipping non-post link"
    return nil
  end
  
  # Remove baseurl if present
  if baseurl && !baseurl.empty?
    url = url.gsub(/^#{Regexp.escape(baseurl)}/, '')
  end
  
  # Ensure it starts with /
  url = "/#{url}" unless url.start_with?('/')
  
  # Remove fragment/anchor
  url = url.split('#')[0]
  
  # Remove query parameters
  url = url.split('?')[0]
  
  # Clean up double slashes
  url = url.gsub(/\/+/, '/')
  
  # 6. Handle /posts/* pattern - convert to Jekyll's date-based URL structure
  if url.match?(%r{^/posts/([^/]+)/?$})
    slug = $1
    # puts "      Found /posts/ pattern with slug: #{slug}"
    
    # Try to find the post by slug
    result = slug_to_url[slug]
    if result
      # puts "      Slug match found: #{result}"
      return result
    end
    
    # Try to find by searching through posts
    posts.each do |post|
      post_slug = post.url.split('/').last || post.url.split('/')[-2]
      if post_slug == slug
        # puts "      Post search match: #{post.url}"
        return post.url
      end
    end
    
    # puts "      No match found for slug: #{slug}"
    return nil
  end
  
  # 7. For other URLs, ensure proper Jekyll format
  unless url.end_with?('/') || url.include?('.')
    url = "#{url}/"
  end
  
  # Final check - see if this URL exists in our posts
  posts.each do |post|
    if post.url == url
      # puts "      Direct URL match: #{url}"
      return url
    end
  end
  
  # puts "      No match found for: #{url}"
  nil
end