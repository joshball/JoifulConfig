# JoifulConfig (Details)


## Overview

Configuration in projects with lots of environments and dependencies can be complex, and wasting time tracking down errors in your configuration is especially frustrating. 

JoifulConfig approaches configuration by:
 
- separating physical environments from behaviors environments
- abstracting out constants (which are shared, but don't change) 
- mixes in some templates
- throwing in the awesome Joi validation
- abstract configuration consumption into modules

JoifulConfig is NOT meant for simple examples. It has some overhead to it, so use one of the other awesome config libraries for simpler configuration.

## Concepts and Definitions

We need to define and redefine a few terms. 

### Environments

The biggest overload is the term environment. What exactly is an environment? It seems to me the term 'environment' is used to describe both:
- a physical location to run an application
- a behavioral context to run an application

#### 'Physical' Environments (Depdendencies) 

Many organizations have an application that runs in four or more physical environments:

- local dev box
- shared development environment (for the team)
- integration environment (for integrating with other teams)
- staging environment (for final QA before releasing)
- production environment (where the application is publicly available)

These physical environments have configuration around things like:
- ip addresses
- host names
- credentials  

In other words, your server has a set of dependencies that (may) change depending upon your physical environment. It the simplest example, the database (machine and credentials) you use.

#### 'Behavioral' Environments (Behaviors)

In addition to the physical environment is the 'behavioral' environment on how you want your application to behave. This is often orthogonal to the physical environment. Traditionally, behavioral settings include:
- logging
	- levels
		- prod - warning
		- testing - none
		- dev - debug
- caching
- timeout settings for things like
	- caches
	- authentication
- modules to use
	- mocking for testing
	- mocking for dev
 

### Traditional Configuration

Traditional Configuration tends to group everything together, built around a fuzzy mix of physical envrionments and behaviors. You might see:
- prod
- stage
- dev

This breaks down when you want to run in production or test mode on your dev box, so you might roll your own:
- local_prod
- local_test
- local_dev

And this is fine, the world wont come to an end. But in an ideal world we would dry this up, and be more specific. Hence JoifulConfig...



### Files

There are five types of files that you can define:
- environments
- constants
- behaviors
- dependencies
- modules

The files can be either CommonJS modules (i.e. js) or JSON files. These would be equivalent:

#### CommonJS: `examples/complex/config/constants.js`

	var constants = {
	    common: {
			monthInMs: 1000*60*60*24*30
		},
		logging: {
			levels: ['error', 'warn', 'info', 'debug', 'trace']
		}
	};
	module.exports = constants;

#### JSON: `examples/complex/config/constants.json`

	{
	    "common": {
			"monthInMs": 1000*60*60*24*30
		},
	    "logging": {
			"levels": ["error", "warn', "info", "debug", "trace"]
		}
	}


They can also either be single files, or directory aggregated files. For instance, instead of the above `examples/complex/config/constants.js`, you could have:

	examples/complex/config/constants/common.js
	var constants = {
	    monthInMs: 1000*60*60*24*30
	};
	module.exports = constants;

	examples/complex/config/constants/logging.js
	var constants = {
	    levels: ['error', 'warn', 'info', 'debug', 'trace']
	};
	module.exports = constants;

Which will aggregate to `examples/complex/config/constants.js`




## Example

Take a look at `examples/complex`


## Understanding a complex example

We have gone over environments, dependencies, behaviors, and constants. Those should be self explanatory in the examples.


### Templates and Validation

The only parts left are templating and validation. There are several 'special' values that are available in the config. The easiest way to understand these are probably from the tests. Here is an example:


	var config = {
		gandalf: { 
			age: 150, 
			friends: ['bilbo', 'frodo'],

			ageTempl: '{{ gandalf.age }}', 
			ageDot: '##:gandalf.age' ,

            friendsTempl: '{{ gandalf.friends }}',
            friendsDot: '##:gandalf.friends'
		}
	};


- ageTempl  will be processed using inline string templates (using nunjucks)
	- it will set the value of config.gandalf.ageTempl = "150" (note it is a string) 
- ageDot - will use a special object macro to set the value to the object
	- it will set the value of config.gandalf.ageDot = 150 (note it is an int)
	 
TODO: flush this out.
