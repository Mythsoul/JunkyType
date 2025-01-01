#!/bin/bash

# Backup current branch
git branch backup-original

# Get all commit hashes in reverse order (oldest first)
commits=($(git log --reverse --format="%H"))

# Starting date: January 1, 2025
start_date="2025-01-01"

# Create new branch for rewritten history
git checkout --orphan new-main

# Remove all files from staging
git rm -rf .

# Counter for days
day_counter=0

# Array of realistic commit times (hours in 24h format)
times=("09:15" "10:30" "14:20" "16:45" "19:30" "21:15")

# Commit messages mapping (in chronological order)
declare -A commit_messages=(
    [0]="🎉 Initial project setup and basic structure"
    [1]="📝 Add basic typing test functionality"
    [2]="🎨 Setup routing and basic UI components"
    [3]="⚙️ Configure Redux store and state management"
    [4]="🔧 Fix theme toggle and UI improvements"
    [5]="📱 Responsive design updates and UX enhancements"
    [6]="🐛 Fix deployment issues and case sensitivity"
    [7]="🚀 Remove backend dependencies and optimize"
    [8]="📊 Add user info and statistics tracking"
    [9]="🎨 Major UI/UX overhaul and design improvements"
    [10]="🧹 Clean up unnecessary files and optimize"
    [11]="🔧 Fix Tailwind configuration and styling"
    [12]="🔐 Implement authentication system"
    [13]="📧 Configure email system and fix auth issues"
    [14]="🔄 Update project dependencies and configs"
    [15]="🐛 Fix TypeScript type issues"
    [16]="📧 Fix email configuration and validation"
    [17]="⚙️ Add comprehensive typing customization options"
    [18]="🎛️ Enhance settings with advanced customization"
    [19]="🏆 Build epic leaderboard with podium rankings"
    [20]="✨ Make typing experience super smooth with animations"
    [21]="📊 Enhance user profile with real-time statistics"
    [22]="🔧 Fix statistics calculation algorithms"
    [23]="📱 Add PWA support and production features"
    [24]="⚡ Optimize typing experience with stable text rendering"
    [25]="🎯 Fix time/word selection button visibility"
    [26]="📊 Improve UI layout and result dialog accuracy"
    [27]="🚀 Major improvements: AI analysis, bug fixes, and UX enhancements"
)

echo "Rewriting git history with realistic dates..."

for i in "${!commits[@]}"; do
    commit_hash="${commits[$i]}"
    
    # Calculate date (1-2 commits per day)
    if [ $((i % 2)) -eq 0 ]; then
        # First commit of the day
        current_date=$(date -d "$start_date + $day_counter days" +%Y-%m-%d)
        time_index=$((RANDOM % 3))  # Morning times (0,1,2)
    else
        # Second commit of the day
        current_date=$(date -d "$start_date + $day_counter days" +%Y-%m-%d)
        time_index=$((3 + RANDOM % 3))  # Afternoon/evening times (3,4,5)
        ((day_counter++))
    fi
    
    commit_time="${times[$time_index]}"
    full_date="${current_date}T${commit_time}:00"
    
    # Get the commit content
    git checkout $commit_hash -- .
    
    # Get original commit message or use our mapping
    if [ -n "${commit_messages[$i]}" ]; then
        message="${commit_messages[$i]}"
    else
        message=$(git log --format=%B -n 1 $commit_hash)
    fi
    
    # Add and commit with the new date
    git add .
    
    # Set both author and committer dates
    GIT_AUTHOR_DATE="$full_date" GIT_COMMITTER_DATE="$full_date" \
    git commit -m "$message"
    
    echo "✅ Commit $((i+1))/${#commits[@]}: $current_date $commit_time - $message"
done

echo ""
echo "🎉 Git history rewritten successfully!"
echo "📅 Commits spread from January 1, 2025 to $(date -d "$start_date + $day_counter days" +%Y-%m-%d)"
echo "📊 Total commits: ${#commits[@]}"
echo ""
echo "To apply changes:"
echo "  git branch -D main"
echo "  git branch -m new-main main"
echo ""
echo "To restore original (if needed):"
echo "  git checkout backup-original"
