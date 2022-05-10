import { CloseCircleOutlined, PlusOutlined, SaveOutlined, SelectOutlined } from "@ant-design/icons";
import { Card, Form, Input, InputNumber, Modal, Select, Table, Tag } from "antd";
import { ColumnsType } from "antd/lib/table";
import { NextPage } from "next";
import React from "react";
import { useDispatch } from "react-redux";
import { AdminLayout } from "../../components/templates";
import { useAppSelector } from "../../utils/hooks";
import { IBooking, IEvent } from "../../utils/interfaces";
import {
    defaultBooking,
    fetchData,
    getBookingById,
    handleModal,
    handleModalConfirm,
    handleModalDetail,
    saveOrUpdate,
    setMode,
} from "./../../utils/redux/slices/bookingSlice";
import { AppDispatch, RootState } from "../../utils/redux/store";
import Button from "antd-button-color";
import { getAllEvent } from "utils/redux/slices/eventSlice";
import MultipleDatePicker from "components/atoms/multipleDatePicker";
import { getUserRoleFromJwt } from "utils/config/helper";
import { ModalDetail } from "components/organisms/modalDetail";
import { ModalConfirm } from "components/organisms/modalConfirm";

const Booking: NextPage = () => {
    const [page, setPage] = React.useState<number>(1);
    const [limit, setLimit] = React.useState<number>(5);
    const [form] = Form.useForm();

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const data: IBooking = {
                eventId: values.eventId,
                proposedDate: values.proposedDate,
                location: {
                    postalCode: values.postalCode,
                    address: values.address,
                }
            };
            dispatch(saveOrUpdate(data));
        });
    };

    const { state, event } = useAppSelector(
        (state: RootState) => ({
            state: state.booking,
            event: state.event,
        })
    );

    const dispatch: AppDispatch = useDispatch();

    React.useEffect(() => {
        dispatch(fetchData({ page, limit }));
        dispatch(getAllEvent());
    }, [dispatch, page, limit, state.isRefresh]);

    const handleCreate = () => {
        dispatch(setMode("Add"));
        form.setFieldsValue({
            ...defaultBooking
        });
        dispatch(handleModal(true));
    };

    const handleViewEvent = (id: string) => {
        dispatch(getBookingById(id)).then(() => {
            dispatch(handleModalDetail(true));
        });
    };

    const handleActionModal = (action: any) => {        
        dispatch(setMode(action));
        dispatch(handleModalConfirm(true));
    };

    const handleConfirmEvent = (data: IBooking) => {
        console.log(data);
        dispatch(saveOrUpdate(data));
    };

    const columns: ColumnsType<IBooking> = [
        {
            title: "#",
            dataIndex: "no",
            key: "no",
            render: (text: any, record: IBooking, index: number) => {
                return index + 1 + (page - 1) * limit;
            },
        },
        {
            title: "Event Name",
            dataIndex: "event",
            key: "event",
            render: (event) => {
                return event.eventName;
            }
        },
        {
            title: "Vendor Name",
            dataIndex: "event",
            key: "event",
            render: (event) => {
                return event.vendor.name;
            }
        },
        {
            title: "Confirmed Date",
            key: "confirmDate",
            render: (confirmDate, record) => {
                let date = [];
                if (record.confirmDate) {
                    return <Tag color="#108ee9">{record.confirmDate}</Tag>;
                }
                for (let index = 0; index < record.proposedDate.length; index++) {
                    date.push(<Tag key={index} color="#108ee9">{record.proposedDate[index]}</Tag>);
                }
                return date;
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                return status;
            }
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt) => {
                return createdAt;
            }
        },
        {
            title: "Action",
            key: "action",
            render: (text: any, record: IBooking) => (
                <Button type="info" size="small" onClick={() => handleViewEvent(record.id!)}><SelectOutlined />View</Button>
            ),
        },
    ];

    return (
        <AdminLayout>
            <Card
                title="Bookings"
                extra={
                    getUserRoleFromJwt() === "HR" && <Button type="primary" onClick={handleCreate}>
                        <PlusOutlined /> Add
                    </Button>
                }
            >
                <Table
                    size="small"
                    showHeader={true}
                    loading={state.loadingFetch}
                    columns={columns}
                    rowKey={(record: IBooking) => record.id!}
                    dataSource={state.items}
                    pagination={{
                        defaultPageSize: limit,
                        total: state.total,
                        showSizeChanger: true,
                        pageSizeOptions: ["5", "10", "20", "30", "40", "50"],
                        size: "default",
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} items`,
                        onChange: (page: number, limit: number) => {
                            setPage(page);
                            setLimit(limit);
                        },
                    }}
                />
            </Card>

            {/* Modal booking event */}
            <Modal
                maskClosable={false}
                title={state.mode === "Add" ? "Add Booking" : "Edit Booking"}
                visible={state.modalVisible}
                onCancel={() => dispatch(handleModal(false))}
                confirmLoading={state.loadingStore}
                footer={[
                    <Button
                        key="back"
                        type="danger"
                        onClick={() => dispatch(handleModal(false))}
                        icon={<CloseCircleOutlined />}
                    >
                        Close
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={() => handleSubmit()}
                    >
                        {state.mode === "Add" ? "Save" : "Update"}
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        label="Events"
                        name="eventId"
                        rules={[
                            {
                                required: true,
                                message: "Please select event",
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a event"
                        >
                            {
                                event.items.map((item: IEvent) => (
                                    <Select.Option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.eventName}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="proposedDate"
                        label="Proposed Dates"
                        rules={[
                            {
                                required: true,
                                message: "Please select proposed date",
                            }
                        ]}
                    >
                        <MultipleDatePicker onChange={undefined} />
                    </Form.Item>
                    <Form.Item
                        name="postalCode"
                        label="Postal Code"
                        rules={[
                            {
                                required: true,
                                message: "Please input postal code",
                            }
                        ]}
                    >
                        <InputNumber style={{ width: "100%" }} placeholder="Postal code" />
                    </Form.Item>
                    <Form.Item
                        name="address"
                        label="Address"
                        rules={[
                            {
                                required: true,
                                message: "Please input address",
                            }
                        ]}
                    >
                        <Input.TextArea rows={4} placeholder="Insert event address" />
                    </Form.Item>
                </Form>
            </Modal>
            {/* End modal booking event */}

            {/* Modal confirm booking */}
            <ModalDetail
                title='Booking Event Detail'
                modalVisible={state.modalVisibleDetail}
                onCancel={() => dispatch(handleModalDetail(false))}
                onReject={() => handleActionModal("Reject")}
                onApprove={() => handleActionModal("Approve")}
                loadingStore={state.loadingStore}
                // @ts-ignore
                data={state.form?.data}
            />
            {/* End modal confirm */}

            {/* Modal reject */}
            <ModalConfirm
                title='Modal Confirm Event'
                modalVisible={state.modalVisibleConfirm}
                mode={state.mode}
                onCancel={() => dispatch(handleModalConfirm(false))}
                loadingStore={state.loadingStore}
                handleSubmit={handleConfirmEvent}
                // @ts-ignore
                data={state.form?.data}
            />
            {/* End modal reject */}

        </AdminLayout>
    );
};

export default Booking;
