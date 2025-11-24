import { Plus, Minus } from "lucide-react";
import '../ConnectFour.css';
export default function DepthCounter({ counter, setCounter , aiInfo }) {
  return (
    <div className="counter-box">
      <div className="counter-label">Depth</div>
      <div className="counter-value">{counter}</div>

      <div className="counter-buttons">
        <button className="counter-btn" onClick={() => setCounter(p => p + 1)}><Plus size={20} /></button>
        <button className="counter-btn" onClick={() => setCounter(p => Math.max(1, p - 1))}><Minus size={20} /></button>
      </div>
          <div className="ai-stats">
            <p>AI move time: {aiInfo.time.toFixed(3)}s</p>
            <p>Nodes evaluated: {aiInfo.count}</p>
          </div>
    </div>
  );
}
