import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../instance";
import { IEvent, IMeta } from "../../interfaces";
import { openNotificationWithIcon } from "../../config/message";
import {
    MSG_DELETE_SUCCESS,
    MSG_STORE_SUCCESS,
    MSG_UPDATE_SUCCESS,
} from "../../types/messages";
import { RootState } from "../store";

export const fetchDataEvent = createAsyncThunk(
    "event/fetch",
    async (meta: IMeta, { getState, requestId }) => {
        const response = await api.get("/event", {
            params: {
                ...meta,
            },
        });
        return response.data;
    }
);

export const getAllEvent = createAsyncThunk(
    "event/getAll",
    async () => {
        const response = await api.get("/event");
        return response.data;
    }
);

export const saveOrUpdateEvent = createAsyncThunk(
    "event/save",
    async (data: IEvent, state)  => {
        const appState = state.getState() as RootState;
        const { mode } = appState.event;        
        if (mode === "Add") {
            const response = await api.post("/event", {
                ...data,
            });
            return response.data;
        }
        if (mode === "Update") {
            const response = await api.patch(`/event/${data.id}`, {
                eventName: data.eventName,
            });
            return response.data;
        }
    }
);

export const deleteData = createAsyncThunk(
    "event/delete",
    async (id: string) => {
        const response = await api.delete("/event/" + id);
        return response.data;
    }
);
export interface IPanelEventSlice {
    items: IEvent[];
    form: IEvent;
    total: number;
    modalVisible: boolean;
    loadingFetch: boolean;
    loadingStore: boolean;
    isRefresh: boolean;
    mode: "Add" | "Update" | "Delete";
}
export const defaultEvent = { id: "", eventName: "" };
const initialState: IPanelEventSlice = {
    items: [],
    form: defaultEvent,
    total: 0,
    isRefresh: false,
    loadingFetch: true,
    modalVisible: false,
    loadingStore: false,
    mode: "Add",
};

const eventSlice = createSlice({
    name: "Event",
    initialState,
    reducers: {
        setMode: (state, action: PayloadAction<"Add" | "Update" | "Delete">) => {
            state.mode = action.payload;
        },
        setEvent: (state, action: PayloadAction<IEvent>) => {
            state.form = action.payload;
        },
        handleModal: (state, action: PayloadAction<boolean>) => {
            state.modalVisible = action.payload;
        },
    },
    extraReducers: (builder) => {
        // START: fetchData
        builder.addCase(fetchDataEvent.pending, (state, action) => {
            state.loadingFetch = true;
        });
        builder.addCase(fetchDataEvent.fulfilled, (state, action) => {
            state.loadingFetch = false;
            state.items = action.payload.data.items;
            state.total = action.payload.data.totalItems;
        });

        builder.addCase(fetchDataEvent.rejected, (state, action) => {
            state.loadingFetch = false;
        });
        // END: fetchData

        // START: getAllEvent
        builder.addCase(getAllEvent.pending, (state, action) => {
            state.loadingFetch = true;
        });
        builder.addCase(getAllEvent.fulfilled, (state, action) => {
            state.loadingFetch = false;
            state.items = action.payload.data.items;
        });

        builder.addCase(getAllEvent.rejected, (state, action) => {
            state.loadingFetch = false;
        });
        // END: getAllEvent

        // START: saveOrUpdateEvent
        builder.addCase(saveOrUpdateEvent.pending, (state) => {
            state.loadingStore = true;
        });

        builder.addCase(saveOrUpdateEvent.fulfilled, (state) => {
            state.loadingStore = false;
            state.modalVisible = false;
            state.mode === "Add"
                ? openNotificationWithIcon({
                    type: "success",
                    message: MSG_STORE_SUCCESS,
                })
                : openNotificationWithIcon({
                    type: "success",
                    message: MSG_UPDATE_SUCCESS,
                });
            state.isRefresh = !state.isRefresh;
        });

        builder.addCase(saveOrUpdateEvent.rejected, (state, action) => {
            state.loadingStore = false;
        });
        // END: saveOrUpdateEvent

        // START: deleteData
        builder.addCase(deleteData.pending, (state) => {
            state.loadingStore = true;
        });
        builder.addCase(deleteData.fulfilled, (state) => {
            state.loadingStore = false;
            state.isRefresh = !state.isRefresh;
            openNotificationWithIcon({
                type: "success",
                message: MSG_DELETE_SUCCESS,
            });
        });
        builder.addCase(deleteData.rejected, (state, action) => {
            state.loadingStore = false;
        });
        // END: deleteData
    },
});

export const { setMode, handleModal, setEvent } = eventSlice.actions;
export default eventSlice.reducer;
