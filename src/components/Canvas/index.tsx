import { useOnDraw } from "../Hooks";

interface CanvasProps {
    width: number,
    height: number
}

const Canvas: React.FC<CanvasProps> = ({width, height}) => {

    const setCanvasRef = useOnDraw(onDraw, onDrawPoint);
    
    const BLACK: string = "#000000";
    const RED: string = "#BB0404";

    function onDrawPoint(context: any, pointX: number, pointY: number) : any {
        context.fillStyle = RED;
        context.moveTo(pointX, pointY); 
        context.arc(pointX, pointY, 5, 0, 2 * Math.PI, true);
        context.fill();
        context.strokeWidth = 0.5;
        context.stroke();
    }

    function onDraw(context: any, pointX: number, pointY: number, startPointX: number, startPointY: number) : any {
        drawLine(
            {x: pointX, y: pointY}, 
            {x: startPointX, y: startPointY}, 
            context, 
            BLACK,
            1
        )
    }

    function drawLine(
        start: any, 
        end: any, 
        context: any, 
        color: string,
        width: number
    ) {
        context.beginPath();
        context.strokeStyle = color;
        context.strokeWidth = width;
        context.lineWidth = width;
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.fill();
        context.stroke();
    }

    return <canvas
        width={width}
        height={height}
        style={canvasStyle}
        ref={setCanvasRef}
    />
}

export default Canvas;

const canvasStyle = {
    border: "2px solid red"
}