import { createFileRoute } from "@tanstack/react-router"
import Profiles from "@/components/Profiles"
  

export const Route = createFileRoute('/user/userprofile')({
  component: RouteComponent,
})

function RouteComponent() {
  return  (
    <>
    <Profiles/>
    </>
      )
    }
    