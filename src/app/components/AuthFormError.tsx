import { AlertCircle } from "lucide-react";
import { Link } from "react-router";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "./ui/alert";

type AuthFormErrorProps = {
  action?: {
    label: string;
    to: string;
  };
  message: string;
  title?: string;
  traceId?: string;
};

export default function AuthFormError({
  action,
  message,
  title = "Sign-in failed",
  traceId,
}: AuthFormErrorProps) {
  return (
    <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>{message}</p>
        {traceId ? (
          <p className="text-xs text-muted-foreground">Reference: {traceId}</p>
        ) : null}
        {action ? (
          <Link
            to={action.to}
            className="text-sm font-medium text-destructive underline-offset-4 hover:underline"
          >
            {action.label}
          </Link>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}
