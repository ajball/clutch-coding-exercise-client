# Clutch Stock Watcher (Front-End)

An Ember Octane client that consumes the Scala/Play2 stock watcher backend service

## Prerequisites & Assumptions

- You are working on MacOS
- You have [homebrew](https://brew.sh/) installed
- You have node installed (`brew install node`)
	- The app was able to run on node `v8.15.0` and `v12.14.1`. I haven't tried other versions
	- In case you run into node or npm related errors, I'd recommend using [node version manager](https://github.com/nvm-sh/nvm) to quickly switch between node versions on your machine
- You have ember installed (`npm install -g ember-cli`)
	- Output when I run `ember --version` ==> `ember-cli: 3.15.2`

### Steps to boot up the Ember app
Start the [backend stock watcher service](https://github.com/ajball/clutch-coding-exercise/blob/master/README.md) first then...

1. Clone this repo locally
	- `git clone https://github.com/ajball/clutch-coding-exercise-client.git`
2. Navigate to the project root dir
	-  `cd clutch-coding-exercise-client`
3. Download all project dependencies
	- `npm i`
4. Start the app
	- `ember serve` or `ember s`
	- Make sure you see `Build successful – Serving on http://localhost:4200/` and `Proxying to http://127.0.0.1:9000` in the build console output
5. Open `http://localhost:4200` in a browser (I recommend Chrome)
