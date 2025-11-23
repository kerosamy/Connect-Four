import { RotateCcw } from "lucide-react";
import '../ConnectFour.css';
export default function ResetButton({ onReset }) {
  return (
    <div className="reset-button-cont">
        <button className="reset-button" onClick={onReset}>
            <RotateCcw size={20} /> Reset
        </button>

    </div>
   
  );
}
