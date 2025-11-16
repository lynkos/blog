class InteractiveGraph {
  static CONFIG = {
    RADIUS: 15,
    TRANSITION_DURATION: 300,
    MAX_LABEL_LENGTH: 10,
    EDGE_WIDTH: 3,
    DIM_OPACITY: 0.25,
    COLLISION_RADIUS: 10,
    CHARGE: -350,
    EDGE_DISTANCE: 200,
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
    this.nodeSelection = null;
    this.linkSelection = null;
    this.highlightedNode = null;
    this.dragStartTime = 0;
    this.isDragging = false;
    
    this.init();
  }

  async init() {
    try {
      const [searchResponse, edgesResponse] = await Promise.all([
        fetch(this.searchDataPath),
        fetch(this.edgesDataPath).catch(() => ({ json: () => ({ edges: [] }) }))
      ]);
      
      const searchData = await searchResponse.json();
      const edgesData = await edgesResponse.json();
      
      // Transform search data into nodes
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
          this.graphGroup.attr('transform', event.transform);
        })
      )
      // Reset highlighting when clicking background
      .on('click', () => this.resetHighlight());
    
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
    // Edges
    this.linkSelection = this.graphGroup.selectAll('.link')
      .data(this.edges)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', 'var(--main-border-color)')
      .attr('stroke-width', InteractiveGraph.CONFIG.EDGE_WIDTH);

    // Nodes
    const node = this.graphGroup.selectAll('.node')
      .data(this.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(this.createDragBehavior());

    node.append('circle')
      .attr('r', InteractiveGraph.CONFIG.RADIUS)
      .style('cursor', 'pointer');

    node.append('text')
      .text(d => this.truncateText(d.label))
      .attr('y', InteractiveGraph.CONFIG.RADIUS * 2);

    node.on('click', (event, d) => this.handleNodeClick(event, d));
    node.on('mouseenter', (event, d) => this.handleNodeHover(event, d));
    node.on('mouseleave', () => {
      // Only reset on mouse devices (i.e. not touchscreens)
      if (!('ontouchstart' in window)) {
        this.resetHighlight();
        this.hideTooltip();
      }
    });

    // Update positions on each simulation tick
    this.simulation.on('tick', () => {
      this.linkSelection
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x}, ${d.y})`);
    });

    this.nodeSelection = node;
  }

  handleNodeClick(event, node) {
    // Prevent navigation while dragging
    if (this.isDragging) return;
    
    this.resetHighlight();
    this.hideTooltip();
    
    // Navigate to node's respective post
    const link = document.createElement('a');
    link.href = node.url;
    link.click();
  }

  handleNodeHover(event, node) {
    // Don't highlight or show tooltip while dragging
    if (this.isDragging) return;
    
    this.highlightNode(node);
    this.showTooltip(event, node);
  }

  showTooltip(event, node) {
    this.hideTooltip();
    
    d3.select('body')
      .append('div')
      .attr('class', 'graph-tooltip')
      .text(node.label)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 10) + 'px');
  }

  hideTooltip() {
    d3.selectAll('.graph-tooltip').remove();
  }

  highlightNode(targetNode) {
    // Avoid redundant updates
    if (this.highlightedNode?.id === targetNode.id) return;
    
    this.highlightedNode = targetNode;

    const connectedNodeIds = new Set([targetNode.id]);
    const connectedEdgeIndices = new Set();
    
    this.edges.forEach((edge, index) => {
      if (edge.source.id === targetNode.id || edge.target.id === targetNode.id) {
        connectedNodeIds.add(edge.source.id);
        connectedNodeIds.add(edge.target.id);
        connectedEdgeIndices.add(index);
      }
    });
    
    // Apply dimming
    this.nodeSelection
      .transition()
      .duration(InteractiveGraph.CONFIG.TRANSITION_DURATION)
      .style('opacity', d => connectedNodeIds.has(d.id) ? 1 : InteractiveGraph.CONFIG.DIM_OPACITY);
    
    this.linkSelection
      .transition()
      .duration(InteractiveGraph.CONFIG.TRANSITION_DURATION)
      .style('opacity', (d, i) => connectedEdgeIndices.has(i) ? 1 : InteractiveGraph.CONFIG.DIM_OPACITY);
  }

  resetHighlight() {
    if (!this.highlightedNode) return;
    
    this.highlightedNode = null;

    this.nodeSelection
      .transition()
      .duration(InteractiveGraph.CONFIG.TRANSITION_DURATION)
      .style('opacity', 1);
    
    this.linkSelection
      .transition()
      .duration(InteractiveGraph.CONFIG.TRANSITION_DURATION)
      .style('opacity', 1);
  }
  
  createDragBehavior() {
    return d3.drag()
      .on('start', (event, d) => {
        this.dragStartTime = Date.now();
        this.isDragging = false;
        
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        
        this.highlightNode(d);
      })
      .on('drag', (event, d) => {
        if (!this.isDragging) {
          this.isDragging = true;
          this.hideTooltip();
          
          const circle = this.nodeSelection.filter(nodeData => nodeData.id === d.id).select('circle');
          
          // Change node color + cursor while dragging
          circle.style('cursor', 'grabbing');
          circle.style('fill', 'var(--link-hover-color)');
        }
        
        // Keep dragged node highlighted
        this.highlightNode(d);
        
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        
        if (this.isDragging) {
          // Reset all circles
          this.nodeSelection.selectAll('circle').each(function() {
            this.style.cursor = 'pointer';

            // Clear inline style
            this.style.fill = '';

            // Force browser to recalculate based on CSS rules
            this.setAttribute('fill', '');
            this.removeAttribute('fill');
          });
        }
        
        // Reset dragging state after a brief delay to avoid DOMException
        setTimeout(() => {
          this.isDragging = false;
        }, 50);
        
        // Reset highlighting after drag on touchscreens
        if ('ontouchstart' in window) {
          setTimeout(() => this.resetHighlight(), 100);
        }
      });
  }

  truncateText(text) {
    const maxLength = InteractiveGraph.CONFIG.MAX_LABEL_LENGTH;
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}

// Initialize graph
document.addEventListener('DOMContentLoaded', () => {
  const graphContainer = document.getElementById('graph-container');
  
  if (graphContainer) {
    const graph = new InteractiveGraph(
      'graph-container', 
      '/assets/js/data/search.json',
      '/assets/js/data/graph-edges.json'
    );
    
    graphContainer.graphInstance = graph;
    
    // Reset highlighting when returning to page (fixes mobile back button issue)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && graph) {
        graph.resetHighlight();
        graph.hideTooltip();
      }
    });
  }
});