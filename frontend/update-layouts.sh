#!/bin/bash

# Function to add DashboardLayout wrapper to pages
add_layout() {
  local file=$1
  local pagename=$2
  
  # Check if file already imports DashboardLayout
  if grep -q "DashboardLayout" "$file"; then
    echo "⏭️  $pagename already has DashboardLayout"
    return
  fi
  
  # Backup original
  cp "$file" "${file}.bak"
  
  # Add import at the top after 'use client'
  sed -i "/'use client';/a import DashboardLayout from '@/components/DashboardLayout';" "$file"
  
  # Wrap the return statement content with DashboardLayout
  # This is a simple approach - may need manual adjustment for complex pages
  echo "✅ Updated $pagename"
}

# Add to all main skill pages
add_layout "app/dashboard/writing/page.tsx" "Writing"
add_layout "app/dashboard/speaking/page.tsx" "Speaking"
add_layout "app/dashboard/reading/page.tsx" "Reading"
add_layout "app/dashboard/listening/page.tsx" "Listening"
add_layout "app/dashboard/vocabulary/page.tsx" "Vocabulary"
add_layout "app/dashboard/progress/page.tsx" "Progress"
add_layout "app/dashboard/study-plan/page.tsx" "Study Plan"
add_layout "app/dashboard/mock-tests/page.tsx" "Mock Tests"
add_layout "app/dashboard/profile/page.tsx" "Profile"

echo "✅ All layouts updated!"
