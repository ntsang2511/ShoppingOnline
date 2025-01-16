import HeaderComponent from '../HeaderComponent/HeaderComponent'
import FooterComponent from '../FooterComponent/FooterComponent'
function DefaultComponent({ children }) {
  return (
    <div>
      <HeaderComponent />
      {children}
      <FooterComponent />
    </div>
  )
}

export default DefaultComponent
