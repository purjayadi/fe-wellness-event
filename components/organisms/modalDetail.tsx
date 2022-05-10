import { CheckSquareOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Descriptions, Modal, Select, Tag } from "antd";
import Button from "antd-button-color";
import React from "react";
import { getUserRoleFromJwt } from "utils/config/helper";
import { IBooking } from "utils/interfaces";

const { Option } = Select;

interface ModalProps<TProps> {
    title: TProps;
    data: IBooking;
    modalVisible: boolean;
    loadingStore: boolean;
    onCancel: () => void;
    onReject: () => void;
    onApprove: () => void;
}

export const ModalDetail = <TProps,> (props:  ModalProps<TProps> ) => {
    
    const tags = () => {
        let date= [];
        for (let index = 0; index < props.data.proposedDate.length; index++) {
            date.push(<Tag key={index} color="#108ee9">{props.data.proposedDate[index]}</Tag>);
        }
        return(date);
    };

    return (
        <Modal
            width={1000}
            maskClosable={false}
            title={props.title}
            visible={props.modalVisible}
            onCancel={props.onCancel}
            confirmLoading={props.loadingStore}
            footer={[
                getUserRoleFromJwt() === "Vendor" && <Button
                    key="back"
                    type="danger"
                    onClick={props.onReject}
                    icon={<CloseCircleOutlined />}
                >
                    Reject
                </Button>,
                getUserRoleFromJwt() === "Vendor" && <Button
                    key="submit"
                    type="primary"
                    icon={<CheckSquareOutlined />}
                    onClick={props.onApprove}
                >
                    Approved
                </Button>
            ]}
        >
            {
                props.data && 
                <Descriptions 
                    bordered
                    size="small"
                    column={2}
                >
                    {/* @ts-ignore */}
                    <Descriptions.Item label="Event Name">{ props.data.event.eventName }</Descriptions.Item>
                    {/* @ts-ignore */}
                    <Descriptions.Item label="Vendor">{ props.data.event.vendor.name }</Descriptions.Item>
                    <Descriptions.Item label="Status">{ props.data.status }</Descriptions.Item>
                    <Descriptions.Item label="Postal Code">{ props.data.location.postalCode }</Descriptions.Item>
                    <Descriptions.Item label="Address">
                    { props.data.location.address }
                    </Descriptions.Item>
                    <Descriptions.Item label="Human Resource">
                        {/* @ts-ignore */}
                    { props.data.hr.name }
                    </Descriptions.Item>
                    <Descriptions.Item label="Proposed Date">
                    { 
                        tags()
                    }
                    </Descriptions.Item>
                    <Descriptions.Item label="Confirm Date">
                        { props.data.status === "Approved" ? props.data.confirmDate : "-" }
                    </Descriptions.Item>
                    <Descriptions.Item label="Remark">
                        { props.data.remark }
                    </Descriptions.Item>
                </Descriptions>
            }
        </Modal>
    );
};