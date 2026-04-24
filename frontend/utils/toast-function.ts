import axios from "axios";
import { toast } from "sonner";

type ToastType = "success" | "error" | "warning";

export const ToastFunction = (
  type: ToastType,
  message: string | unknown
) => {
    let finalMessage = "";

    console.log("Message: ",message);

    if (type === "error") {
        if (axios.isAxiosError(message)) {
        finalMessage =
            message.response?.data?.error?.[0]?.message ||
            message.response?.data?.message ||
            message.message ||
            "Something went wrong";
        } else if (typeof message === "string") {
        finalMessage = message;
        } else {
        finalMessage = "Something went wrong";
        }
    } else {
        finalMessage =
        typeof message === "string" ? message : "Action completed";
    }

    switch (type) {
        case "success":
        toast.success(finalMessage);
        break;
        case "warning":
        toast.warning(finalMessage);
        break;
        case "error":
        toast.error(finalMessage);
        break;
    }
};