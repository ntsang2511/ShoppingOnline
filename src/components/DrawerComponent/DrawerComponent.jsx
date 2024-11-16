import { Drawer } from 'antd'

function DrawerComponent({ title = 'Drawer', placement = 'right', isOpen = false, children, ...props }) {
  return (
    <>
      <Drawer title={title} placement={placement} open={isOpen} {...props}>
        {children}
      </Drawer>
    </>
  )
}

export default DrawerComponent
