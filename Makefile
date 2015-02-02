coverage:
				rm -rf coverage
				istanbul cover node_modules/.bin/_mocha

test-ci: lint
				istanbul cover ./node_moudles/mocha/bin/_mocha --report lcovonly --R spec && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage