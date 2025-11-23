import { Plus, Minus } from "lucide-react";
import '../ConnectFour.css';
export default function DepthCounter({ counter, setCounter }) {
  return (
    <div className="counter-box">
      <div className="counter-label">Depth</div>
      <div className="counter-value">{counter}</div>

      <div className="counter-buttons">
        <button className="counter-btn" onClick={() => setCounter(p => p + 1)}><Plus size={20} /></button>
        <button className="counter-btn" onClick={() => setCounter(p => Math.max(1, p - 1))}><Minus size={20} /></button>
      </div>
    </div>
  );
}
