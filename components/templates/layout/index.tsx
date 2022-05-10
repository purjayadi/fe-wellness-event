import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Col, Layout, Menu, Row } from "antd";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "utils/hooks";
import { logOutAction } from "utils/redux/slices/loginSlice";
import {
  IPanelSlice,
  setOpenKeys,
  setSelectedKeys,
} from "./../../../utils/redux/slices/panelSlice";
import { items } from "./menu";

interface IProps {
  children: React.ReactNode;
}

const { Header, Content, Footer, Sider } = Layout;
function AdminLayout({ children }: IProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [collapsed, setCollapsed] = useState(false);  

  const state: IPanelSlice = useSelector((state: any) => state.panel);
  const dispatch = useAppDispatch();

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session]);

  return (
    <Layout hasSider style={{padding: 0}}>
      <Sider
        collapsible
        trigger={null}
        collapsed={collapsed}
        theme="dark"
        breakpoint="lg"
        onBreakpoint={(broken) => {}}
        onCollapse={(collapsed, type) => {}}
        style={{
          overflow: "auto",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Row justify="center" align="middle" style={{minHeight: "8.2vh"}}>
          <Image
            src="/assets/images/logo.svg"
            width={40}
            height={40}
            objectFit="cover"
            alt="logo"
          />
        </Row>
        <Menu
          theme="dark"
          mode="inline"
          onClick={({ key, keyPath }) => {
            dispatch(setSelectedKeys([key]));
            dispatch(setOpenKeys(keyPath));
          }}
          onOpenChange={(openKeys) => {
            dispatch(setOpenKeys(openKeys));
          }}
          selectedKeys={state.selectedKeys}
          openKeys={state.openKeys}
          defaultOpenKeys={state.openKeys}
          defaultSelectedKeys={state.selectedKeys}
          items={items}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{ paddingRight: 2 }}
        >
          <Row>
            <Col span={12}>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                  className: "trigger",
                  onClick: toggle,
              })}
            </Col>
            <Col span={2} offset={10}>
              <Button onClick={() => dispatch(logOutAction())} type="link"><LogoutOutlined /> Logout</Button>
            </Col>
          </Row>
        </Header>
        <Content
          style={{ margin: "24px 16px 0", overflow: "initial",}}
        >
          <div className="site-layout-background" style={{ padding: 24 }}>
          {children}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
