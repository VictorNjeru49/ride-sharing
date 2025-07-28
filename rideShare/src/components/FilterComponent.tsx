import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface FilterComponentProps {
  searchText: string
  filterBy: string
  setSearchText: (value: string) => void
  setFilterBy: (value: string) => void
}

export default function FilterComponent({
  searchText,
  filterBy,
  setSearchText,
  setFilterBy,
}: FilterComponentProps) {
  // Reset both filters
  const clearFilters = () => {
    setSearchText('')
    setFilterBy('all')
  }

  return (
    <div className="flex w-full flex-col gap-4 px-6 py-4 md:flex-row md:items-end md:gap-6">
      {/* Search */}
      <div className="flex-1">
        <Input
          placeholder="Search vehicles…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Field selector */}
      <div className="w-full md:w-52">
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger>
            <SelectValue placeholder="Filter field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="make">Make</SelectItem>
            <SelectItem value="model">Model</SelectItem>
            <SelectItem value="color">Color</SelectItem>
            <SelectItem value="plate number">Plate No.</SelectItem>
            <SelectItem value="capacity">Capacity</SelectItem>
            <SelectItem value="year">Year</SelectItem>
            <SelectItem value="type">Type</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear */}
      {(searchText || filterBy !== 'all') && (
        <Button variant="ghost" onClick={clearFilters} className="md:ml-auto">
          Clear
        </Button>
      )}
    </div>
  )
}
