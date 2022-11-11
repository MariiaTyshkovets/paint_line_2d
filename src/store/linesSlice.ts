import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Point = {
    x: number,
    y: number
}

type EndPoint = {
    id: string,
    point: Point
}

export type Line = {
    startX: number,
    startY: number,
    endX: number,
    endY: number
};

export type LineRow = {
    id: string,
    line: Line
};

type LinesState = {
    list: Array<LineRow>;
};

const initialState : LinesState = {
    list: []
};

const linesSlice = createSlice({
    name: "lines",
    initialState,
    reducers: {
        addStartPoint(state, action: PayloadAction<Point>) {
            state.list.push({
                id: new Date().toISOString(),
                line: {
                    startX: action.payload.x,
                    startY: action.payload.y,
                    endX: action.payload.x,
                    endY: action.payload.y
                }
            })
        },
        addEndPoint(state, action: PayloadAction<EndPoint>) {
            const line = state.list.find(line => line.id === action.payload.id);
            if (line) {
                line.line.endX = action.payload.point.x;
                line.line.endY = action.payload.point.y;
            }
        },
        // addLine(state, action: PayloadAction<Line>) {
        //     state.list.push({
        //         id: new Date().toISOString(),
        //         line: {
        //             startX: action.payload.startX,
        //             startY: action.payload.startY,
        //             endX: action.payload.endX,
        //             endY: action.payload.endY
        //         }
        //     })
        // },
        collapseLines(state, action: PayloadAction<boolean>) {
            if (action) {
                state.list = initialState.list;
            }
        }
    }
});

export const { addStartPoint, addEndPoint, collapseLines } = linesSlice.actions;

export default linesSlice.reducer;