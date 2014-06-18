SHELL=/bin/bash
JS_TEST_LOC = $(shell find ./tests/spec/ -name '*.js' | xargs cat | sed '/^$$/d' | wc -l)
JS_FILES = $(shell find ./built/ -name '*.js' | wc -l)
JS_LOC = $(shell find ./built/ -name '*.js' | xargs cat | sed '/^$$/d' | wc -l)

.PHONY: count-js
count-js:
	@echo ''
	@echo 'JavaScript Test LOC:' $(JS_TEST_LOC)
	@echo '     JavaScript LOC:' $(JS_LOC)
	@echo '   JavaScript Files:' $(JS_FILES)
	@echo '              -----------'
	@echo '                     '$$(( $(JS_TEST_LOC) + $(JS_LOC) ))
	@echo ''

release:
	git checkout --orphan release
	rm -rf *
	git read-tree --prefix= -u develop:built/
	git commit -am "release"
	git checkout master
	git merge -s recursive -X theirs --squash --no-commit release
	git commit -am "release"
	git branch -D release

	# git subtree split --prefix built -b release
	# git checkout master
	# git merge -s subtree --no-commit --squash release
	# git branch -D release

css:
	compass watch ./static/css --poll -c ./static/css/config.rb

push-deps:
	git subtree push --prefix tests/lib/vendor git@github.com:blitzagency/built-deps.git master

update-deps:
	git subtree pull --prefix tests/lib/vendor git@github.com:blitzagency/built-deps.git master --squash

install-test-reqs:
	npm install karma --save-dev
	npm install karma-jasmine@2_0 karma-chrome-launcher --save-dev
	npm install karma-requirejs --save-dev

install-test-cli:
	npm install -g karma-cli

install-test-coverage:
	npm install istanbul karma-coverage --save-dev

serve:
	python -m SimpleHTTPServer
