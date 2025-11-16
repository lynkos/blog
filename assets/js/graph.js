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
      .call(d3.zoom().on('zoom', (event) => {
        this.svg.select('.graph-group').attr('transform', event.transform);
      }));
    
    this.graphGroup = this.svg.append('g').attr('class', 'graph-group');
  }

  setupSimulation() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;
    
    this.simulation = d3.forceSimulation(this.nodes)
      .force('link', d3.forceLink(this.edges).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));
  }

  render() {
    // Render edges
    const link = this.graphGroup.selectAll('.link')
      .data(this.edges)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.8)
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
      .attr('r', 20)
      .attr('fill', 'var(--link-color)')
      .style('cursor', 'pointer');

    // Add labels to nodes
    node.append('text')
      .text(d => this.truncateText(d.label, 15))
      .attr('x', 0)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .attr('font-size', '20px')
      .attr('fill', 'var(--text-color)')
      .style('pointer-events', 'none');

    // Add click handlers
    node.on('click', (event, d) => {
      window.location.href = d.url;
    });

    // Add hover effects
    node.on('mouseover', function(event, d) {
      d3.select(this).select('circle')
        .attr('r', 25)
        .attr('fill', 'var(--link-hover-color)');
      
      const tooltip = d3.select('body').append('div')
        .attr('class', 'graph-tooltip')
        .style('position', 'absolute')
        .style('background', 'var(--card-bg)')
        .style('color', 'var(--heading-color)')
        .style('padding', '8px')
        .style('border-radius', '4px')
        .style('border', '1px solid var(--bs-card-border-color)')
        .style('box-shadow', 'var(--card-shadow)')
        .style('font-size', '12px')
        .style('pointer-events', 'none')
        .style('z-index', '1000')
        .text(d.label);
      
      tooltip.style('left', (event.pageX + 10) + 'px')
             .style('top', (event.pageY - 10) + 'px');
    });

    node.on('mouseout', function(event, d) {
      d3.select(this).select('circle')
        .attr('r', 20)
        .attr('fill', 'var(--link-color)');
      
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