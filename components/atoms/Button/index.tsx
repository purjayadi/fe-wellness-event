import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Popconfirm, Space } from "antd";
import React from "react";
import { MSG_CONFIRM_DELETE } from "utils/types";
import Button from "antd-button-color";
import { getUserRoleFromJwt } from "utils/config/helper";

interface Props {
  handleEdit: () => void;
  handleDelete: () => void;
}

// @ts-ignore
const RenderButtonAction: React.FC<Props> = ({ handleDelete, handleEdit }) => {
  return (
    getUserRoleFromJwt() === "Vendor" && (
    <Space>
      <Button type="info" size="small" onClick={handleEdit}>
        <FormOutlined /> Edit
      </Button>
      <Popconfirm
        title={MSG_CONFIRM_DELETE}
        onConfirm={handleDelete}
        okText="Yes"
        cancelText="No"
      >
        <Button type="danger" size="small">
          <DeleteOutlined />
          Delete
        </Button>
      </Popconfirm>
    </Space>)
  );
};

export default RenderButtonAction;
