import React from 'react'
import Hook from '../Hook/Hook'
import Trend from '../Trending/Trend'
import Deals from '../Deals/Deals'
import NewProducts from '../NewProducts/NewProducts'
import Notice from '../Notice/Notice'

const MainPage = () => {
  return ( 
    <div>
      <Hook />
      <Trend />
      <Deals />
      <NewProducts />
      <Notice />
    </div>

  )
}

export default MainPage