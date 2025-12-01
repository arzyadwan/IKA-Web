// src/app/login/login-form.tsx
'use client'

import { useActionState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { loginUser } from "@/actions/auth"

export function LoginForm() {
  const [state, action, isPending] = useActionState(loginUser, null)

  return (
    <form action={action} className="space-y-4">
      {state?.message && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {state.message}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm font-medium">Email</label>
        <Input name="email" type="email" placeholder="nama@email.com" required />
        {state?.errors?.email && (
          <p className="text-xs text-red-500">{state.errors.email[0]}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Password</label>
        <Input name="password" type="password" required />
        {state?.errors?.password && (
          <p className="text-xs text-red-500">{state.errors.password[0]}</p>
        )}
      </div>

      <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800" disabled={isPending}>
        {isPending ? "Sedang Masuk..." : "Masuk"}
      </Button>
    </form>
  )
}