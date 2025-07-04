import React from 'react';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/')({
  component: RouteComponent,
})

function RouteComponent() {
  return(
    <div>
    hello user
    </div>
  )
}
