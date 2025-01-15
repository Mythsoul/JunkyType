#!/usr/bin/env node

const { execSync } = require('child_process')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Human-like commit message templates
const templates = {
  fix: [
    'fix {{feature}} bug',
    'resolve {{feature}} issue',
    'patch {{feature}} problem',
    'correct {{feature}} behavior',
    'handle {{feature}} edge case'
  ],
  feat: [
    'add {{feature}}',
    'implement {{feature}}',
    'introduce {{feature}}',
    'build {{feature}}',
    'create {{feature}}'
  ],
  update: [
    'update {{feature}}',
    'improve {{feature}}',
    'enhance {{feature}}',
    'refine {{feature}}',
    'polish {{feature}}'
  ],
  style: [
    'style {{feature}} improvements', 
    'make {{feature}} look better',
    'polish {{feature}} ui',
    'improve {{feature}} design'
  ]
}

function getRandomTemplate(type) {
  const typeTemplates = templates[type] || templates.update
  return typeTemplates[Math.floor(Math.random() * typeTemplates.length)]
}

function generateMessage(type, feature) {
  const template = getRandomTemplate(type)
  return template.replace('{{feature}}', feature || 'functionality')
}

async function getInput(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim())
    })
  })
}

async function main() {
  try {
    console.log('🚀 Quick Commit Tool\n')
    
    // Check git status
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' })
      if (!status.trim()) {
        console.log('✨ No changes to commit!')
        process.exit(0)
      }
      console.log('📝 Changes found:')
      console.log(status)
    } catch (error) {
      console.log('❌ Not in a git repository!')
      process.exit(1)
    }

    // Get commit type
    console.log('\nCommit types:')
    console.log('1. fix - Bug fixes')
    console.log('2. feat - New features') 
    console.log('3. update - Improvements')
    console.log('4. style - UI/styling changes')
    console.log('5. custom - Write your own\n')
    
    const typeChoice = await getInput('Choose commit type (1-5): ')
    
    let commitMessage = ''
    
    if (typeChoice === '5') {
      commitMessage = await getInput('Enter custom commit message: ')
    } else {
      const types = { '1': 'fix', '2': 'feat', '3': 'update', '4': 'style' }
      const type = types[typeChoice] || 'update'
      
      const feature = await getInput('What did you change? (e.g., login, navbar, stats): ')
      commitMessage = generateMessage(type, feature)
    }
    
    if (!commitMessage) {
      console.log('❌ No commit message provided!')
      process.exit(1)
    }
    
    console.log(`\n📝 Commit message: "${commitMessage}"`)
    const confirm = await getInput('Commit these changes? (y/n): ')
    
    if (confirm.toLowerCase() === 'y' || confirm.toLowerCase() === 'yes') {
      execSync('git add .')
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' })
      console.log('✅ Successfully committed!')
      
      const push = await getInput('Push to remote? (y/n): ')
      if (push.toLowerCase() === 'y' || push.toLowerCase() === 'yes') {
        execSync('git push', { stdio: 'inherit' })
        console.log('🚀 Successfully pushed!')
      }
    } else {
      console.log('❌ Commit cancelled')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    rl.close()
  }
}

main()
