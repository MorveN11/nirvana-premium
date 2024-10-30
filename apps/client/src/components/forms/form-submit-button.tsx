"use client";

import { useFormStatus } from "react-dom";
import LoadingButton from "@/components/forms/loading-button";

export default function FormSubmitButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { pending } = useFormStatus();

  return <LoadingButton {...props} type="submit" loading={pending} />;
}