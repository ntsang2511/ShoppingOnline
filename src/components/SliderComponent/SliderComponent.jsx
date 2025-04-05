import { Image } from 'antd'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { WrapperSliderStyle } from './style'

function SliderComponent({ arrImages }) {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000
  }
  return (
    <WrapperSliderStyle {...settings}>
      {arrImages.map((image, index) => {
        return <Image src={image} alt="slider" key={index} preview={false} width="100%" height="100%" />
      })}
    </WrapperSliderStyle>
  )
}

export default SliderComponent
