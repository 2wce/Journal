import React, { useState, useEffect, useRef } from 'react'
import { theme, lightTheme, darkTheme } from 'themes'
import { useAppearanceContext, AppearanceContextInterface } from 'context'
import {
  useFloating,
  FloatingTree,
  FloatingOverlay,
  useInteractions,
  useDismiss,
  useClick,
  FloatingFocusManager,
  useFloatingNodeId,
  FloatingNode,
  FloatingPortal,
} from '@floating-ui/react-dom-interactions'
import {
  AppearanceToolbarWrapperStyled,
  AppearanceToolbarStyled,
  ToggleButtonStyled,
  ToggleGroupStyled,
  ToggleFontAStyled,
  ToggleFontAAStyled,
  ToggleFontAAAStyled,
  ColorSwatchStyled,
  HorizontalDividerStyled,
} from './styled'

interface AppearanceToolbarProps {
  setOpenAppearanceToolbar: React.MutableRefObject<any>
  returnFocus: React.MutableRefObject<HTMLButtonElement>
}

const AppearanceToolbar = ({ setOpenAppearanceToolbar, returnFocus }: AppearanceToolbarProps) => {
  const [open, setOpen] = useState(false)
  const firstRender = useRef(true)
  const initialFocus = useRef<HTMLDivElement>(null)
  const nodeId = useFloatingNodeId()
  const { fontSize, setFontSize, fontFace, setFontFace, colorTheme, setColorTheme } =
    useAppearanceContext()

  const { floating, context, refs } = useFloating({
    open,
    onOpenChange: setOpen,
    nodeId,
  })

  const { getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context, {
      escapeKey: false,
    }),
  ])

  const handleCloseEsc = (e: any) => {
    if (e.key == 'Escape') {
      if (refs.floating.current && refs.floating.current.contains(document.activeElement)) {
        setOpen(false)
      }
    }
  }

  useEffect(() => {
    setOpenAppearanceToolbar.current = setOpen

    document.addEventListener('keydown', handleCloseEsc)
    return () => {
      document.removeEventListener('keydown', handleCloseEsc)
    }
  }, [])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
    } else {
      if (open) {
        setTimeout(() => {
          initialFocus.current.focus()
        }, 100)
      } else {
        setTimeout(() => {
          returnFocus.current.focus()
        }, 100)
      }
    }
  }, [open])

  return (
    <FloatingTree>
      <FloatingNode id={nodeId}>
        <FloatingPortal>
          {open && (
            <FloatingOverlay>
              <FloatingFocusManager context={context}>
                <AppearanceToolbarWrapperStyled ref={floating} {...getFloatingProps()}>
                  <AppearanceToolbarStyled ref={initialFocus}>
                    <ToggleGroupStyled
                      type='single'
                      defaultValue={fontSize}
                      onValueChange={(value) => {
                        setFontSize(value as AppearanceContextInterface['fontSize'])
                      }}
                    >
                      <ToggleFontAStyled value='small' disabled={fontSize == 'small'}>
                        A
                      </ToggleFontAStyled>
                      <ToggleFontAAStyled value='normal' disabled={fontSize == 'normal'}>
                        A
                      </ToggleFontAAStyled>
                      <ToggleFontAAAStyled value='large' disabled={fontSize == 'large'}>
                        A
                      </ToggleFontAAAStyled>
                    </ToggleGroupStyled>
                    <HorizontalDividerStyled />
                    <ToggleGroupStyled
                      type='single'
                      defaultValue={colorTheme}
                      onValueChange={(value) => {
                        setColorTheme(value as AppearanceContextInterface['colorTheme'])
                      }}
                    >
                      <ToggleButtonStyled
                        value='light'
                        padding='8px'
                        disabled={colorTheme == 'light'}
                      >
                        <ColorSwatchStyled
                          fillColor={`rgba(${lightTheme.color.primary.surface},1)`}
                        />
                      </ToggleButtonStyled>
                      <ToggleButtonStyled
                        value='dark'
                        padding='8px'
                        disabled={colorTheme == 'dark'}
                      >
                        <ColorSwatchStyled
                          fillColor={`rgba(${darkTheme.color.primary.surface},1)`}
                        />
                      </ToggleButtonStyled>
                    </ToggleGroupStyled>
                    <HorizontalDividerStyled />
                    <ToggleGroupStyled
                      type='single'
                      defaultValue={fontFace}
                      onValueChange={(value) => {
                        setFontFace(value as AppearanceContextInterface['fontFace'])
                      }}
                    >
                      <ToggleButtonStyled value='inter' disabled={fontFace == 'inter'}>
                        Inter
                      </ToggleButtonStyled>
                      <ToggleButtonStyled
                        value='novela'
                        fontName='Novela'
                        disabled={fontFace == 'novela'}
                      >
                        Novela
                      </ToggleButtonStyled>
                    </ToggleGroupStyled>
                  </AppearanceToolbarStyled>
                </AppearanceToolbarWrapperStyled>
              </FloatingFocusManager>
            </FloatingOverlay>
          )}
        </FloatingPortal>
      </FloatingNode>
    </FloatingTree>
  )
}

export { AppearanceToolbar }
