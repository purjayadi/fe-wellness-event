import { CloseCircleOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Card, Form, Input, Modal, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { NextPage } from "next";
import React from "react";
import { AdminLayout } from "../../components/templates";
import { useAppDispatch, useAppSelector } from "../../utils/hooks";
import { IEvent } from "../../utils/interfaces";
import {
    defaultEvent,
    deleteData,
    fetchDataEvent,
    handleModal,
    IPanelEventSlice,
    saveOrUpdateEvent,
    setMode,
} from "../../utils/redux/slices/eventSlice";
import { AppDispatch, RootState } from "../../utils/redux/store";
import Button from "antd-button-color";
import { RenderButtonAction } from "components/atoms";
import { useSession } from "next-auth/react";
import { getUserRoleFromJwt } from "utils/config/helper";

const Event: NextPage = () => {
    const [page, setPage] = React.useState<number>(1);
    const [limit, setLimit] = React.useState<number>(5);
    const { data: session } = useSession();
    const [form] = Form.useForm();
    const dispatch: AppDispatch = useAppDispatch();

    const state: IPanelEventSlice = useAppSelector(
        (state: RootState) => state.event
    );
    

    React.useEffect(() => {
        dispatch(fetchDataEvent({ page, limit }));
    }, [dispatch, page, session, limit, state.isRefresh]);

    const handleEdit = (data: IEvent) => {
        dispatch(setMode("Update"));
        form.setFieldsValue({
            ...data
        });
        dispatch(handleModal(true));
    };

    const handleCreate = () => {
        dispatch(setMode("Add"));
        form.setFieldsValue({
            ...defaultEvent
        });
        dispatch(handleModal(true));
    };

    const handleDelete = (id: string) => {
        dispatch(deleteData(id));
    };
    
    const handleSubmit = () => {
        form.validateFields().then((values) => {
            dispatch(saveOrUpdateEvent(values));
        });
    };

    const columns: ColumnsType<IEvent> = [
        {
            title: "#",
            dataIndex: "no",
            key: "no",
            render: (text: any, record: IEvent, index: number) => {
                return index + 1 + (page - 1) * limit;
            },
        },
        {
            title: "Event Name",
            dataIndex: "eventName",
            key: "eventName",
        },
        {
            title: "Action",
            key: "action",
            render: (text: any, record: IEvent) => (
                <RenderButtonAction
                    handleEdit={() => handleEdit(record)}
                    handleDelete={() => handleDelete(record.id!)}
                />
            ),
        },
    ];

    return (
        <AdminLayout>
            <Card
                title="Events"
                extra={
                    getUserRoleFromJwt() === "Vendor" && 
                    <Button type="primary" onClick={handleCreate}>
                        <PlusOutlined /> Add
                    </Button>
                }
            >
                <Table
                    size="small"
                    showHeader={true}
                    loading={state.loadingFetch}
                    columns={columns}
                    rowKey={(record: IEvent) => record.id!}
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

            {/* Modal event */}
            <Modal
                maskClosable={false}
                title={state.mode === "Add" ? "Add Event" : "Edit Event"}
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
                    initialValues={{
                        remember: true,
                    }}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item name="id" noStyle>
                        <Input type="hidden" />
                    </Form.Item>
                    <Form.Item
                        label="Event Name"
                        name="eventName"
                        rules={[{ required: true, message: "Silahkan pilih group!!!" }]}
                    >
                        <Input placeholder="Insert event name" />
                    </Form.Item>
                </Form>
            </Modal>
            {/* end modal event */}
        </AdminLayout>
    );
};

export default Event;
