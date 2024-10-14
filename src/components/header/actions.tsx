import { BookTextIcon, GithubIcon, PlusIcon } from "lucide-react"
import { Button, buttonVariants } from "../ui/button"
import { Separator } from "../ui/separator"

type ActionsProps = {
  sessionActive: boolean
  onNewClick: () => void
}

export const Actions = (props: ActionsProps) => (
  <div className="flex items-center gap-1">
    <a
      className={buttonVariants({ variant: "secondary", size: "sm" })}
      href="https://guidopenta.github.io/galactic-CV-guide"
      target="_blank"
      rel="noreferrer"
    >
      <BookTextIcon className="w-5 h-5 mr-1 hidden sm:block" />
      <span>Guida</span>
    </a>

    <a
      className={buttonVariants({ variant: "secondary", size: "sm" })}
      href="https://github.com/cesconix/pentametro"
      target="_blank"
      rel="noreferrer"
    >
      <GithubIcon className="w-5 h-5 mr-1 hidden sm:block" />
      <span>GitHub</span>
    </a>

    <Separator orientation="vertical" className="h-5 mx-1" />

    <Button
      variant={"default"}
      size={"sm"}
      disabled={props.sessionActive === false}
      onClick={props.onNewClick}
    >
      <PlusIcon className="w-5 h-5" />
      <span className="hidden lg:block">Nuovo</span>
    </Button>
  </div>
)
