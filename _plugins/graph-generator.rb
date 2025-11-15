# frozen_string_literal: true

# Graph Generator Plugin for Jekyll
# This plugin analyzes all posts to build a graph of internal links

require 'json'
require 'fileutils'

Jekyll::Hooks.register :site, :post_write do |site|
  puts "=== Graph Generator Hook Triggered ==="
  
  # Ensure the data directory exists
  data_dir = File.join(site.dest, 'assets', 'js', 'data')
  puts "Data directory: #{data_dir}"
  
  FileUtils.mkdir_p(data_dir)
  puts "Directory created/exists: #{Dir.exist?(data_dir)}"

  # Read existing search.json file
  search_json_path = File.join(data_dir, 'search.json')
  puts "Search JSON path: #{search_json_path}"
  puts "Search JSON exists: #{File.exist?(search_json_path)}"
  
  # If search.json doesn't exist, create basic structure from posts
  unless File.exist?(search_json_path)
    puts "Creating search.json from posts..."
    search_data = site.posts.docs.map do |post|
      {
        'title' => post.data['title'] || post.basename,
        'url' => post.url
      }
    end
    
    File.open(search_json_path, 'w') do |file|
      file.write(JSON.pretty_generate(search_data))
    end
    puts "Created search.json with #{search_data.length} posts"
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

  # Create URL to index mapping
  search_data.each_with_index do |item, index|
    posts_map[item['url']] = index if item['url']
  end
  puts "Created posts map with #{posts_map.length} entries"

  # Build edges by finding internal links
  site.posts.docs.each do |post|
    source_url = post.url
    source_index = posts_map[source_url]
    next unless source_index

    content = post.content
    
    # Find markdown links [text](url)
    content.scan(/\[([^\]]+)\]\(([^)]+)\)/) do |text, url|
      clean_url = url.gsub(site.baseurl || '', '').split('#').first
      clean_url = "/#{clean_url}" unless clean_url.start_with?('/')
      
      target_index = posts_map[clean_url]
      if target_index && target_index != source_index
        edges << {
          source: source_index,
          target: target_index
        }
      end
    end
  end

  puts "Generated #{edges.length} edges"

  # Write edges data
  edges_data = { edges: edges }
  edges_path = File.join(data_dir, 'graph-edges.json')
  
  begin
    File.open(edges_path, 'w') do |file|
      file.write(JSON.pretty_generate(edges_data))
    end
    puts "Successfully wrote graph-edges.json to #{edges_path}"
    puts "File exists after write: #{File.exist?(edges_path)}"
    puts "File size: #{File.size(edges_path)} bytes" if File.exist?(edges_path)
  rescue => e
    puts "Error writing graph-edges.json: #{e.message}"
  end
  
  puts "=== Graph Generator Hook Completed ==="
end