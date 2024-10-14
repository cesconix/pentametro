import { Actions } from "./actions"
import { Logo } from "./logo"

type HeaderProps = {
  sessionActive: boolean
  onNewClick: () => void
}

export const Header = (props: HeaderProps) => (
  <header className="flex bg-background py-2 px-3 justify-between">
    <Logo />

    <Actions
      sessionActive={props.sessionActive}
      onNewClick={props.onNewClick}
    />
  </header>
)
