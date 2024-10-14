import { BuyMeACoffee } from "./buymeacoffee"
import { Credits } from "./credits"
import { Overview } from "./overview"

export const Welcome = () => (
  <div className="flex h-full flex-col justify-center p-12 bg-primary bg-square-pattern bg-[length:200px]">
    <Overview />
    <BuyMeACoffee />
    <Credits />
  </div>
)
