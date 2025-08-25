#!/bin/bash

# Fix all Grid item patterns to Grid size patterns for MUI v7

# Navigate to the correct directory
cd /Users/denizcanilgin/Documents/Ecom-SuperTool/materio-mui-nextjs-admin-template-free/javascript-version

# Find all JSX files and apply transformations
find src -name "*.jsx" -type f | while read file; do
    echo "Processing: $file"
    
    # Remove 'item' prop and convert breakpoint props to size prop
    sed -i '' 's/<Grid item xs={\([^}]*\)} sm={\([^}]*\)} md={\([^}]*\)} lg={\([^}]*\)}/<Grid size={{ xs: \1, sm: \2, md: \3, lg: \4 }}/g' "$file"
    sed -i '' 's/<Grid item xs={\([^}]*\)} sm={\([^}]*\)} md={\([^}]*\)}/<Grid size={{ xs: \1, sm: \2, md: \3 }}/g' "$file"
    sed -i '' 's/<Grid item xs={\([^}]*\)} md={\([^}]*\)} lg={\([^}]*\)}/<Grid size={{ xs: \1, md: \2, lg: \3 }}/g' "$file"
    sed -i '' 's/<Grid item xs={\([^}]*\)} sm={\([^}]*\)}/<Grid size={{ xs: \1, sm: \2 }}/g' "$file"
    sed -i '' 's/<Grid item xs={\([^}]*\)} md={\([^}]*\)}/<Grid size={{ xs: \1, md: \2 }}/g' "$file"
    sed -i '' 's/<Grid item xs={\([^}]*\)} lg={\([^}]*\)}/<Grid size={{ xs: \1, lg: \2 }}/g' "$file"
    sed -i '' 's/<Grid item xs={\([^}]*\)}/<Grid size={\1}/g' "$file"
    
    # Handle patterns with className and other attributes
    sed -i '' 's/<Grid item xs={\([^}]*\)} sm={\([^}]*\)} md={\([^}]*\)} lg={\([^}]*\)} className/<Grid size={{ xs: \1, sm: \2, md: \3, lg: \4 }} className/g' "$file"
    sed -i '' 's/<Grid item xs={\([^}]*\)} sm={\([^}]*\)} md={\([^}]*\)} className/<Grid size={{ xs: \1, sm: \2, md: \3 }} className/g' "$file"
    sed -i '' 's/<Grid item xs={\([^}]*\)} md={\([^}]*\)} lg={\([^}]*\)} className/<Grid size={{ xs: \1, md: \2, lg: \3 }} className/g' "$file"
    sed -i '' 's/<Grid item xs={\([^}]*\)} sm={\([^}]*\)} className/<Grid size={{ xs: \1, sm: \2 }} className/g' "$file"
    sed -i '' 's/<Grid item xs={\([^}]*\)} md={\([^}]*\)} className/<Grid size={{ xs: \1, md: \2 }} className/g' "$file"
    sed -i '' 's/<Grid item xs={\([^}]*\)} lg={\([^}]*\)} className/<Grid size={{ xs: \1, lg: \2 }} className/g' "$file"
    sed -i '' 's/<Grid item xs={\([^}]*\)} className/<Grid size={\1} className/g' "$file"
    
    # Handle patterns with key attribute
    sed -i '' 's/<Grid item xs={\([^}]*\)} md={\([^}]*\)} key/<Grid size={{ xs: \1, md: \2 }} key/g' "$file"
    sed -i '' 's/<Grid item xs={\([^}]*\)} key/<Grid size={\1} key/g' "$file"
    
done

echo "All Grid item patterns have been converted to Grid size patterns!"
