import * as React from "react"
import { MagnifyingGlassIcon, Cross2Icon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  className?: string;
  currentFilter?: string;
  onChange: (searchStr: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ className, currentFilter, onChange }) => {

  const [searchString, setSearchString] = React.useState("")
  const ref = React.useRef(null)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    onChange(value)
    setSearchString(value)
  };

  const clearSearch = () => {
    onChange("");
    setSearchString('');
    ref?.current?.focus()
  }
  
  return (
    <div className={cn("relative flex items-center gap-2  w-full overflow-auto mb-2", className)}>
      <div className="flex items-center border-b border-white">
        <MagnifyingGlassIcon />
        <input
          value={searchString}
          ref={ref}
          onChange={ handleChange }
          className="w-52 px-2 py-1 bg-inherit  focus:outline-none focus:shadow-none" placeholder="Search by name or email"
        />
      </div>
      {currentFilter && searchString && (
        <button
          onClick={clearSearch}
          className="flex gap-1 items-center bg-white px-2 py-1 text-black hover:bg-inherit hover:text-inherit hover:text-md focus:outline-none focus:shadow-none">
            Clear Search
            <Cross2Icon />
          </button>
        )}
    </div>
  )
}

export {
  SearchBar
}
