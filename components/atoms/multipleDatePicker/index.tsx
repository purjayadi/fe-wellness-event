import React, { useState } from "react";
import { Tag, DatePicker, Select } from "antd";
import moment from "moment";
import * as R from "ramda";

function getTimestamp(value: any) {
    return value.startOf("day").valueOf();
}

export default function MultipleDatePicker({
    value: selectedDate = [],
    // @ts-ignore
    onChange,
    format = "YYYY-MM-DD",
    selectProps = {},
    datePickerProps = {}
}) {
    const [open, setOpen] = useState(false);

    const onValueChange = (date: Date) => {
        const t = getTimestamp(date);
        // @ts-ignore
        const index = selectedDate.indexOf(t);
        const clone = R.clone(selectedDate);
        if (index > -1) {
            clone.splice(index, 1);
        } else {
            // @ts-ignore
            clone.push(t);
        }
        onChange && onChange(clone);
    };

    const dateRender = (currentDate: Date) => {
        // @ts-ignore
        const isSelected = selectedDate.indexOf(getTimestamp(currentDate)) > -1;
        return (
            <div
                className={"ant-picker-cell-inner"}
                style={
                    isSelected
                        ? {
                            position: "relative",
                            zIndex: 2,
                            display: "inlineBlock",
                            width: "24px",
                            height: "22px",
                            lineHeight: "22px",
                            backgroundColor: "#1890ff",
                            color: "#fff",
                            margin: "auto",
                            borderRadius: "2px",
                            transition: "background 0.3s, border 0.3s"
                        }
                        : {}
                }
            >
                {/* @ts-ignore */}
                {currentDate.date()}
            </div>
        );
    };

    // @ts-ignore
    const renderTag = ({ value, onClose }) => {
        const handleClose = () => {
            onClose();
            onChange && onChange(selectedDate.filter((t) => t !== value));
        };
        return (
            <Tag onClose={handleClose} closable>
                {moment(value).format(format)}
            </Tag>
        );
    };
    const isMaxValues = selectedDate.length === 3;

    return (
        <Select
            allowClear
            placeholder={"Select Date"}
            {...selectProps}
            mode="multiple"
            value={selectedDate}
            {...(isMaxValues && { disabled: true })}
            onClear={() => onChange && onChange([])}
            tagRender={renderTag}
            open={open}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            dropdownMatchSelectWidth={false}
            dropdownClassName={"multipleDropdownClassName"}
            dropdownStyle={{ height: "270px", width: "280px", minWidth: "0" }}
            dropdownRender={() => {
                return (
                    // @ts-ignore
                    <DatePicker
                        {...datePickerProps}
                        format={(value) => ""}
                        onChange={onValueChange}
                        value={""}
                        showToday={false}
                        open
                        dateRender={dateRender}
                        // @ts-ignore
                        style={{ ...datePickerProps.style, visibility: "hidden" }}
                        getPopupContainer={() =>
                            document.getElementsByClassName("multipleDropdownClassName")[0]
                        }
                    />
                );
            }}
        />
    );
}
