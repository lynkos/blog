class InteractiveGraph {
  static CONFIG = {
    RADIUS: 15,
    DURATION: 300,
    MAX_LABEL_LENGTH: 10,
    EDGE_WIDTH: 3,
    OPACITY: 0.3,
    COLLISION_RADIUS: 10, // Space around nodes to prevent overlap
    CHARGE: -350, // Repulsion strength between nodes
    EDGE_DISTANCE: 200, // Distance between connected nodes
    MIN_ZOOM: 0.25,
    MAX_ZOOM: 5,
    FALLBACK_WIDTH: 800,
    FALLBACK_HEIGHT: 600
  };

  constructor(containerId, searchDataPath, edgesDataPath) {
    this.container = document.getElementById(containerId);
    this.searchDataPath = searchDataPath;
    this.edgesDataPath = edgesDataPath;
    this.nodes = [];
    this.edges = [];
    this.simulation = null;
    this.svg = null;
    this.isDimmed = false;
    
    this.init();
  }

  async init() {
    try {
      // Load search data (nodes) and edges data
      const [searchResponse, edgesResponse] = await Promise.all([
        fetch(this.searchDataPath),
        fetch(this.edgesDataPath).catch(() => ({ json: () => ({ edges: [] }) }))
      ]);
      
      const searchData = await searchResponse.json();
      const edgesData = await edgesResponse.json();
      
      // Create nodes from search data with index as ID
      this.nodes = searchData.map((item, index) => ({
        id: index,
        label: item.title,
        url: item.url
      }));
      
      this.edges = edgesData.edges || [];
      
      if (this.nodes.length === 0) {
        this.container.innerHTML = '<p>No posts found for graph visualization</p>';
        return;
      }
      
      this.setupSVG();
      this.setupSimulation();
      this.render();
    } catch (error) {
      console.error('Error loading graph data:', error);
      this.container.innerHTML = '<p>Error loading graph data</p>';
    }
  }

  setupSVG() {
    const width = this.container.clientWidth || InteractiveGraph.CONFIG.FALLBACK_WIDTH;
    const height = this.container.clientHeight || InteractiveGraph.CONFIG.FALLBACK_HEIGHT;
    
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom()
        .scaleExtent([InteractiveGraph.CONFIG.MIN_ZOOM, InteractiveGraph.CONFIG.MAX_ZOOM])
        .on('zoom', (event) => {
        this.svg.select('.graph-group').attr('transform', event.transform);
      }));
    
    this.graphGroup = this.svg.append('g').attr('class', 'graph-group');
  }

  setupSimulation() {
    const width = this.container.clientWidth || InteractiveGraph.CONFIG.FALLBACK_WIDTH;
    const height = this.container.clientHeight || InteractiveGraph.CONFIG.FALLBACK_HEIGHT;
    
    this.simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.edges).id(d => d.id).distance(InteractiveGraph.CONFIG.EDGE_DISTANCE))
      .force('charge', d3.forceManyBody().strength(InteractiveGraph.CONFIG.CHARGE))
      .force('collision', d3.forceCollide().radius(InteractiveGraph.CONFIG.COLLISION_RADIUS))
      .force('x', d3.forceX(width / 2))
      .force('y', d3.forceY(height / 2));
  }

  render() {
    // Render edges
    const link = this.graphGroup.selectAll('.link')
      .data(this.edges)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', 'var(--main-border-color)')
      //.attr('stroke-opacity', 0.75)
      .attr('stroke-width', InteractiveGraph.CONFIG.EDGE_WIDTH);

    // Render nodes
    const node = this.graphGroup.selectAll('.node')
      .data(this.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(this.drag());

    // Add circles to nodes
    node.append('circle')
      .attr('r', InteractiveGraph.CONFIG.RADIUS);

    // Add labels to nodes
    node.append('text')
      .text(d => this.truncateText(d.label, InteractiveGraph.CONFIG.MAX_LABEL_LENGTH))
      .attr('x', 0)
      .attr('y', InteractiveGraph.CONFIG.RADIUS * 2); // 30

    // Add click handlers
    node.on('click', (event, d) => {
      this.resetDimming();
      window.location.href = d.url;
    });

    // Add hover effects (desktop) and touch start (mobile)
    node.on('mouseover touchstart', (event, d) => {
      event.preventDefault(); // Prevent default touch behavior
      this.dimGraph(d);
    });

    node.on('mouseout', (event, d) => {
      // Only reset on mouseout for desktop, not on touchend
      if (event.type === 'mouseout' && !('ontouchstart' in window)) {
        this.resetDimming();
      }
    });

    // Add background click handler to reset dimming
    this.svg.on('click touchstart', (event) => {
      // Only reset if clicking on background (not on a node)
      if (event.target === this.svg.node() || event.target.closest('.graph-group') === this.graphGroup.node()) {
        this.resetDimming();
      }
    });

    // Update positions on simulation tick
    this.simulation.on('tick', () => {
      link.attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x}, ${d.y})`);
    });

    // Store references for later use
    this.nodeSelection = node;
    this.linkSelection = link;
  }

  dimGraph(hoveredNode) {
    if (this.isDimmed) return; // Prevent multiple dim operations
    
    this.isDimmed = true;

    // Get connected node IDs
    const connectedNodeIds = new Set([hoveredNode.id]);
    const connectedEdges = new Set();
    
    this.edges.forEach((edge, index) => {
      if (edge.source.id === hoveredNode.id || edge.target.id === hoveredNode.id) {
        connectedNodeIds.add(edge.source.id);
        connectedNodeIds.add(edge.target.id);
        connectedEdges.add(index);
      }
    });
    
    // Dim all nodes except hovered and connected ones
    this.nodeSelection.transition()
      .duration(InteractiveGraph.CONFIG.DURATION)
      .style('opacity', nodeData => 
        connectedNodeIds.has(nodeData.id) ? 1 : InteractiveGraph.CONFIG.OPACITY
      );
    
    // Dim all edges except connected ones
    this.linkSelection.transition()
      .duration(InteractiveGraph.CONFIG.DURATION)
      .style('opacity', (edgeData, index) => 
        connectedEdges.has(index) ? 1 : InteractiveGraph.CONFIG.OPACITY
      );
    
    const tooltip = d3.select('body').append('div')
      .attr('class', 'graph-tooltip')
      .text(hoveredNode.label);
    
    const event = d3.event || window.event;
    tooltip.style('left', (event.pageX + 10) + 'px')
           .style('top', (event.pageY - 10) + 'px');
  }

  resetDimming() {
    if (!this.isDimmed) return; // No need to reset if not dimmed
    
    this.isDimmed = false;

    // Reset all opacities
    if (this.nodeSelection) {
      this.nodeSelection.transition()
        .duration(InteractiveGraph.CONFIG.DURATION)
        .style('opacity', 1);
    }
    
    if (this.linkSelection) {
      this.linkSelection.transition()
        .duration(InteractiveGraph.CONFIG.DURATION)
        .style('opacity', 1);
    }
    
    d3.selectAll('.graph-tooltip').remove();
  }

  drag() {
    return d3.drag()
      .on('start', (event, d) => {
        this.resetDimming(); // Reset dimming when dragging starts
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
  }

  truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}

const graphContainer = document.getElementById('graph-container');

// Add page visibility API to handle back button navigation
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    // Page became visible again (user came back from another page)
    if (graphContainer && graphContainer.graphInstance) {
      graphContainer.graphInstance.resetDimming();
    }
  }
});

// Initialize graph when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (graphContainer) {
    const graph = new InteractiveGraph(
      'graph-container', 
      '/assets/js/data/search.json',
      '/assets/js/data/graph-edges.json'
    );
    graphContainer.graphInstance = graph; // Store reference for visibility API
  }
});