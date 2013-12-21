SHELL=/bin/bash
JS_TEST_LOC = $(shell find ./tests/spec/ -name '*.js' | xargs cat | sed '/^$$/d' | wc -l)
JS_LOC = $(shell find ./built/ -name '*.js' | xargs cat | sed '/^$$/d' | wc -l)

.PHONY: count-js
count-js:
	@echo ''
	@echo 'JavaScript Test LOC:' $(JS_TEST_LOC)
	@echo '     JavaScript LOC:' $(JS_LOC)
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
	git ca "release"
	git branch -D release

	# git subtree split --prefix built -b release
	# git checkout master
	# git merge -s subtree --no-commit --squash release
	# git branch -D release

css:
	compass watch ./static/css --poll -c ./static/css/config.rb

serve:
	python -m SimpleHTTPServer
