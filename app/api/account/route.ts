import { NextResponse } from "next/server"

import { createClient as createAdminClient } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/server"
import { Database } from "@/supabase/database.types"

export async function DELETE() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
      return NextResponse.json(
        { error: "Server not configured: SUPABASE_SERVICE_ROLE_KEY or URL missing" },
        { status: 500 },
      )
    }

    const admin = createAdminClient<Database>(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { error } = await admin.auth.admin.deleteUser(user.id)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
