import {Button} from "@nextui-org/react";

type Color = "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined

export default function LoadingButton({ className='', color, isLoading }: { className:string, color: Color, isLoading: boolean }) {
  return (
    <Button color={color} isLoading={isLoading} className={className}>
      Loading
    </Button>
  );
}
