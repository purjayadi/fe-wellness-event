import { RootState } from "utils/redux/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../instance";
import { IBooking, IMeta } from "../../interfaces";
import { openNotificationWithIcon } from "../../config/message";
import {
    MSG_DELETE_SUCCESS,
    MSG_STORE_SUCCESS,
    MSG_UPDATE_SUCCESS,
} from "../../types/messages";

// fetch data booking
export const fetchData = createAsyncThunk(
    "booking/fetch",
    async (meta: IMeta, { getState, requestId }) => {
        const response = await api.get("/booking", {
            params: {
                ...meta,
            },
        });
        return response.data;
    }
);

// get booking by ID
export const getBookingById = createAsyncThunk(
    "booking/getById",
    async (id: string) => {
        const response = await api.get(`/booking/${id}`);
        return response.data;
    }
);

// save or update booking
export const saveOrUpdate = createAsyncThunk(
    "booking/save",
    async (data: IBooking, state) => {
        const appState = state.getState() as RootState;
        const { mode } = appState.booking;
        if (mode === "Add") {
            const response = await api.post("/booking", {
                ...data,
            });
            return response.data;
        } else {
            const response = await api.patch(`/booking/${data.id}`, {
                status: data.status,
                confirmDate: data.confirmDate,
                remark: data.remark,
            });
            return response.data;
        }
    }
);

// delete booking
export const deleteData = createAsyncThunk(
    "booking/delete",
    async (id: string) => {
        const response = await api.delete("/booking/" + id);
        return response.data;
    }
);
export interface IPanelBookingSlice {
    items: IBooking[];
    form: IBooking;
    total: number;
    modalVisible: boolean;
    modalVisibleDetail: boolean;
    modalVisibleConfirm: boolean;
    loadingFetch: boolean;
    loadingStore: boolean;
    isRefresh: boolean;
    mode: "Add" | "Approved" | "Reject";
}
export const defaultBooking = { id: "", eventId: undefined, proposedDate: undefined, location: {
    postalCode: "",
    address: "",
} };
const initialState: IPanelBookingSlice = {
    items: [],
    form: defaultBooking,
    total: 0,
    isRefresh: false,
    loadingFetch: true,
    modalVisible: false,
    modalVisibleDetail: false,
    modalVisibleConfirm: false,
    loadingStore: false,
    mode: "Add",
};

const bookingSlice = createSlice({
    name: "Event",
    initialState,
    reducers: {
        setMode: (state, action: PayloadAction<"Add" | "Approved" | "Reject">) => {
            state.mode = action.payload;
        },
        setEvent: (state, action: PayloadAction<IBooking>) => {
            state.form = action.payload;
        },
        handleModal: (state, action: PayloadAction<boolean>) => {
            state.modalVisible = action.payload;
        },
        handleModalDetail: (state, action: PayloadAction<boolean>) => {
            state.modalVisibleDetail = action.payload;
        }, 
        handleModalConfirm: (state, action: PayloadAction<boolean>) => {
            state.modalVisibleConfirm = action.payload;
        }
    },
    extraReducers: (builder) => {
        // START: fetchData
        builder.addCase(fetchData.pending, (state, action) => {
            state.loadingFetch = true;
        });
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.loadingFetch = false;
            state.items = action.payload.data.items;
            state.total = action.payload.data.totalItems;
        });

        builder.addCase(fetchData.rejected, (state, action) => {
            state.loadingFetch = false;
        });
        // END: fetchData

        // START: getBookingById
        builder
        .addCase(getBookingById.pending, (state, action) => {
            state.loadingStore = true;
        })
        .addCase(getBookingById.fulfilled, (state, action) => {
            state.loadingStore = false;
            state.form = action.payload;
        })
        .addCase(getBookingById.rejected, (state, action) => {
            state.loadingStore = false;
        });
        // END: getBookingById

        // START: saveOrUpdate
        builder.addCase(saveOrUpdate.pending, (state) => {
            state.loadingStore = true;
        });

        builder.addCase(saveOrUpdate.fulfilled, (state) => {
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

        builder.addCase(saveOrUpdate.rejected, (state, action) => {
            state.loadingStore = false;
        });
        // END: saveOrUpdate

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

export const { setMode, handleModal, handleModalConfirm, setEvent, handleModalDetail } = bookingSlice.actions;
export default bookingSlice.reducer;
