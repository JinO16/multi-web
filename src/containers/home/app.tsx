import React from "react"
import Banner from './assets/images/banner.jpg';
import './styles/index.scss'

const App: React.FC = () => {
  return <div>
    <p>Hello, this is App</p>
    <img src={Banner} alt="image-banner" />
  </div>
}

export {
  App
}