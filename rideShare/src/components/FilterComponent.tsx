type FilterProps = {
  searchText: string
  filterBy: string
  setSearchText: (text: string) => void
  setFilterBy: (filter: string) => void
}

const filterOptions = [
  'All',
  'make',
  'model',
  'color',
  'Plate Number',
  'Capacity',
  'Year',
  'type',
]

function FilterComponent({
  searchText,
  filterBy,
  setSearchText,
  setFilterBy,
}: FilterProps) {
  return (
    <div className="w-4/5 m-auto">
      <div>
        <input
          type="search"
          placeholder="Search the car"
          className="w-full border p-2 rounded"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="w-full flex flex-row gap-3 border bg-amber-50 text-center p-2">
        {filterOptions.map((option) => (
          <button
            key={option}
            className={`btn btn-primary outline-red-700 cursor-pointer border px-3 ${
              filterBy.toLowerCase() === option.toLowerCase() ? 'btn-ghost' : ''
            }`}
            onClick={() => setFilterBy(option.toLowerCase())}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FilterComponent
