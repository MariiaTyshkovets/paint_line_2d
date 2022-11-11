import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addEndPoint, addStartPoint, Line } from "../../store/linesSlice";

export function useOnDraw( onDraw: Function, onDrawPoint: Function ) {

    const dispatch = useAppDispatch();
    const lines = useAppSelector(state => state.lines.list);

    const refNull: any = null;

    const canvasRef = useRef(refNull);
    const startPointRef = useRef(refNull);
    const endPointRef = useRef(refNull);
    const isDrawingRef = useRef(false);

    const mouseMoveListenerRef = useRef(refNull);
    const mouseDownListenerRef = useRef(refNull);
    const mouseUpListenerRef = useRef(refNull);
    
    useEffect(() => {

        const context = canvasRef.current.getContext("2d");
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.beginPath();
        lines.forEach((line, index) => {
            onDraw(context, line.line.endX, line.line.endY, line.line.startX, line.line.startY);
            if (index > 0 && index < lines.length) {
                for (let i = 0; i < lines.length - 1; i++) {
                    checkPointOfIntersection(context, lines[i].line, line.line )
                }
            }
        });

        function initMouseMoveListener() {
            const mouseMoveListener = (event: any) => {
                const point = computePointInCanvas(event.clientX, event.clientY);
                if (isDrawingRef.current) {
                    if (point) {
                        dispatch(addEndPoint({
                            id: lines[lines.length-1].id, 
                            point: point
                        }))
                    }
                }
            };
            mouseMoveListenerRef.current = mouseMoveListener;
            window.addEventListener("mousemove", mouseMoveListener);
        }
        
        function initMouseUpListener() {
            if (!canvasRef.current) return;
            const mouseUpListener = (event: any) => {
                endPointRef.current = computePointInCanvas(event.clientX, event.clientY);
                if (isDrawingRef.current) {
                    if (endPointRef.current) {
                        dispatch(addEndPoint({
                            id: lines[lines.length-1].id, 
                            point: endPointRef.current
                        }))
                    }
                }
                isDrawingRef.current = false;
            }
            mouseUpListenerRef.current = mouseUpListener;
            window.addEventListener("mouseup", mouseUpListener);
        }

        function removeListeners() {
            if (mouseMoveListenerRef.current) {
                window.removeEventListener("mousemove", mouseMoveListenerRef.current)
            };
            if (mouseUpListenerRef.current) {
                window.removeEventListener("mouseup", mouseUpListenerRef.current)
            }
        }

        function checkPointOfIntersection (context: any, line1: Line, line2: Line) {
            let x1 = line1.startX;
            let y1 = line1.startY;
            let x2 = line1.endX;
            let y2 = line1.endY;
            let x3 = line2.startX;
            let y3 = line2.startY;
            let x4 = line2.endX;
            let y4 = line2.endY;
            let k1: number, k2: number;

            if (x1 >= x2) {
                x1 = line1.endX;
                y1 = line1.endY;
                x2 = line1.startX;
                y2 = line1.startY;
            }

            if (x3 >= x4) {
                x3 = line2.endX;
                y3 = line2.endY;
                x4 = line2.startX;
                y4 = line2.startY;
            }

            if (y2 === y1) {
                k1 = 0;
            } else {
                k1 = ( y2 - y1 ) / ( x2 - x1 ); 
            }

            if (y4 === y3) {
                k2 = 0;
            } else {
                k2 = ( y4 - y3 ) / ( x4 - x3 ); 
            }

            if (k1 === k2) {
                return;
            }

            let b1: number = y1 - k1 * x1;
            let b2: number = y3 - k2 * x3;
            let x: number = ( b2 - b1 ) / ( k1 - k2 );
            let y: number = k1 * x + b1;

            if (x < x1 || x > x2 || (x < x3 && x < x4) || (x > x3 && x > x4)) {
                return;
            } else if ((x > x1 && x > x2) || (x < x1 && x < x2) || (y < y1 && y < y2) || (y > y1 && y > y2)) {
                return;
            } else {
                onDrawPoint(context, x, y );
            }
        }   

        initMouseMoveListener();
        initMouseUpListener();

        return () => {
            // Clean up everything!
            removeListeners();
        }
    }, [onDraw, lines, dispatch, onDrawPoint])

    function setCanvasRef(ref: any) {
        if (!ref) return;
        if (canvasRef.current) {
            canvasRef.current.removeEventListener("mousedown", mouseDownListenerRef.current);
        }
        canvasRef.current = ref;
        initMouseDownListener();  
    }

    function initMouseDownListener() {
        if (!canvasRef.current) return;
        const mouseDownListener = (event: any) => {
            isDrawingRef.current = true;
            startPointRef.current = computePointInCanvas(event.clientX, event.clientY);
            dispatch(addStartPoint(startPointRef.current));
        }
        mouseDownListenerRef.current = mouseDownListener;
        canvasRef.current.addEventListener("mousedown", mouseDownListener);
    }

    function computePointInCanvas(clientX: number, clientY: number) {
        if (canvasRef.current) {
            const boundingRect = canvasRef.current.getBoundingClientRect();
            return {
                x: Math.round(clientX - boundingRect.left),
                y: Math.round(clientY - boundingRect.top)
            };
        } else {
            return null;
        }
    }
    return setCanvasRef;
}