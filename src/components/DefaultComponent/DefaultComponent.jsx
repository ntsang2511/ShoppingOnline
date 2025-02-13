import HeaderComponent from '../HeaderComponent/HeaderComponent'
import FooterComponent from '../FooterComponent/FooterComponent'
function DefaultComponent({ children }) {
  return (
    <div>
      <HeaderComponent />
      <div style={{ minHeight: '100vh', paddingBottom: '50px', backgroundColor: '#333' }}> {children}</div>
      <FooterComponent />
    </div>
  )
}

export default DefaultComponent
