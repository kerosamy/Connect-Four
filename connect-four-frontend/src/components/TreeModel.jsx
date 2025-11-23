import TreeVisualizer from "./TreeVisualizer";
export default function TreeModal ({ tree, onClose }){
  if (!tree) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X</button>
        <TreeVisualizer tree={tree} />
      </div>
    </div>
  );
};

