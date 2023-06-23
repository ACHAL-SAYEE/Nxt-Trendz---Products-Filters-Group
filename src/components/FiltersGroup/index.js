import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    updateSearchVal,
    resetFilters,
    updateCategory,
    updateRating,
    searchValue,
    searchproducts,
    getProducts,
  } = props
  //   const {name, categoryId} = categoryOptions
  //   const {ratingId, imageUrl} = ratingsList
  const onClickresetFilters = () => {
    resetFilters()
  }

  const Onsearchproducts = event => {
    if (event.key === 'Enter') {
      getProducts()
    }
  }

  const onClickupdateCategory = categoryId => {
    updateCategory(categoryId)
  }

  const onClickupdateRating = ratingId => {
    updateRating(ratingId)
  }
  // value={searchValue
  return (
    <div className="filters-group-container">
      <div>
        <input
          type="search"
          onChange={updateSearchVal}
          onKeyDown={Onsearchproducts}
          value={searchValue}
        />
        <img src="" alt="" />
      </div>

      <h1>Category</h1>
      <div>
        {categoryOptions.map(category => (
          <p
            className="category"
            key={category.categoryId}
            onClick={() => onClickupdateCategory(category.categoryId)}
          >
            {category.name}
          </p>
        ))}
      </div>
      <p>Rating</p>
      <ul>
        {ratingsList.map(rating => (
          <li className="rating" key={rating.ratingId}>
            <button
              type="button"
              onClick={() => onClickupdateRating(rating.ratingId)}
            >
              <img
                src={rating.imageUrl}
                className="img"
                alt={`rating ${rating.ratingId}`}
              />

              <p className="rating-heading">& up</p>
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={onClickresetFilters}>
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
