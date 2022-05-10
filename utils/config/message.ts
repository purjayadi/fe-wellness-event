import { message, notification } from "antd";
interface IMessage {
  content: string | React.ReactNode;
  className?: string;
  type?: "success" | "error" | "info" | "warning" | "warn" | "loading";
  duration?: number;
}

const style = {
  marginTop: "20vh",
};
export const customMessage = ({
  content,
  type,
  className,
  duration,
}: IMessage) => {
  switch (type) {
    case "success":
      message.success({
        content: content ?? "message",
        className: className,
        duration: duration ?? 2,
        style: {
          ...style,
        },
      });
      break;
    case "error":
      message.error({
        content: content ?? "message",
        className: className,
        duration: duration ?? 2,
        style: {
          ...style,
        },
      });
      break;
    case "info":
      message.info({
        content: content ?? "message",
        className: className,
        duration: duration ?? 2,
        style: {
          ...style,
        },
      });
      break;

    case "warning":
      message.warning({
        content: content ?? "message",
        className: className,
        duration: duration ?? 2,
        style: {
          ...style,
        },
      });
      break;
    case "warn":
      message.warn({
        content: content ?? "message",
        className: className,
        duration: duration ?? 2,
        style: {
          ...style,
        },
      });
      break;
    case "loading":
      message.loading({
        content: content ?? "message",
        className: className,
        duration: duration ?? 2,
        style: {
          ...style,
        },
      });
      break;
    default:
      message.info({
        content: content ?? "message",
        className: className,
        duration: duration ?? 2,
        style: {
          ...style,
        },
      });
      break;
  }
};

interface INotification {
  type: "success" | "info" | "warning" | "error";
  message?: string | undefined | React.ReactNode;
  description?: string | undefined | React.ReactNode;
}

// custom notification antd

export const openNotificationWithIcon = (props: INotification) => {
  notification[props.type]({
    message: props.message ?? "Notification",
    description: props.description,
    duration: 5,
    placement: "top",
    // style: {
    //   marginTop: "20vh",
    // },
  });
};
