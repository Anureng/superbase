
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rgmfvzpapmjlvnughvwd.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnbWZ2enBhcG1qbHZudWdodndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYzNTcyNzgsImV4cCI6MjAzMTkzMzI3OH0.atw55xIg4NrwP9qQuTQzrnHAQVr-8ZA0ELXSxtzAefs"
export const supabase = createClient(supabaseUrl, supabaseKey)