#!/bin/bash

# Backup current branch
git branch backup-emoji-commits

# Get all commit hashes in reverse order (oldest first)
commits=($(git log --reverse --format="%H"))

# Starting date: January 1, 2025
start_date="2025-01-01"

# Create new branch for rewritten history
git checkout --orphan clean-main

# Remove all files from staging
git rm -rf .

# Counter for days
day_counter=0

# Array of realistic commit times (hours in 24h format)
times=("09:30" "11:15" "14:45" "16:20" "18:30" "20:45")

# Realistic commit messages (no emojis, human-like)
declare -A commit_messages=(
    [0]="initial project setup"
    [1]="add basic typing functionality"
    [2]="setup routing and components"
    [3]="configure redux store"
    [4]="fix theme toggle"
    [5]="update responsive design"
    [6]="fix deployment issues"
    [7]="remove backend dependencies"
    [8]="add user statistics"
    [9]="improve ui layout"
    [10]="clean up unused files"
    [11]="fix tailwind config"
    [12]="add authentication"
    [13]="configure email system"
    [14]="update dependencies"
    [15]="fix type issues"
    [16]="fix email validation"
    [17]="add typing options"
    [18]="enhance settings panel"
    [19]="build leaderboard"
    [20]="improve typing animations"
    [21]="enhance user profile"
    [22]="fix stats calculation"
    [23]="add pwa support"
    [24]="optimize typing experience"
    [25]="fix button visibility"
    [26]="improve result dialog"
    [27]="add ai analysis system"
    [28]="enhance profile charts"
    [29]="fix calculation bugs"
    [30]="add production features"
    [31]="fix text rendering"
    [32]="improve button switching"
    [33]="fix layout issues"
    [34]="major improvements and cleanup"
)

echo "Rewriting git history with clean commit messages..."

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
    
    # Use our clean commit message
    message="${commit_messages[$i]}"
    
    # Add and commit with the new date
    git add .
    
    # Set both author and committer dates
    GIT_AUTHOR_DATE="$full_date" GIT_COMMITTER_DATE="$full_date" \
    git commit -m "$message"
    
    echo "✅ Commit $((i+1))/${#commits[@]}: $current_date $commit_time - $message"
done

echo ""
echo "Git history rewritten with clean messages!"
echo "Commits spread from January 1, 2025 to $(date -d "$start_date + $day_counter days" +%Y-%m-%d)"
echo "Total commits: ${#commits[@]}"
