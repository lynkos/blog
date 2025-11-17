#!/usr/bin/env ruby
#
# Create image galleries with slideshow functionality
#
# Example usage:
#
# {% gallery %}
#    src="img1.jpg" alt="Image 1 alt" width="400" height="500"
#    src="img2.jpg" alt="Image 2 alt" height="auto"
# {% endgallery %}

module Jekyll
  class GalleryTag < Liquid::Block
    
    def render(context)
      # Get content between {% gallery %} and {% endgallery %}
      content = super
      
      # Parse each line of image data into structured information
      images = parse_images(content)
      
      # Generate the complete HTML structure with embedded JavaScript
      generate_html(images)
    end

    private

    # Transform the block content into an array of image objects
    # Each line like: src="/path.jpg" alt="Alt text" width="400" height="300"
    # Becomes: {src: "/path.jpg", alt: "Alt text", width: "400", height: "300"}
    def parse_images(content)
      images = []
      worker_base_url = "https://img-proxy.lynkos.dev/?url="
      
      # Split content by lines and process each non-empty line
      content.strip.split("\n").each do |line|
        line = line.strip
        next if line.empty?
        
        # Initialize image hash for this line
        image = {}
        
        # Extract src attribute - this is required
        if src_match = line.match(/src=["']([^"']+)["']/)
          src_val = src_match[1]
          
          # Rewrite only pbs.twimg.com links using path-based format
          if src_val.include?("pbs.twimg.com")            
            # Add image extension (defaults to .jpg) to help GLightbox recognize it as an image
            # Extract format parameter if it exists
            format_match = src_val.match(/format=(\w+)/)
            extension = format_match ? ".#{format_match[1]}" : ".jpg"
            
            # If the URL doesn't already end with an extension, add one
            unless src_val.match(/\.(jpg|jpeg|png|gif|webp|svg)/i)
              # Insert extension before query parameters if they exist
              if src_val.include?('?')
                src_val = src_val.sub('?', "#{extension}?")
              else src_val += extension
              end
            end
            
            image[:src] = worker_base_url + src_val
            image[:is_proxied] = true
          
          else 
            image[:src] = src_val
            image[:is_proxied] = false
          end
        else next # Skip lines without src attribute
        end
        
        # Extract alt attribute - optional, defaults to empty string
        if alt_match = line.match(/alt=["']([^"']+)["']/)
          image[:alt] = alt_match[1]
        else image[:alt] = ""
        end
        
        # Extract width attribute - optional, defaults to "auto"
        if width_match = line.match(/width=["']([^"']+)["']/)
          image[:width] = width_match[1]
        else 
          image[:width] = "auto"
        end
        
        # Extract height attribute - optional, defaults to "auto"
        if height_match = line.match(/height=["']([^"']+)["']/)
          image[:height] = height_match[1]
        else 
          image[:height] = "auto"
        end
                
        images << image
      end
      
      images
    end

    # Generate HTML structure for gallery
    def generate_html(images)
      return "" if images.empty?
      
      # Start building the HTML structure
      html = [ ]
      total_images = images.length
      
      html << %(<div class="gallery-container">)
      html << %(  <div class="slideshow">)
      html << %(    <div class="slides-parent">)
      
      # Generate main slideshow images
      # Each slide is initially hidden except the first one
      images.each_with_index do |image, index|
        # Add data attributes to force GLightbox to treat as image
        data_attrs = image[:is_proxied] ? ' data-type="image"' : ''
        
        # Build dimension attributes - include them even if set to "auto"
        # This ensures consistent behavior and helps prevent layout shifts
        dimension_attrs = %( width="#{image[:width]}" height="#{image[:height]}")
        
        html << %(    <div class="slides">)
        html << %(      <div class="slide-index">#{index + 1} / #{total_images}</div>)
        html << %(      <img src="#{image[:src]}" alt="#{image[:alt]}"#{dimension_attrs}#{data_attrs}>)
        html << %(    </div>)
      end

      html << %(    </div>) # Close slides-parent
      
      # Navigation arrows
      html << %(    <div class="arrows">)
      html << %(      <p class="prev" onclick="plusSlides(-1)">❮</p>)
      html << %(      <p class="next" onclick="plusSlides(1)">❯</p>)
      html << %(    </div>)

      # Caption container
      html << %(    <p id="caption"></p>)

      html << %(  </div>) # Close slideshow
            
      # Thumbnail row
      html << %(  <div class="gallery-row">)

      images.each_with_index do |image, index|
        # Add data attributes to thumbnails too
        data_attrs = image[:is_proxied] ? ' data-type="image"' : ''
        
        html << %(    <div class="gallery-column">)
        html << %(      <img class="slide-preview" src="#{image[:src]}" onclick="currentSlide(#{index + 1})" alt="#{image[:alt]}"#{data_attrs}>)
        html << %(    </div>)
      end

      html << %(  </div>) # Close gallery-row

      # Dots for slide indication and navigation
      html << %(  <div class='img-dot'>)
      images.each_with_index do |image, index|        
        html << %(    <span class='dot' onclick='currentSlide(#{index + 1})'></span>)
      end

      html << %(  </div>)
      html << %(</div>) # Close gallery-container

      # Join all HTML parts and return as a single string
      html << generate_javascript(total_images)
      html << generate_css(total_images)
      html.join("\n")
    end

    # Set thumbnail width based on total # of images
    def generate_css(total_images)
      css = [ ]
      
      css << %(<style type='text/css'>)
      css << %(  .gallery-row .gallery-column { width: #{100 / total_images}%; } )
      css << %(</style>)

      css.join("\n")
    end

    # Generate the JavaScript code for slideshow functionality
    def generate_javascript(total_images)
      js = []
      
      js << %(<script>)
      js << %(  let slideIndex = 1;)
      js << %(  showSlides(slideIndex);)
      js << %()
      
      # Function to move forward/backward through slides
      # Parameter n: +1 for next, -1 for previous
      js << %(  function plusSlides(n) {)
      js << %(    showSlides((slideIndex += n));)
      js << %(  })
      js << %()
      
      # Function to jump directly to a specific slide
      # Parameter n: slide number (1-based indexing)
      js << %(  function currentSlide(n) {)
      js << %(    showSlides((slideIndex = n));)
      js << %(  })
      js << %()
      
      # Main function that handles slide visibility and updates UI
      js << %(  function showSlides(n) {)
      js << %(    let i;)
      js << %(    let slides = document.getElementsByClassName('slides');)
      js << %(    let preview = document.getElementsByClassName('slide-preview');)
      js << %(    let dot = document.getElementsByClassName('dot');)
      js << %(    let captionText = document.getElementById('caption');)
      js << %()
      
      # Handle wraparound: if we go past the last slide, show the first
      js << %(    if (n > slides.length) { slideIndex = 1; })
      # Handle wraparound: if we go before the first slide, show the last
      js << %(    if (n < 1) { slideIndex = slides.length; })
      js << %()
      
      # Hide all slides initially
      js << %(    for (i = 0; i < slides.length; i++) {)
      js << %(      slides[i].style.display = 'none';)
      js << %(    })
      js << %()
      
      # Remove 'active' class from all thumbnails
      js << %(    for (i = 0; i < preview.length; i++) {)
      js << %(      preview[i].className = preview[i].className.replace(' active', '');)
      js << %(      dot[i].className = dot[i].className.replace(' active_dot', '');)
      js << %(    })
      js << %()
      
      # Show the current slide and mark its thumbnail as active
      js << %(    slides[slideIndex - 1].style.display = 'flex';)
      js << %(    preview[slideIndex - 1].className += ' active';)
      js << %(    dot[slideIndex - 1].className += ' active_dot';)

      # Update the caption with the current image's alt text
      js << %(    captionText.innerHTML = preview[slideIndex - 1].alt;)
      js << %(  })
      js << %(</script>)
      
      js.join("\n")
    end
  end
end

# Register the plugin with Jekyll's Liquid template engine
# This makes the {% gallery %} tag available in your templates
Liquid::Template.register_tag('gallery', Jekyll::GalleryTag)