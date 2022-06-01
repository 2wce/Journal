import React, { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import { Icon } from 'components'
import { theme, lightTheme, darkTheme } from 'themes'
import { useAppearanceContext, AppearanceContextInterface } from 'context'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Toolbar from '@radix-ui/react-toolbar'
import * as Dialog from '@radix-ui/react-dialog'
import { isDev } from 'utils'
import { useUserContext } from 'context'

const showDropdown = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }`

const reveal = keyframes`
  0% {
    margin-bottom: -24px;
    opacity: 0;
  }
  100% {
    margin-bottom: 0px;
    opacity: 1;
  }
  }
`

interface MenuProps {
  posX?: string
  posY?: string
  pos?: string
}

const AppearanceToolbarWrapper = styled(Dialog.Content)`
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 9999;
`

const DialogTrigger = styled(Dialog.Trigger)`
  background-color: transparent;
  color: inherit;
  padding: 0;
  outline: none;
  border: 0;
  &:focus,
  &:hover {
    outline: none;
  }
`

const AppearanceToolbar = styled(Toolbar.Root)`
  padding: 12px;
  border-radius: 100px;
  gap: 8px;
  display: flex;
  box-shadow: ${theme('style.shadow')};
  background-color: ${theme('color.popper.surface')};
  transition: ${theme('animation.time.normal')};
  animation-name: ${reveal};
  animation-duration: ${theme('animation.time.normal')};
  animation-timing-function: ${theme('animation.timingFunction.dynamic')};
  animation-fill-mode: both;
  -webkit-app-region: no-drag;
`
const ToggleGroup = styled(Toolbar.ToggleGroup)`
  gap: 8px;
  display: flex;
`

interface ToggleButtonProps {
  padding?: string
  fontName?: string
}

const ToggleButton = styled(({ padding, fontName, ...props }) => (
  <Toolbar.ToggleItem {...props} />
))<ToggleButtonProps>`
  height: 48px;
  font-size: 14px;
  line-height: 14px;
  min-width: 48px;
  padding: ${(props) => (props.padding ? props.padding : '16px')};
  font-family: ${(props) => (props.fontName ? props.fontName : 'inherit')};
  border-radius: 100px;
  cursor: pointer;
  border: 1px solid ${theme('color.popper.border')};
  background-color: ${theme('color.popper.surface')};
  color: ${theme('color.popper.disabled')};
  transition: ${theme('animation.time.normal')};
  &:disabled {
    cursor: initial;
  }
  &:focus {
    outline: 0;
  }
  &:hover {
    border: 1px solid ${theme('color.popper.disabled')};
  }
  &[data-state='on'] {
    opacity: 1;
    border: 1px solid ${theme('color.popper.main')};
    border: 1px solid ${theme('color.popper.main')};
    color: ${theme('color.popper.main')};
  }
`

const ToggleFontA = styled(ToggleButton)`
  font-size: 13px;
`

const ToggleFontAA = styled(ToggleButton)`
  font-size: 16px;
`

const ToggleFontAAA = styled(ToggleButton)`
  font-size: 22px;
`
interface ColorSwatchProps {
  fillColor: string
}

const ColorSwatch = styled.div<ColorSwatchProps>`
  height: 31px;
  width: 31px;
  border-radius: 100px;
  background-color: ${(props) => props.fillColor};
`

const HorizontalDivider = styled(Toolbar.Separator)`
  background-color: ${theme('color.popper.border')};
  width: 1px;
  margin: 4px 8px;
`

const Dropdown = styled(DropdownMenu.Content)<MenuProps>`
  position: ${(props) => (props.pos ? props.pos : 'absolute')};
  top: ${(props) => (props.posY ? props.posY : '')};
  left: ${(props) => (props.posX ? props.posX : '')};
  padding: 4px;
  border-radius: 12px;
  box-shadow: ${theme('style.shadow')};
  background-color: ${theme('color.popper.surface')};
  animation-name: ${showDropdown};
  animation-duration: ${theme('animation.time.normal')};
  -webkit-app-region: no-drag;
`

const Item = styled(DropdownMenu.Item)`
  display: flex;
  border: 0;
  gap: 16px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  background-color: ${theme('color.popper.surface')};
  align-items: center;
  transition: ${theme('animation.time.normal')};
  &:focus,
  &:hover {
    border: 0;
    outline: none;
    background-color: ${theme('color.popper.hover')};
  }
