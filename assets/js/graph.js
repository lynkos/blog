class InteractiveGraph {
  constructor(containerId, searchDataPath, edgesDataPath) {
    this.container = document.getElementById(containerId);
    this.searchDataPath = searchDataPath;
    this.edgesDataPath = edgesDataPath;
    this.nodes = [];
    this.edges = [];
    this.simulation = null;
    this.svg = null;
    
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
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;
    
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .call(d3.zoom()
        .scaleExtent([0.5, 5])
        .on('zoom', (event) => {
        this.svg.select('.graph-group').attr('transform', event.transform);
      }));
    
    this.graphGroup = this.svg.append('g').attr('class', 'graph-group');
  }

  setupSimulation() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;
    
    this.simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.edges).id(d => d.id).distance(200))
      .force('charge', d3.forceManyBody().strength(-350))
      .force('x', d3.forceX(width / 2))
      .force('y', d3.forceY(height / 2))
      .force('collision', d3.forceCollide().radius(10));
  }

  render() {
    const duration = 300;
    const opacity = 0.3;

    // Render edges
    const link = this.graphGroup.selectAll('.link')
      .data(this.edges)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', 'var(--main-border-color)')
      //.attr('stroke-opacity', 0.75)
      .attr('stroke-width', 2);

    // Render nodes
    const node = this.graphGroup.selectAll('.node')
      .data(this.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(this.drag());

    // Add circles to nodes
    node.append('circle')
      .attr('r', 17);

    // Add labels to nodes
    node.append('text')
      .text(d => this.truncateText(d.label, 10))
      .attr('x', 0)
      .attr('y', 30);

    // Add click handlers
    node.on('click', (event, d) => {
      window.location.href = d.url;
    });

    // Add hover effects
    node.on('mouseover', (event, d) => {      
      // Get connected node IDs
      const connectedNodeIds = new Set([d.id]);
      const connectedEdges = new Set();
      
      this.edges.forEach((edge, index) => {
        if (edge.source.id === d.id || edge.target.id === d.id) {
          connectedNodeIds.add(edge.source.id);
          connectedNodeIds.add(edge.target.id);
          connectedEdges.add(index);
        }
      });
      
      // Dim all nodes except hovered and connected ones
      node.transition()
        .duration(duration)
        .style('opacity', nodeData => 
        connectedNodeIds.has(nodeData.id) ? 1 : opacity
      );
      
      // Dim all edges except connected ones
      link.transition()
        .duration(duration)
        .style('opacity', (edgeData, index) => 
        connectedEdges.has(index) ? 1 : opacity
      );
      
      const tooltip = d3.select('body').append('div')
        .attr('class', 'graph-tooltip')
        .text(d.label);
      
      tooltip.style('left', (event.pageX + 10) + 'px')
             .style('top', (event.pageY - 10) + 'px');
    });

    node.on('mouseout', (event, d) => {
      // Reset all opacities
      node.transition()
        .duration(duration)
        .style('opacity', 1);
      
      link.transition()
        .duration(duration)
        .style('opacity', 1);
      
      d3.selectAll('.graph-tooltip').remove();
    });

    // Update positions on simulation tick
    this.simulation.on('tick', () => {
      link.attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x}, ${d.y})`);
    });
  }

  drag() {
    return d3.drag()
      .on('start', (event, d) => {
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

// Initialize graph when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const graphContainer = document.getElementById('graph-container');
  if (graphContainer) {
    new InteractiveGraph(
      'graph-container', 
      '/assets/js/data/search.json',
      '/assets/js/data/graph-edges.json'
    );
  }
});