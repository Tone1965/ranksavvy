// Test Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Key exists:', !!supabaseKey)

const supabase = createClient(supabaseUrl, supabaseKey)

// Test the connection
async function testConnection() {
  try {
    const { data, error } = await supabase.from('projects').select('count').limit(1)
    if (error) {
      console.error('Supabase error:', error.message)
    } else {
      console.log('✅ Supabase connection successful!')
      console.log('Data:', data)
    }
  } catch (err) {
    console.error('Connection failed:', err.message)
  }
}

testConnection()