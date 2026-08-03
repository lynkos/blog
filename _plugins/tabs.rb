#!/usr/bin/env ruby
#
# Create tabbed content blocks; indented usage (e.g. nested inside a list item) is also supported
#
# Example usage:
#
# {% tabs my-first-tabs %}
#  ---TAB: Paris
#  Paris is the capital of France.<br>
#  You can include **markdown** here.
#  ---TAB: Tokyo
#  <pre>// You can also include raw HTML
#  function greet() {
#      console.log("Hello from Tokyo!");
#  }</pre>
#  {% endtabs %}

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

      # Generate the HTML structure
      html = generate_html(@id, tabs)

      # Flatten to a single logical line (see flatten_newlines for why).
      flatten_newlines(html)
    end

    private

    def parse_tabs(content)
      tabs = []
      current_tab = nil

      content.each_line do |line|
        # Only use a stripped copy to *detect* markers; keep the raw line
        # (minus its trailing newline) so relative indentation survives
        # long enough to reach the markdown converter.
        stripped = line.strip

        if stripped.start_with?('---TAB:')
          # Save previous tab if it exists
          tabs << current_tab if current_tab

          # Start new tab
          title = stripped.sub('---TAB:', '').strip
          current_tab = { title: title, lines: [] }

        elsif current_tab
          current_tab[:lines] << line.chomp
        end
      end

      # Don't forget the last tab
      tabs << current_tab if current_tab

      # Dedent each tab's content independently so a fenced code block
      # indented one level deeper than its `---TAB:` marker collapses to
      # column 0 (letting kramdown recognize the fence), while any
      # deliberate *internal* relative indentation is preserved.
      tabs.each do |tab|
        tab[:content] = dedent(tab[:lines]) + "\n"
        tab.delete(:lines)
      end

      tabs
    end

    # Strip the smallest common leading whitespace from a set of lines,
    # leaving relative indentation between lines intact.
    def dedent(lines)
      indents = lines.reject { |l| l.strip.empty? }
                     .map { |l| l[/\A */].size }
      min_indent = indents.min || 0

      lines.map do |l|
        l.empty? ? l : (l[min_indent..-1] || '')
      end.join("\n")
    end

    # kramdown decides whether a line still belongs to an enclosing list
    # item purely by checking that line's own leading indentation against
    # the list's content column. Liquid only preserves the *original*
    # source indentation for the very first line of our tag's rendered
    # output (the whitespace before `{%` is untouched template text) —
    # every line we generate ourselves starts at whatever column our own
    # string-building put it at, which almost never matches the enclosing
    # list/blockquote/etc. indentation. That mismatch causes kramdown to
    # terminate the list item after our first line and treat the rest of
    # our HTML as an orphaned top-level block (exactly the corruption
    # reported).
    #
    # Rather than trying to reconstruct the caller's indentation (not
    # reliably available from a Liquid::Block), we avoid the problem
    # entirely: collapse the whole rendered output to one physical line.
    # With no raw "\n" bytes left, there is no "line 2" for kramdown's
    # list-continuation check to reject.
    #
    # We can't just delete the newlines outright, though — some of them
    # live inside `<pre>` blocks from multi-line code snippets, where the
    # line breaks are visually significant. Numeric character references
    # solve this: `&#10;` is decoded back into a literal LF by the browser
    # after HTML parsing, so `<pre>` still displays correct line breaks,
    # while kramdown itself never sees a raw newline in the source text.
    def flatten_newlines(html)
      html.gsub(/\r\n|\r|\n/, '&#10;')
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