import {
  CalendarOutlined,
  DashboardOutlined
} from "@ant-design/icons";
import { MenuProps } from "antd";
import Link from "next/link";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const items: MenuProps["items"] = [
  getItem(
    <Link href={"/dashboard"}>Dashboard</Link>,
    "dashboard",
    <DashboardOutlined />
  ),
  getItem(
    <Link href={"/event"}>Events</Link>,
    "event",
    <CalendarOutlined />
  ),
];
