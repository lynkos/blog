#!/usr/bin/env ruby
#
# Create tabbed content blocks
#
# Example usage:
#
#{% tabs my-first-tabs %}
# ---TAB: Paris
# Paris is the capital of France.<br>
# You can include **markdown** here.
# ---TAB: Tokyo
# <pre>// You can also include raw HTML
# function greet() {
#     console.log("Hello from Tokyo!");
# }</pre>
# {% endtabs %}

module Jekyll
  class TabsBlock < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
      @id = markup.strip
      # Debug output to verify plugin is loading
      Jekyll.logger.info "Tabs plugin:", "Initializing tabs block with ID: #{@id}"
    end

    def render(context)
      # Parse the content to extract tab definitions
      content = super
      tabs = parse_tabs(content)
      
      Jekyll.logger.info "Tabs plugin:", "Found #{tabs.length} tabs"
      
      # Generate the HTML structure
      generate_html(@id, tabs)
    end

    private

    def parse_tabs(content)
      tabs = []
      current_tab = nil
      
      content.each_line do |line|
        line = line.strip
        
        if line.start_with?('---TAB:')
          # Save previous tab if it exists
          tabs << current_tab if current_tab
          
          # Start new tab
          title = line.sub('---TAB:', '').strip
          current_tab = { title: title, content: '' }
        
        elsif current_tab
          # Add content to current tab (preserve the newline)
          current_tab[:content] += line + "\n"
        end
      end
      
      # Don't forget the last tab
      tabs << current_tab if current_tab
      tabs
    end

    def generate_html(id, tabs)
      return '<div class="error">No tabs found</div>' if tabs.empty?
      
      # Generate tab buttons
      tab_buttons = tabs.map.with_index do |tab, index|
        width_percent = 100.0 / tabs.length
        %(<button style="width: #{width_percent}%" class="tablinks" data-target="#{id}-tab#{index}">#{tab[:title]}</button>)
      end.join

      # Generate tab content divs
      tab_contents = tabs.map.with_index do |tab, index|
        # Process content through Jekyll's markdown converter
        site = Jekyll.sites.first
        converter = site.find_converter_instance(Jekyll::Converters::Markdown)
        processed_content = converter.convert(tab[:content])
        %(<div id="#{id}-tab#{index}" class="tabcontent">#{processed_content}</div>)
      end.join

      # Return complete HTML structure
      <<~HTML
        <div class="tab-container" id="#{id}">
          <div class="tab">
            #{tab_buttons}
          </div>
          #{tab_contents}
        </div>
      HTML
    end
  end
end

# Register the tag with Liquid
Liquid::Template.register_tag('tabs', Jekyll::TabsBlock)