`

const ItemTitle = styled.span`
  flex-grow: 1;
  font-size: 14px;
  line-height: 20px;
  text-align: left;
  padding-right: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 160px;
  overflow: hidden;
  & em {
    opacity: 0.6;
    font-style: normal;
  }
`

interface MenuButtonProps {
  open: boolean
}

const MenuButton = styled(DropdownMenu.Trigger)<MenuButtonProps>`
  position: fixed;
  top: 8px;
  right: 8px;
  width: 40px;
  height: 24px;
  border-radius: 100px;
  border: 0;
  padding: 4px;
  z-index: 9999;
  box-shadow: ${theme('style.shadow')};
  transition: ${theme('animation.time.normal')};
  background-color: ${(props) =>
    props.open ? theme('color.secondary.main') : theme('color.secondary.surface')};
  & * {
    fill: ${(props) =>
      props.open ? theme('color.secondary.surface') : theme('color.secondary.main')};
  }
  &:focus,
  &:hover {
    outline: none;
    border: 0;
    background-color: ${theme('color.secondary.hover')};
    & * {
      transition: ${theme('animation.time.normal')};
    }
  }
`

const Divider = styled(DropdownMenu.Separator)`
  background-color: ${theme('color.popper.border')};
  height: 1px;
  margin: 4px 12px;
`

const Menu = () => {
  const [open, setOpen] = useState(false)
  const { fontSize, setFontSize, fontFace, setFontFace, colorTheme, setColorTheme } =
    useAppearanceContext()
  const { session, signOut } = useUserContext()

  return (
    <Dialog.Root>
      <DropdownMenu.Root onOpenChange={(open) => setOpen(open)}>
        <MenuButton open={open}>
          <Icon name='Menu' />
        </MenuButton>
        <Dropdown side='left' sideOffset={-40} align='end' alignOffset={30}>
          <DialogTrigger>
            <Item>
              <Icon name='Bucket' />
              <ItemTitle>Appearance</ItemTitle>
            </Item>
          </DialogTrigger>
          <Divider />
          <Item onSelect={() => signOut()}>
            <Icon name='Exit' />
            <ItemTitle>
              Logout <em>{session.user.email}</em>
            </ItemTitle>
          </Item>
          {isDev() && (
            <Item>
              <ItemTitle>Development</ItemTitle>
            </Item>
          )}
        </Dropdown>
      </DropdownMenu.Root>
      <Dialog.Portal>
        <AppearanceToolbarWrapper>
          <AppearanceToolbar>
            <ToggleGroup
              type='single'
              defaultValue={fontSize}
              onValueChange={(value) => {
                setFontSize(value as AppearanceContextInterface['fontSize'])
              }}
            >
              <ToggleFontA value='small' disabled={fontSize == 'small'}>
                A
              </ToggleFontA>
              <ToggleFontAA value='normal' disabled={fontSize == 'normal'}>
                A
              </ToggleFontAA>
              <ToggleFontAAA value='large' disabled={fontSize == 'large'}>
                A
              </ToggleFontAAA>
            </ToggleGroup>
            <HorizontalDivider />
            <ToggleGroup
              type='single'
              defaultValue={colorTheme}
              onValueChange={(value) => {
                setColorTheme(value as AppearanceContextInterface['colorTheme'])
              }}
            >
              <ToggleButton value='light' padding='8px' disabled={colorTheme == 'light'}>
                <ColorSwatch fillColor={lightTheme.color.primary.surface} />
              </ToggleButton>
              <ToggleButton value='dark' padding='8px' disabled={colorTheme == 'dark'}>
                <ColorSwatch fillColor={darkTheme.color.primary.surface} />
              </ToggleButton>
            </ToggleGroup>
            <HorizontalDivider />
            <ToggleGroup
              type='single'
              defaultValue={fontFace}
              onValueChange={(value) => {
                setFontFace(value as AppearanceContextInterface['fontFace'])
              }}
            >
              <ToggleButton value='inter' disabled={fontFace == 'inter'}>
                Inter
              </ToggleButton>
              <ToggleButton value='novela' fontName='Novela' disabled={fontFace == 'novela'}>
                Novela
              </ToggleButton>
            </ToggleGroup>
          </AppearanceToolbar>
        </AppearanceToolbarWrapper>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { Menu }
