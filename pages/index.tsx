import React from "react";
import "antd/dist/antd.css";
import { Form, Input, Button, Card, Row, Col } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "utils/hooks";
import { useRouter } from "next/router";
import { loginAction } from "utils/redux/slices/loginSlice";
import { useSession } from "next-auth/react";
import { RootState } from "utils/redux/store";

const Index = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session, status } = useSession();
  const login =  useAppSelector((state: RootState) => state.login);
  const onFinish = (values: any) => {
    // need fixed
    // @ts-ignore
    dispatch(loginAction(values));
  };

  React.useEffect((): void => {
    if (session) {
      router.push("/dashboard");
    }
  });
  console.log(status);

  return (
    <Row justify="center" align="middle" style={{minHeight: "100vh"}}>
      <Col flex="100px">
        <Card style={{ width: 400 }}>
          <Form
            name="normal_login"
            layout='vertical'
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                {login.isLoading ? "Please wait..." : "Log in"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Index;