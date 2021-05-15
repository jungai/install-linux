#!/usr/bin/env zx

// path
const homeDir = await os.homedir()
const ZSH_CUSTOM = `${homeDir}/.oh-my-zsh/custom`
const removeDir = [`${ZSH_CUSTOM}/plugins`]

function echoStart(msg) {
    console.log(chalk.yellow(`🚀 -> install ${msg}`))
}

function echoNote(msg = "") {
    console.log(chalk.yellow(`📌 ${msg}`))
}

function echoEnd(msg) {
    console.log(chalk.yellow(`🍭 done ${msg}`))
}


async function beforeAll() {
    echoNote('before all')
    await $`sudo apt update`
    await $`sudo apt upgrade`
    
    echoNote('clean')
    await Promise.all(removeDir.map(dir => $`rm -rf ${dir}`))
    
}

// TODO: Asdf
async function setupAsdf(name) {}

// TODO: Docker
async function setupDocker(name) {}


async function setupLinuxBrew(name) {
    echoStart(name)

    await $`git clone https://github.com/Homebrew/brew ~/.linuxbrew/Homebrew`
    await $`mkdir ~/.linuxbrew/bin`
    await $`ln -s ~/.linuxbrew/Homebrew/bin/brew ~/.linuxbrew/bin`
    await $`eval $(~/.linuxbrew/bin/brew shellenv)`

    echoEnd(name)
}

async function setupZsh(name) {
    echoStart(name)
    await $`sudo apt install -y zsh`
    await $`zsh --version`

    echoStart('Oh My Zsh')
    await $`sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`

    echoStart('Zsh Syntax')
    await $`git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM}/plugins/zsh-syntax-highlighting`

    echoStart('Zsh AutoSuggestion')
    await $`git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM}/plugins/zsh-autosuggestions`

    echoNote('set default shell')
    await $`chsh -s $(which zsh)`

    echoEnd(name)
}


try {
    await beforeAll()
    await setupZsh('Zsh')
    await setupLinuxBrew('Linux Brew')
    await setupAsdf('Asdf')
    await setupDocker('Docker')

} catch (error) {
    console.log(`Exit code: ${error.exitCode}`)
    console.log(`Error: ${error.stderr}`)
}