import HeaderComponent from '../HeaderComponent/HeaderComponent'
import FooterComponent from '../FooterComponent/FooterComponent'
import { Container, Content } from './style'
function DefaultComponent({ children }) {
  return (
    <Container>
      <HeaderComponent />
      <Content> {children}</Content>
      <FooterComponent />
    </Container>
  )
}

export default DefaultComponent
