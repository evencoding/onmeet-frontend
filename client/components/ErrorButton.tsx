import { Button } from "./ui/button";

export function ErrorButton() {
  return (
    <Button
      onClick={() => {
        throw new Error("This is your first error!");
      }}
      variant="destructive"
    >
      Break the world
    </Button>
  );
}
