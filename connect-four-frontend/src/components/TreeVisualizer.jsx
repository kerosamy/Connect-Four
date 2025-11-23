import React, { useMemo } from 'react';
import Tree from 'react-d3-tree';

const transformNode = (node) => {
  if (!node) return null;
  
  const nodeType = node.type || 'decision';
  
  // For chance nodes, show expected value and outcomes
  if (nodeType === 'chance') {
    const outcomeChildren = [];
    if (node.outcomes && Array.isArray(node.outcomes)) {
      for (const outcome of node.outcomes) {
        if (outcome.child) {
          const childNode = transformNode(outcome.child);
          if (childNode) {
            // Add outcome wrapper
            outcomeChildren.push({
              name: `Col ${outcome.column}`,
              attributes: {
                type: `P=${outcome.probability.toFixed(2)}`,
                score: outcome.score,
                nodeType: 'outcome'
              },
              children: [childNode]
            });
          }
        }
      }
    }
    
    return {
      name: `Chance`,
      attributes: {
        type: `Move ${node.move}`,
        score: node.score?.toFixed(2) || '0',
        nodeType: 'chance'
      },
      children: outcomeChildren
    };
  }
  
  // For decision nodes (MAX/MIN)
  const playerType = node.maximizing ? 'MAX' : 'MIN';
  const moveName = node.move !== undefined ? `${node.move}` : 'ROOT';
  
  const children = [];
  if (node.moves && Array.isArray(node.moves)) {
    for (const child of node.moves) {
      const transformed = transformNode(child);
      if (transformed) {
        children.push(transformed);
      }
    }
  }
  
  return {
    name: moveName,
    attributes: {
      type: playerType,
      score: node.score,
      nodeType: node.maximizing ? 'max' : 'min'
    },
    children: children
  };
};

export default function ExpectedTreeVisualizer({ tree }) {
  const data = useMemo(() => {
    console.log('Transforming tree:', tree);
    const transformed = transformNode(tree);
    console.log('Transformed data:', transformed);
    return transformed;
  }, [tree]);

  const renderNode = ({ nodeDatum }) => {
    const nodeType = nodeDatum.attributes?.nodeType;
    
    // Chance node (diamond shape)
    if (nodeType === 'chance') {
      return (
        <g>
          <polygon
            points="0,-25 25,0 0,25 -25,0"
            fill="#fbbf24"
            stroke="none"
          />
          <text fill="#000" textAnchor="middle" y="5" fontSize="9">
            {nodeDatum.attributes.type}
          </text>
          <text fill="#000" textAnchor="middle" y="40" fontSize="10">
            {nodeDatum.attributes.score}
          </text>
        </g>
      );
    }
    
    // Outcome node (small circle with probability)
    if (nodeType === 'outcome') {
      return (
        <g>
          <circle r={15} fill="#e5e7eb" stroke="none" />
          <text fill="#000" textAnchor="middle" y="-3" fontSize="9">
            {nodeDatum.name}
          </text>
          <text fill="#666" textAnchor="middle" y="8" fontSize="8">
            {nodeDatum.attributes.type}
          </text>
        </g>
      );
    }
    
    // MAX node (AI - blue square)
    if (nodeType === 'max') {
      return (
        <g>
          <rect
            x="-22"
            y="-22"
            width="44"
            height="44"
            fill="#3b82f6"
            stroke="none"
            rx="4"
          />
          <text fill="#fff" textAnchor="middle" y="5" fontSize="12">
            {nodeDatum.name}
          </text>
          <text fill="#fff" textAnchor="middle" y="38" fontSize="10">
            {nodeDatum.attributes.score}
          </text>
        </g>
      );
    }
    
    // MIN node (Player - red circle)
    return (
      <g>
        <circle r={22} fill="#ef4444" stroke="none" />
        <text fill="#fff" textAnchor="middle" y="5" fontSize="12">
          {nodeDatum.name}
        </text>
        <text fill="#fff" textAnchor="middle" y="38" fontSize="10">
          {nodeDatum.attributes.score}
        </text>
      </g>
    );
  };

  if (!data) {
    return <div>No tree data available</div>;
  }

  return (
    <div style={{ 
      width: '100%', 
      height: '600px', 
      background: '#f8fafc'
    }}>
      <div style={{ 
        padding: '10px', 
        background: '#fff',
        display: 'flex',
        gap: '20px',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 20, height: 20, background: '#3b82f6' }}></div>
          <span>MAX (AI)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 20, height: 20, background: '#ef4444', borderRadius: '50%' }}></div>
          <span>MIN (Player)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 20, height: 20, background: '#fbbf24', transform: 'rotate(45deg)' }}></div>
          <span>CHANCE (Expected)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 16, height: 16, background: '#e5e7eb', borderRadius: '50%' }}></div>
          <span>Outcome</span>
        </div>
      </div>
      <Tree
        data={data}
        orientation="vertical"
        nodeSize={{ x: 100, y: 90 }}
        translate={{ x: 400, y: 80 }}
        renderCustomNodeElement={renderNode}
        zoom={0.6}
        separation={{ siblings: 1.2, nonSiblings: 1.8 }}
        depthFactor={90}
      />
    </div>
  );
}