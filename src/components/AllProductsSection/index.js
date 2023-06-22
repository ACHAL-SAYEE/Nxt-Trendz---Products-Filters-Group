import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]
const apiStatusObj = {
  failure: 'FAILURE',
  success: 'SUCCESS',
  loading: 'LOADING',
}
class AllProductsSection extends Component {
  state = {
    productsList: [],
    // isLoading: false,
    activeOptionId: sortbyOptions[0].optionId,
    searchValue: '',
    category: '',
    rating: '',
    apiStatus: 'INITIAL',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusObj.loading,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {activeOptionId, category, searchValue, rating} = this.state
    let apiUrl = null
    // if (category === '' && rating === '') {
    //   apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${searchValue}`
    // } else if (category === '') {
    //   apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${searchValue}&rating=${rating}`
    // } else if (rating === '') {
    //   apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${searchValue}&category=${category}`
    // } else {
    //   apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${searchValue}&rating=${rating}&category=${category}`
    // }
    apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${searchValue}&rating=${rating}&category=${category}`
    console.log(apiUrl)
    // apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&title_search=${searchValue}&rating=${1}&category=${category}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusObj.success,
      })
    }
    if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusObj.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    if (productsList.length === 0) {
      this.renderNoProductsView()
    }
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }
  // , this.searchproducts(event)

  searchproducts = event => {
    console.log(event.target)
    if (event.key === 'Enter') {
      this.getProducts()
    }
  }

  resetFilters = () => {
    this.setState(
      {
        activeOptionId: sortbyOptions[0].optionId,
        searchValue: '',
        category: '',
        rating: '',
      },
      this.getProducts,
    )
  }

  updateSearchVal = event => {
    console.log('search update called')
    this.setState({searchValue: event.target.value})
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  updateCategory = categoryId => {
    this.setState({category: categoryId}, this.getProducts)
  }

  updateRating = ratingId => {
    this.setState({rating: ratingId}, this.getProducts)
  }

  // TODO: Add failure view
  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
      />
      <h1>Oops!Something Went Wrong</h1>
      <p>We are having some trouble processing your request.Please try again</p>
    </div>
  )

  renderNoProductsView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
      />
      <h1>No products Found</h1>
      <p>We could not find any products.Try other filters.</p>
    </div>
  )

  render() {
    const {apiStatus, searchValue} = this.state
    let renderContent = null
    switch (apiStatus) {
      case apiStatusObj.failure:
        renderContent = this.renderFailureView()
        break
      case apiStatusObj.loading:
        renderContent = this.renderLoader()
        break
      case apiStatusObj.success:
        renderContent = this.renderProductsList()
        break
      default:
        return null
    }
    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          getProducts={this.getProducts}
          updateSearchVal={this.updateSearchVal}
          resetFilters={this.resetFilters}
          updateCategory={this.updateCategory}
          updateRating={this.updateRating}
          searchValue={searchValue}
          searchproduct={this.searchproducts}
        />
        {renderContent}
      </div>
    )
  }
}

export default AllProductsSection
