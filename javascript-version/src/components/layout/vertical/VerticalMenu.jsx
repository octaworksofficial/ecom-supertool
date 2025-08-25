// MUI Imports
import Chip from '@mui/material/Chip'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const { isBreakpointReached, transitionDuration } = useVerticalNav()
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      <Menu
        menuItemStyles={menuItemStyles(theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-line' /> }}
        menuSectionStyles={menuSectionStyles(theme)}
      >
        <SubMenu
          label='🏠 Ana Sayfa'
          icon={<i className='ri-home-smile-line' />}
        >
          <MenuItem href='/'>Analytics</MenuItem>
        </SubMenu>
        
        <MenuSection label='MÜŞTERİ ARAÇLARI' />
        
        <MenuItem 
          href='/musteri-yonetimi' 
          icon={<i className='ri-user-3-line' />}
        >
          👥 Müşteri Yönetimi
        </MenuItem>
        
        <MenuItem 
          href='/gmaps-musteri-bul' 
          icon={<i className='ri-map-2-line' />}
        >
          📍 Google Maps Müşteri Bul
        </MenuItem>

        <MenuItem 
          href='/website-musterileri' 
          icon={<i className='ri-global-line' />}
        >
          🙍🏻‍♂️ Web Site Müşterileri
        </MenuItem>

        <MenuSection label='E-POSTA ARAÇLARI' />

        <MenuItem 
          href='/toplu-eposta' 
          icon={<i className='ri-global-line' />}
        >
          ✉️ Toplu E-posta
        </MenuItem>

          <MenuItem 
          href='/email-analytics' 
          icon={<i className='ri-global-line' />}
        >
          📊 E-posta İstatistikleri
        </MenuItem>

        <MenuSection label='E-TİCARET ARAÇLARI' />

         <MenuItem 
          href='/trendyol-soru-cevaplama' 
          icon={<i className='ri-global-line' />}
        >
          ⁉️ Trendyol Soru Cevaplama
        </MenuItem>
        


        <MenuSection label='DİĞER' />
        
        <MenuItem
          href={`${process.env.NEXT_PUBLIC_PRO_URL}/apps/email`}
          icon={<i className='ri-mail-open-line' />}
          suffix={<Chip label='Pro' size='small' color='primary' variant='tonal' />}
          target='_blank'
        >
          Email
        </MenuItem>
        
        <MenuItem
          href={`${process.env.NEXT_PUBLIC_PRO_URL}/apps/chat`}
          icon={<i className='ri-message-3-line' />}
          suffix={<Chip label='Pro' size='small' color='primary' variant='tonal' />}
          target='_blank'
        >
          Chat
        </MenuItem>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu
