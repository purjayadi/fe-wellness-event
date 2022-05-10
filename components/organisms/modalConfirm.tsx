import { CheckSquareOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Radio, Space } from "antd";
import Button from "antd-button-color";
import Select from "rc-select";
import React from "react";
import { getUserRoleFromJwt } from "utils/config/helper";
import { IBooking } from "utils/interfaces";

const {Option} = Select;

interface ModalProps<TProps> {
    title: TProps;
    data: IBooking;
    mode: string;
    modalVisible: boolean;
    loadingStore: boolean;
    onCancel: () => void;
    handleSubmit: (data: IBooking) => void;
}

export const ModalConfirm = <TProps,> (props:  ModalProps<TProps> ) => {
    const checkMode: boolean = props.mode === "Approve";
    const [form] = Form.useForm();
    
    const handleSubmitData = () => {
        form.validateFields().then(values => {
            const payload = {
                ...values,
                id: props.data.id,
                status: checkMode ? "Approved" : "Rejected"
            };
            props.handleSubmit(payload);
        }).catch(info => {
            console.log("Validate Failed:", info);
        });
    };
    
    return (
        <Modal
            maskClosable={false}
            title={props.mode}
            visible={props.modalVisible}
            onCancel={props.onCancel}
            confirmLoading={props.loadingStore}
            footer={[
                getUserRoleFromJwt() === "Vendor" && <Button
                    key="back"
                    type="danger"
                    onClick={props.onCancel}
                    icon={<CloseCircleOutlined />}
                >
                    Close
                </Button>,
                getUserRoleFromJwt() === "Vendor" && <Button
                    key="submit"
                    type="primary"
                    icon={<CheckSquareOutlined />}
                    onClick={handleSubmitData}
                >
                    Submit
                </Button>
            ]}
        >
            <Form 
                layout="vertical"
                form={form}
            >
                <Form.Item name="id" noStyle>
                    <Input type="hidden" />
                </Form.Item>
                {
                    checkMode && 
                    <Form.Item 
                        label="Select Date" 
                        name="confirmDate" 
                        rules={[{
                                required: true,
                                message: "Please select date"
                            }]}
                        >
                        <Radio.Group>
                            {
                                // @ts-ignore
                                props.data?.proposedDate.map((item: Date, index: number) => (
                                    <Radio key={index} value={item}>
                                        {item}
                                    </Radio>
                                ))
                            }
                        </Radio.Group>
                    </Form.Item>
                }
                {

                    !checkMode && <Form.Item 
                        name="remark" 
                        label="Reason"
                        rules={[{
                            required: true,
                            message: "Please input reason"
                        }]}
                    > 
                        <Input.TextArea placeholder="Insert reason" /> 
                    </Form.Item>
                }
            </Form>
        </Modal>
    );
};