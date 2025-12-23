import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, onLoadingStatusChange, src, ...props }, ref) => {
  const [isLoading, setIsLoading] = React.useState(Boolean(src))

  React.useEffect(() => {
    setIsLoading(Boolean(src))
  }, [src])

  const handleLoadingStatusChange = React.useCallback(
    (status: "idle" | "loading" | "loaded" | "error") => {
      setIsLoading(status !== "loaded" && status !== "error")

      onLoadingStatusChange?.(status)
    },
    [onLoadingStatusChange]
  )

  return (
    <>
      {isLoading ? (
        <Skeleton className="absolute inset-0 h-full w-full rounded-full" />
      ) : null}

      <AvatarPrimitive.Image
        ref={ref}
        src={src}
        className={cn(
          "aspect-square h-full w-full",
          className,
          isLoading && "opacity-0"
        )}
        onLoadingStatusChange={handleLoadingStatusChange}
        {...props}
      />
    </>
  )
})
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
