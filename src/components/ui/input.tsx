import * as React from "react"
import { cn } from "@/lib/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    };

    const inputType = type === "password" && showPassword ? "text" : type

    return (
      <div className="relative">
        <input
          type={inputType}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {
          type === "password" && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeIcon className="h-4 w-4 text-gray-500 me-1" />
              ) : (
                <EyeOffIcon className="h-4 w-4 text-gray-500 me-1" />
              )}
            </button>
          )
        }
      </div >
    )
  }
)
Input.displayName = "Input"

export { Input }
