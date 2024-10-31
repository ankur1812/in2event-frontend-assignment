import * as React from "react"

import { cn } from "@/lib/utils"

const SearchBar = React.forwardRef<
  HTMLInputElement,
  React.HTMLAttributes<HTMLInputElement>
>(({ className, onChange }) => {

  const [searchString, setSearchString] = React.useState("")
  const ref= React.useRef(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    onChange && onChange(value)
    setSearchString(value)
  };

  const clearSearch = () => {
    onChange && onChange("");
    setSearchString('');
    ref?.current?.focus()
  }
  
  return (
    <div className="relative flex w-full overflow-auto">
      <input
        value={searchString}
        ref={ref}
        onChange={ handleChange }
        className={cn("w-60 px-1 py-1 bg-inherit mb-2focus:outline-none focus:shadow-none", className)} placeholder="Search user by name or email"
      />
      {searchString && <button onClick={clearSearch} className="hover:text-white hover:text-md focus:outline-none focus:shadow-none">Clear Search</button>}
    </div>
  )})
SearchBar.displayName = "SearchBar"

export {
  SearchBar
}
